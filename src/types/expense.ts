export type PaymentMethodType = 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet';

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethodType;
  note: string;
  isRecurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  receiptImage?: string; // base64
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  budgetLimit?: number;
}

export interface PaymentMethodInfo {
  id: PaymentMethodType;
  name: string;
  icon: string;
}

export type DateRangeOption =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'custom'
  | 'all';

export interface DateFilter {
  range: DateRangeOption;
  startDate?: string;
  endDate?: string;
}

export interface BudgetConfig {
  monthlyTotal: number;
  categoryBudgets: Record<string, number>;
}

export interface FilterState {
  searchQuery: string;
  dateFilter: DateFilter;
  categoryId: string; // 'all' or category id
  paymentMethod: string; // 'all' or payment method type
  minAmount?: number;
  maxAmount?: number;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
}

export interface CategoryStat {
  category: Category;
  totalAmount: number;
  percentage: number;
  count: number;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  dayLabel: string; // '01/05' or 'T2'
  totalAmount: number;
  cumulativeAmount: number;
  count: number;
}

export interface MonthlyStat {
  monthKey: string; // '2026-05'
  monthLabel: string; // 'T5/2026'
  totalAmount: number;
  count: number;
}

export interface WeekdayStat {
  dayOfWeek: number; // 0 for Sunday, 1 for Monday...
  dayName: string; // 'Thứ 2', 'Thứ 3'...
  totalAmount: number;
  percentage: number;
  count: number;
  averageAmount: number;
}

export interface PaymentStat {
  method: PaymentMethodType;
  name: string;
  totalAmount: number;
  percentage: number;
  count: number;
}

export interface AnalyticsSummary {
  totalSpend: number;
  transactionCount: number;
  dailyAverage: number;
  projectedMonthEnd: number;
  previousPeriodSpend: number;
  changeRate: number; // percentage change vs previous period (e.g. +12% or -5%)
  highestSingleExpense?: Expense;
  topCategory?: CategoryStat;
  budgetUtilization: number; // percentage
  noSpendDaysCount: number;
  activeDaysCount: number;
}
