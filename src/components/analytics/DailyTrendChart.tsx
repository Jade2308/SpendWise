import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { DailyStat } from '../../types/expense';
import { formatVND, formatCompactVND } from '../../utils/currency';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface DailyTrendChartProps {
  dailyStats: DailyStat[];
  dailyAverage: number;
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({
  dailyStats,
  dailyAverage,
}) => {
  const [chartMode, setChartMode] = useState<'bar' | 'area'>('bar');

  if (dailyStats.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-medium text-slate-300 mb-1">Ngày {data.date}</p>
          <div className="space-y-1">
            <p className="text-emerald-400 font-bold text-xs sm:text-sm">
              Chi tiêu ngày: {formatVND(data.totalAmount)}
            </p>
            {chartMode === 'area' && (
              <p className="text-teal-300 font-semibold text-[11px]">
                Lũy kế: {formatVND(data.cumulativeAmount)}
              </p>
            )}
            <p className="text-slate-400 text-[10px]">
              {data.count > 0 ? `${data.count} khoản chi` : 'Không có chi'}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Xu Hướng Chi Tiêu Hàng Ngày
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Biến động chi tiêu và đường tích lũy theo từng ngày
            </p>
          </div>
        </div>

        {/* View toggle pills */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 sm:p-1.5 rounded-xl self-start sm:self-auto gap-1">
          <button
            onClick={() => setChartMode('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'bar'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 size={14} />
            <span>Từng ngày</span>
          </button>
          <button
            onClick={() => setChartMode('area')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'area'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp size={14} />
            <span>Tích lũy</span>
          </button>
        </div>
      </div>

      <div className="h-[210px] sm:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'bar' ? (
            <BarChart data={dailyStats} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
              <XAxis
                dataKey="dayLabel"
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
              {dailyAverage > 0 && (
                <ReferenceLine
                  y={dailyAverage}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: `TB: ${formatCompactVND(dailyAverage)}`,
                    fill: '#f59e0b',
                    fontSize: 9,
                    position: 'insideTopRight',
                  }}
                />
              )}
              <Bar
                dataKey="totalAmount"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          ) : (
            <AreaChart data={dailyStats} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulativeEmerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
              <XAxis
                dataKey="dayLabel"
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
              <Area
                type="monotone"
                dataKey="cumulativeAmount"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCumulativeEmerald)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
