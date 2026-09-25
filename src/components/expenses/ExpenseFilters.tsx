import React, { useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import type { Category, FilterState } from '../../types/expense';
import { PAYMENT_METHODS } from '../../constants/paymentMethods';

interface ExpenseFiltersProps {
  filter: FilterState;
  categories: Category[];
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalFilteredCount?: number;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filter,
  categories,
  onFilterChange,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filter.searchQuery.trim() !== '' ||
    filter.categoryId !== 'all' ||
    filter.paymentMethod !== 'all' ||
    filter.minAmount !== undefined ||
    filter.maxAmount !== undefined ||
    filter.sortBy !== 'date_desc';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all mb-3 sm:mb-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm theo ghi chú, danh mục..."
            value={filter.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Dropdowns Row on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          {/* Category Dropdown */}
          <div className="w-full sm:w-44">
            <select
              value={filter.categoryId}
              onChange={(e) => onFilterChange({ categoryId: e.target.value })}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full sm:w-40">
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date_desc">Mới nhất</option>
              <option value="date_asc">Cũ nhất</option>
              <option value="amount_desc">Tiền: Cao nhất</option>
              <option value="amount_asc">Tiền: Thấp nhất</option>
            </select>
          </div>
        </div>

        {/* Action buttons (Advanced & Reset) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              showAdvanced || filter.paymentMethod !== 'all' || filter.minAmount !== undefined || filter.maxAmount !== undefined
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Lọc nâng cao</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              title="Xóa bộ lọc"
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Expandable Section */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 animate-fadeIn">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Phương thức thanh toán
            </label>
            <select
              value={filter.paymentMethod}
              onChange={(e) => onFilterChange({ paymentMethod: e.target.value })}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
            >
              <option value="all">Tất cả phương thức</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Số tiền tối thiểu (VND)
            </label>
            <input
              type="number"
              placeholder="VD: 50000"
              value={filter.minAmount !== undefined ? filter.minAmount : ''}
              onChange={(e) =>
                onFilterChange({
                  minAmount: e.target.value ? parseInt(e.target.value, 10) : undefined,
                })
              }
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Số tiền tối đa (VND)
            </label>
            <input
              type="number"
              placeholder="VD: 2000000"
              value={filter.maxAmount !== undefined ? filter.maxAmount : ''}
              onChange={(e) =>
                onFilterChange({
                  maxAmount: e.target.value ? parseInt(e.target.value, 10) : undefined,
                })
              }
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
