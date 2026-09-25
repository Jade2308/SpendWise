import React, { useMemo } from 'react';
import type { Expense, Category } from '../../types/expense';
import { ExpenseItem } from './ExpenseItem';
import { formatFriendlyDate } from '../../utils/date';
import { formatVND } from '../../utils/currency';
import { ReceiptText, Plus, Download } from 'lucide-react';
import { exportExpensesToCSV } from '../../utils/exportExcel';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onOpenAddExpense: () => void;
  onEditExpense: (expense: Expense) => void;
  onDuplicateExpense: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  periodLabel: string;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  categories,
  onOpenAddExpense,
  onEditExpense,
  onDuplicateExpense,
  onDeleteExpense,
  periodLabel,
}) => {
  // Group expenses by date string
  const groupedExpenses = useMemo(() => {
    const groups: { date: string; items: Expense[]; total: number }[] = [];
    const map = new Map<string, Expense[]>();

    expenses.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });

    const seen = new Set<string>();
    expenses.forEach((e) => {
      if (!seen.has(e.date)) {
        seen.add(e.date);
        const items = map.get(e.date) || [];
        const total = items.reduce((sum, item) => sum + item.amount, 0);
        groups.push({ date: e.date, items, total });
      }
    });

    return groups;
  }, [expenses]);

  const totalFilteredAmount = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center my-4 sm:my-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-sm">
          <ReceiptText size={28} />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
          Chưa tìm thấy khoản chi nào
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-5">
          Không có giao dịch nào phù hợp với bộ lọc trong kỳ ({periodLabel}).
        </p>
        <button
          onClick={onOpenAddExpense}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>Ghi khoản chi mới ngay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Ledger Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Tổng chi trong kỳ ({periodLabel}):
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {formatVND(totalFilteredAmount)}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ({expenses.length} khoản chi)
            </span>
          </div>
        </div>

        <button
          onClick={() => exportExpensesToCSV(expenses, categories, `SpendWise_${periodLabel}.csv`)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Xuất Excel CSV</span>
        </button>
      </div>

      {/* Grouped Day Sections */}
      <div className="space-y-4">
        {groupedExpenses.map((group) => {
          return (
            <div key={group.date} className="space-y-1.5">
              {/* Date Header */}
              <div className="flex items-center justify-between px-1.5 py-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {formatFriendlyDate(group.date)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({group.items.length})
                  </span>
                </div>

                <div className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-rose-600 dark:text-rose-400 font-black">-{formatVND(group.total)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 sm:space-y-2">
                {group.items.map((item) => (
                  <ExpenseItem
                    key={item.id}
                    expense={item}
                    category={categoryMap.get(item.categoryId)}
                    onEdit={onEditExpense}
                    onDuplicate={onDuplicateExpense}
                    onDelete={onDeleteExpense}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
