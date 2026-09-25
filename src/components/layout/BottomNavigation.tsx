import React from 'react';
import {
  BarChart3,
  ReceiptText,
  CalendarDays,
  Target,
  Settings2,
  Plus,
} from 'lucide-react';
import type { NavTab } from './Navigation';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddExpense: () => void;
  expenseCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenAddExpense,
  expenseCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5 items-center h-[70px] max-w-lg mx-auto px-2 pb-1">
        {/* Tab 1: Analytics */}
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            activeTab === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <BarChart3
              size={23}
              className={activeTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-2'}
            />
            {activeTab === 'analytics' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold mt-1">Thống kê</span>
        </button>

        {/* Tab 2: Ledger */}
        <button
          onClick={() => onTabChange('ledger')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            activeTab === 'ledger'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <ReceiptText
              size={23}
              className={activeTab === 'ledger' ? 'stroke-[2.5]' : 'stroke-2'}
            />
            {expenseCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 min-w-[17px] text-center rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                {expenseCount > 99 ? '99+' : expenseCount}
              </span>
            )}
            {activeTab === 'ledger' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold mt-1">Sổ chi</span>
        </button>

        {/* Center: Quick Add Expense Button */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={onOpenAddExpense}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 active:scale-95 hover:scale-105 transition-all -mt-6 border-4 border-slate-50 dark:border-slate-950"
            aria-label="Ghi khoản chi"
          >
            <Plus size={28} className="stroke-[3]" />
          </button>
          <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Ghi chi
          </span>
        </div>

        {/* Tab 3: Calendar */}
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            activeTab === 'calendar'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <CalendarDays
              size={23}
              className={activeTab === 'calendar' ? 'stroke-[2.5]' : 'stroke-2'}
            />
            {activeTab === 'calendar' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold mt-1">Lịch</span>
        </button>

        {/* Tab 4: Budget / Settings */}
        <button
          onClick={() => onTabChange(activeTab === 'settings' ? 'settings' : 'budget')}
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            activeTab === 'budget' || activeTab === 'settings'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            {activeTab === 'settings' ? (
              <Settings2 size={23} className="stroke-[2.5]" />
            ) : (
              <Target size={23} className={activeTab === 'budget' ? 'stroke-[2.5]' : 'stroke-2'} />
            )}
            {(activeTab === 'budget' || activeTab === 'settings') && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold mt-1">
            {activeTab === 'settings' ? 'Cài đặt' : 'Ngân sách'}
          </span>
        </button>
      </div>
    </div>
  );
};
