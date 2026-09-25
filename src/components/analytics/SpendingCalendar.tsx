import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Expense, Category } from '../../types/expense';
import { formatVND, formatCompactVND } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface SpendingCalendarProps {
  expenses: Expense[];
  categories: Category[];
}

export const SpendingCalendar: React.FC<SpendingCalendarProps> = ({
  expenses,
  categories,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Map expenses by YYYY-MM-DD
  const expenseMap = new Map<string, { total: number; items: Expense[] }>();
  expenses.forEach((e) => {
    const cur = expenseMap.get(e.date) || { total: 0, items: [] };
    cur.total += e.amount;
    cur.items.push(e);
    expenseMap.set(e.date, cur);
  });

  // Calculate stats for current month
  let currentMonthTotal = 0;
  let noSpendDays = 0;
  let activeDays = 0;

  const currentMonthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  currentMonthDays.forEach((d) => {
    const dateKey = format(d, 'yyyy-MM-dd');
    const data = expenseMap.get(dateKey);
    if (data && data.total > 0) {
      currentMonthTotal += data.total;
      activeDays++;
    } else {
      noSpendDays++;
    }
  });

  // Selected date details
  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedDayData = selectedDateKey ? expenseMap.get(selectedDateKey) : null;

  const getHeatmapColor = (total: number, inMonth: boolean) => {
    if (!inMonth) return 'opacity-25 bg-slate-50 dark:bg-slate-900/40 text-slate-400';
    if (total === 0) return 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50';
    if (total < 200000) return 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50';
    if (total < 800000) return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50';
    return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Calendar Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarDays size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white capitalize">
                Tháng {format(currentMonth, 'MM/yyyy', { locale: vi })}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Mật độ chi tiêu & Ngày không tiêu tiền
              </p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 sm:p-1.5 rounded-xl gap-0.5">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
              title="Tháng trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900"
            >
              Hôm nay
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
              title="Tháng sau"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Quick Month Metrics - 3 columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 truncate">
            <span className="text-[9px] sm:text-[11px] font-semibold text-slate-500 uppercase truncate block">
              Tổng chi tháng
            </span>
            <div className="text-xs sm:text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5 truncate">
              {formatCompactVND(currentMonthTotal)}
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 truncate">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase truncate">
                No-Spend
              </span>
              <CheckCircle2 size={13} className="text-emerald-600 hidden sm:inline" />
            </div>
            <div className="text-xs sm:text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
              {noSpendDays} ngày
            </div>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 truncate">
            <span className="text-[9px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase truncate block">
              Ngày có chi
            </span>
            <div className="text-xs sm:text-xl font-black text-amber-700 dark:text-amber-400 mt-0.5 truncate">
              {activeDays} ngày
            </div>
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-[10px] sm:text-xs text-slate-500 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Chú thích:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300 inline-block" />
            <span>0đ (No-Spend)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-teal-100 border border-teal-300 inline-block" />
            <span>&lt; 200k</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 inline-block" />
            <span>200k - 800k</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-rose-400 inline-block" />
            <span>&gt; 800k</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((w, idx) => (
            <div
              key={w}
              className={`text-center py-1 sm:py-2 text-[10px] sm:text-xs font-bold ${
                idx >= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {w}
            </div>
          ))}

          {/* Calendar Day Tiles */}
          {calendarDays.map((day) => {
            const inMonth = isSameMonth(day, currentMonth);
            const dateStr = format(day, 'yyyy-MM-dd');
            const data = expenseMap.get(dateStr);
            const total = data ? data.total : 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isSameDay(day, new Date());

            return (
              <button
                key={dateStr}
                onClick={() => inMonth && setSelectedDate(day)}
                className={`min-h-[48px] sm:min-h-[74px] p-1 sm:p-2 rounded-xl flex flex-col justify-between text-left transition-all ${getHeatmapColor(
                  total,
                  inMonth
                )} ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 shadow-md scale-[1.03] z-10'
                    : 'hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] sm:text-xs font-bold ${
                      isTodayDate
                        ? 'w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] sm:text-[10px]'
                        : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {total === 0 && inMonth && (
                    <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold" title="No-spend day">
                      ✓
                    </span>
                  )}
                </div>

                {inMonth && (
                  <div className="mt-0.5">
                    {total > 0 ? (
                      <span className="text-[9px] sm:text-xs font-extrabold truncate block">
                        {formatCompactVND(total)}
                      </span>
                    ) : (
                      <span className="text-[8px] sm:text-[10px] opacity-60">0đ</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDate && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles size={16} className="text-emerald-500" />
              <h4 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white">
                {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi })}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] sm:text-xs text-slate-500">Tổng: </span>
              <span className="text-xs sm:text-base font-extrabold text-rose-600 dark:text-rose-400">
                {selectedDayData ? formatVND(selectedDayData.total) : '0 ₫'}
              </span>
            </div>
          </div>

          {selectedDayData && selectedDayData.items.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {selectedDayData.items.map((item) => {
                const cat = categories.find((c) => c.id === item.categoryId);
                return (
                  <div
                    key={item.id}
                    className="py-2.5 flex items-center justify-between gap-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cat?.bgLight || '#f1f5f9' }}
                      >
                        <CategoryIcon
                          name={cat?.icon || 'Tag'}
                          size={14}
                          color={cat?.color}
                        />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {item.note || cat?.name || 'Khoản chi'}
                        </div>
                        <div className="text-slate-400 text-[10px] sm:text-[11px] flex items-center gap-1.5">
                          <span>{cat?.name}</span>
                          {item.isRecurring && (
                            <span className="px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                              Định kỳ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="font-black text-xs sm:text-sm text-rose-600 dark:text-rose-400 shrink-0">
                      -{formatVND(item.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 sm:p-6 text-center text-slate-400 text-xs bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-900/30">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                🎉 Tuyệt vời! Bạn không chi tiêu đồng nào trong ngày này.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
