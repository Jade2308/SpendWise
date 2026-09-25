import React from 'react';
import {
  WalletCards,
  Plus,
  Moon,
  Sun,
  Sparkles,
  Printer,
  Calendar,
} from 'lucide-react';
import { useExpenseStore } from '../../store/useExpenseStore';
import type { DateRangeOption } from '../../types/expense';

interface HeaderProps {
  onOpenAddExpense: () => void;
  onPrintReport: () => void;
  periodLabel: string;
}

const DATE_RANGE_OPTIONS: { id: DateRangeOption; label: string }[] = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'this_week', label: 'Tuần này' },
  { id: 'this_month', label: 'Tháng này' },
  { id: 'last_month', label: 'Tháng trước' },
  { id: 'this_year', label: 'Năm nay' },
  { id: 'all', label: 'Tất cả' },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenAddExpense,
  onPrintReport,
  periodLabel,
}) => {
  const { theme, toggleTheme, filter, setFilter, loadMockData } = useExpenseStore();

  const handleRangeChange = (range: DateRangeOption) => {
    setFilter({
      dateFilter: {
        ...filter.dateFilter,
        range,
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex flex-col gap-2.5">
          {/* Top Bar: Brand, Quick Period & Actions */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                <WalletCards size={22} className="stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Spend<span className="text-emerald-500">Wise</span>
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Kiểm soát dòng tiền & Thống kê thông minh
                </p>
              </div>
            </div>

            {/* Quick Actions (Right) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  if (window.confirm('Tải lại dữ liệu mẫu (35+ giao dịch)?')) {
                    loadMockData();
                  }
                }}
                title="Dữ liệu mẫu"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Dữ liệu mẫu</span>
              </button>

              <button
                onClick={onPrintReport}
                title="In báo cáo tài chính"
                className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <Printer size={18} />
              </button>

              <button
                onClick={toggleTheme}
                title="Đổi giao diện Sáng / Tối"
                className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>

              <button
                onClick={onOpenAddExpense}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all"
              >
                <Plus size={18} className="stroke-[2.5]" />
                <span>Ghi khoản chi</span>
              </button>
            </div>
          </div>

          {/* Time Range Filter Bar - Horizontal Touch Scrollable */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 sm:p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0 gap-0.5">
                {DATE_RANGE_OPTIONS.map((opt) => {
                  const isActive = filter.dateFilter.range === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleRangeChange(opt.id)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 px-3 py-1.5 sm:py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
              <Calendar size={14} />
              <span className="truncate max-w-[120px] sm:max-w-none">{periodLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
