import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CategoryStat } from '../../types/expense';
import { formatVND } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import { PieChart as PieIcon, Layers } from 'lucide-react';

interface CategoryDonutChartProps {
  categoryStats: CategoryStat[];
  totalSpend: number;
  onSelectCategory?: (categoryId: string) => void;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categoryStats,
  totalSpend,
  onSelectCategory,
}) => {
  if (categoryStats.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center h-[340px]">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
          <Layers size={24} />
        </div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Chưa có dữ liệu danh mục
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Các khoản chi trong kỳ sẽ được phân bổ và biểu diễn biểu đồ cơ cấu tại đây.
        </p>
      </div>
    );
  }

  const chartData = categoryStats.map((item) => ({
    name: item.category.name,
    value: item.totalAmount,
    color: item.category.color,
    percentage: item.percentage,
    id: item.category.id,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
          <p className="font-semibold text-xs sm:text-sm mb-0.5">{data.name}</p>
          <p className="text-emerald-400 font-bold text-sm sm:text-base">{formatVND(data.value)}</p>
          <p className="text-slate-400 text-[11px]">Chiếm {data.percentage}% tổng chi</p>
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
            <PieIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Cơ Cấu Danh Mục Chi Tiêu
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Phân bổ tỷ trọng các nhóm chi tiêu trong kỳ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-6 relative h-[210px] sm:h-[260px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Info in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Tổng chi
            </span>
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {formatVND(totalSpend)}
            </span>
            <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {categoryStats.length} danh mục
            </span>
          </div>
        </div>

        {/* Top Categories Ranking List */}
        <div className="md:col-span-6 space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {categoryStats.map((item) => {
            const isClickable = Boolean(onSelectCategory);
            return (
              <div
                key={item.category.id}
                onClick={() => onSelectCategory && onSelectCategory(item.category.id)}
                className={`p-2 rounded-xl transition-all ${
                  isClickable
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer active:scale-[0.99]'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: item.category.bgLight }}
                    >
                      <CategoryIcon
                        name={item.category.icon}
                        size={13}
                        color={item.category.color}
                      />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px] sm:text-xs">
                      {item.category.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">
                      ({item.count})
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">
                      {formatVND(item.totalAmount)}
                    </span>
                    <span className="ml-1 font-bold text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-[11px]">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Micro progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.category.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
