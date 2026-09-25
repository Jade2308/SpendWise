import { useMemo } from 'react';
import {
  parseISO,
  isWithinInterval,
  format,
  eachDayOfInterval,
  getDay,
  differenceInCalendarDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns';
import type {
  Expense,
  Category,
  FilterState,
  CategoryStat,
  DailyStat,
  MonthlyStat,
  WeekdayStat,
  PaymentStat,
  AnalyticsSummary,
} from '../types/expense';
import { getDateRangeBounds, getPreviousPeriodBounds } from '../utils/date';
import { PAYMENT_METHODS } from '../constants/paymentMethods';

interface UseExpenseAnalyticsProps {
  expenses: Expense[];
  categories: Category[];
  monthlyBudget: number;
  filter: FilterState;
}

export function useExpenseAnalytics({
  expenses,
  categories,
  monthlyBudget,
  filter,
}: UseExpenseAnalyticsProps) {
  // 1. Calculate Active Date Range Bounds
  const { startDate, endDate, label: periodLabel } = useMemo(() => {
    return getDateRangeBounds(
      filter.dateFilter.range,
      filter.dateFilter.startDate,
      filter.dateFilter.endDate
    );
  }, [filter.dateFilter]);

  // Previous period bounds for comparative statistics
  const { prevStart, prevEnd } = useMemo(() => {
    return getPreviousPeriodBounds(startDate, endDate);
  }, [startDate, endDate]);

  // 2. Filter expenses by date, category, search, payment method, amount
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Date filter
      try {
        const itemDate = parseISO(item.date);
        if (!isWithinInterval(itemDate, { start: startDate, end: endDate })) {
          return false;
        }
      } catch {
        return false;
      }

      // Category filter
      if (filter.categoryId !== 'all' && item.categoryId !== filter.categoryId) {
        return false;
      }

      // Payment method filter
      if (filter.paymentMethod !== 'all' && item.paymentMethod !== filter.paymentMethod) {
        return false;
      }

      // Search query (in note or category name)
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase().trim();
        const cat = categories.find((c) => c.id === item.categoryId);
        const matchNote = item.note.toLowerCase().includes(q);
        const matchCategory = cat ? cat.name.toLowerCase().includes(q) : false;
        if (!matchNote && !matchCategory) {
          return false;
        }
      }

      // Min amount
      if (filter.minAmount !== undefined && item.amount < filter.minAmount) {
        return false;
      }

      // Max amount
      if (filter.maxAmount !== undefined && item.amount > filter.maxAmount) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filter.sortBy) {
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        case 'date_desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [expenses, categories, startDate, endDate, filter]);

  // Expenses in previous period (for trend comparison)
  const previousPeriodExpenses = useMemo(() => {
    return expenses.filter((item) => {
      try {
        const itemDate = parseISO(item.date);
        return isWithinInterval(itemDate, { start: prevStart, end: prevEnd });
      } catch {
        return false;
      }
    });
  }, [expenses, prevStart, prevEnd]);

  // 3. Category Stats Breakdown
  const categoryStats = useMemo<CategoryStat[]>(() => {
    const totalSpend = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const catMap = new Map<string, { total: number; count: number }>();

    filteredExpenses.forEach((e) => {
      const cur = catMap.get(e.categoryId) || { total: 0, count: 0 };
      catMap.set(e.categoryId, {
        total: cur.total + e.amount,
        count: cur.count + 1,
      });
    });

    const result: CategoryStat[] = categories
      .map((cat) => {
        const data = catMap.get(cat.id) || { total: 0, count: 0 };
        const percentage = totalSpend > 0 ? Math.round((data.total / totalSpend) * 1000) / 10 : 0;
        return {
          category: cat,
          totalAmount: data.total,
          percentage,
          count: data.count,
        };
      })
      .filter((c) => c.totalAmount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return result;
  }, [filteredExpenses, categories]);

  // 4. Daily Time-Series Stats
  const dailyStats = useMemo<DailyStat[]>(() => {
    if (filter.dateFilter.range === 'all') {
      // Group by distinct expense dates if range is 'all'
      const dateMap = new Map<string, { total: number; count: number }>();
      filteredExpenses.forEach((e) => {
        const cur = dateMap.get(e.date) || { total: 0, count: 0 };
        dateMap.set(e.date, { total: cur.total + e.amount, count: cur.count + 1 });
      });

      const sortedDates = Array.from(dateMap.keys()).sort();
      let cumulative = 0;
      return sortedDates.map((dateStr) => {
        const val = dateMap.get(dateStr)!;
        cumulative += val.total;
        return {
          date: dateStr,
          dayLabel: format(parseISO(dateStr), 'dd/MM'),
          totalAmount: val.total,
          cumulativeAmount: cumulative,
          count: val.count,
        };
      });
    }

    // Interval of days within current bounds (capped at 90 days to maintain snappy performance)
    const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
    if (dayCount <= 0 || dayCount > 90) {
      // Fallback to grouping by date
      const dateMap = new Map<string, { total: number; count: number }>();
      filteredExpenses.forEach((e) => {
        const cur = dateMap.get(e.date) || { total: 0, count: 0 };
        dateMap.set(e.date, { total: cur.total + e.amount, count: cur.count + 1 });
      });
      const sortedDates = Array.from(dateMap.keys()).sort();
      let cumulative = 0;
      return sortedDates.map((dateStr) => {
        const val = dateMap.get(dateStr)!;
        cumulative += val.total;
        return {
          date: dateStr,
          dayLabel: format(parseISO(dateStr), 'dd/MM'),
          totalAmount: val.total,
          cumulativeAmount: cumulative,
          count: val.count,
        };
      });
    }

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const dayExpenseMap = new Map<string, { total: number; count: number }>();

    filteredExpenses.forEach((e) => {
      const cur = dayExpenseMap.get(e.date) || { total: 0, count: 0 };
      dayExpenseMap.set(e.date, { total: cur.total + e.amount, count: cur.count + 1 });
    });

    let cumulative = 0;
    return allDays.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const val = dayExpenseMap.get(dateStr) || { total: 0, count: 0 };
      cumulative += val.total;
      return {
        date: dateStr,
        dayLabel: format(d, 'dd/MM'),
        totalAmount: val.total,
        cumulativeAmount: cumulative,
        count: val.count,
      };
    });
  }, [filteredExpenses, startDate, endDate, filter.dateFilter.range]);

  // 5. Monthly History Comparison (Last 6 Months)
  const monthlyStats = useMemo<MonthlyStat[]>(() => {
    const months: MonthlyStat[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const targetMonthDate = subMonths(now, i);
      const mStart = startOfMonth(targetMonthDate);
      const mEnd = endOfMonth(targetMonthDate);
      const mKey = format(targetMonthDate, 'yyyy-MM');
      const mLabel = `T${format(targetMonthDate, 'M/yy')}`;

      const monthlyExpenses = expenses.filter((e) => {
        try {
          const d = parseISO(e.date);
          return isWithinInterval(d, { start: mStart, end: mEnd });
        } catch {
          return false;
        }
      });

      const total = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
      months.push({
        monthKey: mKey,
        monthLabel: mLabel,
        totalAmount: total,
        count: monthlyExpenses.length,
      });
    }

    return months;
  }, [expenses]);

  // 6. Weekday Spending Breakdown (Thứ 2 -> Chủ Nhật)
  const weekdayStats = useMemo<WeekdayStat[]>(() => {
    const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const totalSpend = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    const map = new Map<number, { total: number; count: number }>();
    for (let i = 0; i <= 6; i++) {
      map.set(i, { total: 0, count: 0 });
    }

    filteredExpenses.forEach((e) => {
      try {
        const d = parseISO(e.date);
        const dayOfWeek = getDay(d); // 0 = Sunday, 1 = Monday
        const cur = map.get(dayOfWeek)!;
        map.set(dayOfWeek, { total: cur.total + e.amount, count: cur.count + 1 });
      } catch {
        // ignore
      }
    });

    // Reorder from Monday (1) to Sunday (0)
    const orderedKeys = [1, 2, 3, 4, 5, 6, 0];
    return orderedKeys.map((k) => {
      const val = map.get(k)!;
      const percentage = totalSpend > 0 ? Math.round((val.total / totalSpend) * 1000) / 10 : 0;
      const averageAmount = val.count > 0 ? Math.round(val.total / val.count) : 0;
      return {
        dayOfWeek: k,
        dayName: dayNames[k],
        totalAmount: val.total,
        percentage,
        count: val.count,
        averageAmount,
      };
    });
  }, [filteredExpenses]);

  // 7. Payment Method Breakdown
  const paymentStats = useMemo<PaymentStat[]>(() => {
    const totalSpend = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const map = new Map<string, { total: number; count: number }>();

    filteredExpenses.forEach((e) => {
      const cur = map.get(e.paymentMethod) || { total: 0, count: 0 };
      map.set(e.paymentMethod, { total: cur.total + e.amount, count: cur.count + 1 });
    });

    return PAYMENT_METHODS.map((pm) => {
      const val = map.get(pm.id) || { total: 0, count: 0 };
      const percentage = totalSpend > 0 ? Math.round((val.total / totalSpend) * 1000) / 10 : 0;
      return {
        method: pm.id,
        name: pm.name,
        totalAmount: val.total,
        percentage,
        count: val.count,
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredExpenses]);

  // 8. Heatmap Calendar Day Map
  const calendarDayMap = useMemo(() => {
    const map = new Map<string, { total: number; expenses: Expense[] }>();
    filteredExpenses.forEach((e) => {
      const cur = map.get(e.date) || { total: 0, expenses: [] };
      cur.total += e.amount;
      cur.expenses.push(e);
      map.set(e.date, cur);
    });
    return map;
  }, [filteredExpenses]);

  // 9. Analytics Summary / KPI Cards
  const summary = useMemo<AnalyticsSummary>(() => {
    const totalSpend = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const transactionCount = filteredExpenses.length;

    // Distinct active spending days
    const activeDates = new Set(filteredExpenses.map((e) => e.date));
    const activeDaysCount = activeDates.size;

    // Daily average based on total elapsed days in period or active days
    const totalDaysInInterval = Math.max(1, differenceInCalendarDays(endDate, startDate) + 1);
    const dailyAverage = Math.round(totalSpend / totalDaysInInterval);

    // Projected Month End Spend (if filtering this month)
    const now = new Date();
    const isCurrentMonth =
      startDate.getFullYear() === now.getFullYear() && startDate.getMonth() === now.getMonth();
    const daysInMonth = endOfMonth(now).getDate();
    const currentDayNumber = now.getDate();
    const projectedMonthEnd = isCurrentMonth
      ? currentDayNumber > 0
        ? Math.round((totalSpend / currentDayNumber) * daysInMonth)
        : totalSpend
      : totalSpend;

    // Previous period comparisons
    const previousPeriodSpend = previousPeriodExpenses.reduce((sum, e) => sum + e.amount, 0);
    const changeRate =
      previousPeriodSpend > 0
        ? Math.round(((totalSpend - previousPeriodSpend) / previousPeriodSpend) * 1000) / 10
        : 0;

    // Highest single expense
    const highestSingleExpense = [...filteredExpenses].sort((a, b) => b.amount - a.amount)[0];

    // Top Category
    const topCategory = categoryStats[0];

    // Budget utilization
    const budgetUtilization =
      monthlyBudget > 0 ? Math.round((totalSpend / monthlyBudget) * 1000) / 10 : 0;

    // No-spend days count within interval
    const noSpendDaysCount = Math.max(0, totalDaysInInterval - activeDaysCount);

    return {
      totalSpend,
      transactionCount,
      dailyAverage,
      projectedMonthEnd,
      previousPeriodSpend,
      changeRate,
      highestSingleExpense,
      topCategory,
      budgetUtilization,
      noSpendDaysCount,
      activeDaysCount,
    };
  }, [
    filteredExpenses,
    previousPeriodExpenses,
    categoryStats,
    startDate,
    endDate,
    monthlyBudget,
  ]);

  return {
    filteredExpenses,
    summary,
    categoryStats,
    dailyStats,
    monthlyStats,
    weekdayStats,
    paymentStats,
    calendarDayMap,
    periodLabel,
    startDate,
    endDate,
  };
}
