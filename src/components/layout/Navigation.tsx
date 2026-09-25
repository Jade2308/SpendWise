import React from 'react';
import {
  BarChart3,
  ReceiptText,
  CalendarDays,
  Target,
  Settings2,
} from 'lucide-react';

export type NavTab = 'analytics' | 'ledger' | 'calendar' | 'budget' | 'settings';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  expenseCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  expenseCount,
}) => {
  const tabs = [
    {
      id: 'analytics' as NavTab,
      label: 'Báo Cáo & Thống Kê',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'ledger' as NavTab,
      label: 'Danh Sách Chi Tiêu',
      icon: ReceiptText,
      badge: expenseCount > 0 ? expenseCount : null,
    },
    {
      id: 'calendar' as NavTab,
      label: 'Lịch Nhiệt Chi Tiêu',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'budget' as NavTab,
      label: 'Hạn Mức Ngân Sách',
      icon: Target,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Dữ Liệu & Cài Đặt',
      icon: Settings2,
      badge: null,
    },
  ];

  return (
    <nav className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200/80 dark:border-emerald-800/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
