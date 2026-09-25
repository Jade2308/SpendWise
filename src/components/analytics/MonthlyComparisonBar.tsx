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
import type { MonthlyStat } from '../../types/expense';
import { formatVND, formatCompactVND } from '../../utils/currency';
import { CalendarRange } from 'lucide-react';

interface MonthlyComparisonBarProps {
  monthlyStats: MonthlyStat[];
}

export const MonthlyComparisonBar: React.FC<MonthlyComparisonBarProps> = ({
  monthlyStats,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-semibold text-xs sm:text-sm mb-0.5">{data.monthLabel}</p>
          <p className="text-emerald-400 font-bold text-xs sm:text-sm">
            Tổng chi: {formatVND(data.totalAmount)}
          </p>
          <p className="text-slate-400 mt-0.5 text-[10px]">{data.count} khoản chi</p>
        </div>
      );
    }
    return null;
  };

  const currentMonthKey = monthlyStats[monthlyStats.length - 1]?.monthKey;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <CalendarRange size={18} />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Lịch Sử Chi Tiêu 6 Tháng
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            So sánh biến động ngân sách qua các tháng gần nhất
          </p>
        </div>
      </div>

      <div className="h-[190px] sm:h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
            <XAxis
              dataKey="monthLabel"
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
            <Bar dataKey="totalAmount" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {monthlyStats.map((entry) => (
                <Cell
                  key={entry.monthKey}
                  fill={entry.monthKey === currentMonthKey ? '#10b981' : '#94a3b8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
          <span>Tháng hiện tại</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block" />
          <span>Các tháng trước</span>
        </div>
      </div>
    </div>
  );
};
