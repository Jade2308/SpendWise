import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Coins,
  CalendarCheck,
  Flame,
  PieChart,
  Minus,
} from 'lucide-react';
import type { AnalyticsSummary, Category } from '../../types/expense';
import { formatVND } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';

interface StatSummaryCardsProps {
  summary: AnalyticsSummary;
  categories: Category[];
  monthlyBudget?: number;
}

export const StatSummaryCards: React.FC<StatSummaryCardsProps> = ({
  summary,
  categories,
}) => {
  const {
    totalSpend,
    transactionCount,
    dailyAverage,
    projectedMonthEnd,
    changeRate,
    highestSingleExpense,
    activeDaysCount,
  } = summary;

  const highestCat = categories.find(
    (c) => c.id === highestSingleExpense?.categoryId
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Tổng Chi Tiêu */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            Tổng Chi
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Coins size={16} className="sm:size-[19px]" />
          </div>
        </div>

        <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
          {formatVND(totalSpend)}
        </div>

        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs">
          <span className="text-slate-500 dark:text-slate-400 truncate">
            {transactionCount} khoản ({activeDaysCount}d)
          </span>

          {changeRate !== 0 ? (
            <span
              className={`flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-[11px] shrink-0 ${
                changeRate > 0
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
              title="So với cùng kỳ trước"
            >
              {changeRate > 0 ? (
                <>
                  <TrendingUp size={11} />
                  <span>+{changeRate}%</span>
                </>
              ) : (
                <>
                  <TrendingDown size={11} />
                  <span>{changeRate}%</span>
                </>
              )}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-slate-400 text-[10px]">
              <Minus size={11} />
              <span>0%</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Trung Bình Chi Tiêu Ngày & Dự Phóng */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            TB Mỗi Ngày
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <CalendarCheck size={16} className="sm:size-[19px]" />
          </div>
        </div>

        <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
          {formatVND(dailyAverage)}
          <span className="text-[10px] sm:text-xs font-normal text-slate-400 dark:text-slate-500 ml-0.5">
            /d
          </span>
        </div>

        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs truncate">
          <span className="text-slate-500 dark:text-slate-400">Dự kiến:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {formatVND(projectedMonthEnd)}
          </span>
        </div>
      </div>

      {/* 3. Khoản Chi Lớn Nhất */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            Chi Cao Nhất
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame size={16} className="sm:size-[19px]" />
          </div>
        </div>

        <div className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight truncate">
          {highestSingleExpense ? formatVND(highestSingleExpense.amount) : '0 ₫'}
        </div>

        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
          {highestSingleExpense ? (
            <>
              {highestCat && (
                <div
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: highestCat.bgLight }}
                >
                  <CategoryIcon name={highestCat.icon} size={10} color={highestCat.color} />
                </div>
              )}
              <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                {highestSingleExpense.note || highestCat?.name || 'Khoản chi'}
              </span>
            </>
          ) : (
            <span>Chưa có</span>
          )}
        </div>
      </div>

      {/* 4. Danh Mục Chi Nhiều Nhất */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            Nhóm Chi Lớn Nhất
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <PieChart size={16} className="sm:size-[19px]" />
          </div>
        </div>

        <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
          {summary.topCategory ? formatVND(summary.topCategory.totalAmount) : '0 ₫'}
        </div>

        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
          {summary.topCategory ? (
            <>
              <div
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: summary.topCategory.category.bgLight }}
              >
                <CategoryIcon
                  name={summary.topCategory.category.icon}
                  size={10}
                  color={summary.topCategory.category.color}
                />
              </div>
              <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                {summary.topCategory.category.name} ({summary.topCategory.percentage}%)
              </span>
            </>
          ) : (
            <span>Chưa có dữ liệu</span>
          )}
        </div>
      </div>
    </div>
  );
};
