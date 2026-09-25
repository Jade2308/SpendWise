import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import type { WeekdayStat } from '../../types/expense';
import { formatVND, formatCompactVND } from '../../utils/currency';
import { Clock, Coffee } from 'lucide-react';

interface WeekdayHeatmapChartProps {
  weekdayStats: WeekdayStat[];
}

export const WeekdayHeatmapChart: React.FC<WeekdayHeatmapChartProps> = ({
  weekdayStats,
}) => {
  // Weekend vs Weekday
  const weekendSpend = weekdayStats
    .filter((w) => w.dayOfWeek === 0 || w.dayOfWeek === 6)
    .reduce((sum, w) => sum + w.totalAmount, 0);

  const weekdaySpend = weekdayStats
    .filter((w) => w.dayOfWeek >= 1 && w.dayOfWeek <= 5)
    .reduce((sum, w) => sum + w.totalAmount, 0);

  const total = weekendSpend + weekdaySpend;
  const weekendPercent = total > 0 ? Math.round((weekendSpend / total) * 100) : 0;
  const weekdayPercent = total > 0 ? 100 - weekendPercent : 0;

  // Find max spending day
  const maxDay = [...weekdayStats].sort((a, b) => b.totalAmount - a.totalAmount)[0];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-semibold text-xs sm:text-sm mb-0.5">{data.dayName}</p>
          <p className="text-emerald-400 font-bold text-xs sm:text-sm">
            Tổng chi: {formatVND(data.totalAmount)} ({data.percentage}%)
          </p>
          <p className="text-slate-300 mt-0.5 text-[11px]">
            TB mỗi khoản: {formatVND(data.averageAmount)}
          </p>
          <p className="text-slate-400 text-[10px]">{data.count} khoản chi</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Thói Quen Chi Tiêu Theo Thứ
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Ngày nào trong tuần bạn chi tiêu nhiều nhất
            </p>
          </div>
        </div>
      </div>

      {/* Weekend vs Weekday summary pills */}
      <div className="grid grid-cols-2 gap-2.5 mb-3 sm:mb-4">
        <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
          <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
            Trong tuần (T2 - T6)
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 truncate">
            {formatVND(weekdaySpend)}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {weekdayPercent}% tổng chi
          </div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
          <div className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">
            Cuối tuần (T7 & CN)
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 truncate">
            {formatVND(weekendSpend)}
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">
            {weekendPercent}% tổng chi
          </div>
        </div>
      </div>

      <div className="h-[180px] sm:h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekdayStats} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
            <XAxis
              dataKey="dayName"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickFormatter={(val) => formatCompactVND(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalAmount" radius={[5, 5, 0, 0]} maxBarSize={32}>
              {weekdayStats.map((entry) => {
                const isMax = maxDay && entry.dayOfWeek === maxDay.dayOfWeek && maxDay.totalAmount > 0;
                const isWeekend = entry.dayOfWeek === 0 || entry.dayOfWeek === 6;
                return (
                  <Cell
                    key={entry.dayOfWeek}
                    fill={isMax ? '#ef4444' : isWeekend ? '#f59e0b' : '#10b981'}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {maxDay && maxDay.totalAmount > 0 && (
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 sm:p-2.5 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30">
          <div className="flex items-center gap-1.5 truncate">
            <Coffee size={13} className="text-emerald-600 shrink-0" />
            <span className="truncate">Chi nhiều nhất trong tuần:</span>
          </div>
          <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0 ml-1">
            {maxDay.dayName} ({formatVND(maxDay.totalAmount)})
          </span>
        </div>
      )}
    </div>
  );
};
