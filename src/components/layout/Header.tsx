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
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                <WalletCards size={20} className="stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Spend<span className="text-emerald-500">Wise</span>
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 uppercase tracking-wider">
                    Sổ Chi Tiêu
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
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
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] font-semibold hidden xs:inline">Dữ liệu mẫu</span>
              </button>

              <button
                onClick={onPrintReport}
                title="In báo cáo tài chính"
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <Printer size={16} />
              </button>

              <button
                onClick={toggleTheme}
                title="Đổi giao diện Sáng / Tối"
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
              </button>

              <button
                onClick={onOpenAddExpense}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all"
              >
                <Plus size={16} className="stroke-[2.5]" />
                <span>Ghi khoản chi</span>
              </button>
            </div>
          </div>

          {/* Time Range Filter Bar - Horizontal Touch Scrollable */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                {DATE_RANGE_OPTIONS.map((opt) => {
                  const isActive = filter.dateFilter.range === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleRangeChange(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40">
              <Calendar size={12} />
              <span className="truncate max-w-[120px] sm:max-w-none">{periodLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
