import React, { useState } from 'react';
import type { Category, Expense } from '../../types/expense';
import { formatVND, parseVND } from '../../utils/currency';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  Target,
  AlertTriangle,
  CheckCircle,
  Settings,
  Edit3,
} from 'lucide-react';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

interface BudgetOverviewProps {
  expenses: Expense[];
  categories: Category[];
  monthlyBudget: number;
  onUpdateMonthlyBudget: (amount: number) => void;
  onUpdateCategoryBudget: (categoryId: string, limit: number) => void;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  expenses,
  categories,
  monthlyBudget,
  onUpdateMonthlyBudget,
  onUpdateCategoryBudget,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryLimitInput, setCategoryLimitInput] = useState<string>('');
  const [editingMonthly, setEditingMonthly] = useState<boolean>(false);
  const [monthlyInput, setMonthlyInput] = useState<string>('');

  // Calculate actual spend for THIS current month
  const now = new Date();
  const mStart = startOfMonth(now);
  const mEnd = endOfMonth(now);

  const thisMonthExpenses = expenses.filter((e) => {
    try {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start: mStart, end: mEnd });
    } catch {
      return false;
    }
  });

  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const overallUtilization = monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : 0;
  const isOverBudget = totalSpent > monthlyBudget;
  const remainingTotal = Math.max(0, monthlyBudget - totalSpent);

  // Group actual spend by category
  const catSpendMap = new Map<string, number>();
  thisMonthExpenses.forEach((e) => {
    const cur = catSpendMap.get(e.categoryId) || 0;
    catSpendMap.set(e.categoryId, cur + e.amount);
  });

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryLimitInput(cat.budgetLimit ? cat.budgetLimit.toString() : '');
  };

  const handleSaveCategoryBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      const val = parseVND(categoryLimitInput);
      onUpdateCategoryBudget(editingCategory.id, val);
      setEditingCategory(null);
    }
  };

  const handleOpenEditMonthly = () => {
    setEditingMonthly(true);
    setMonthlyInput(monthlyBudget.toString());
  };

  const handleSaveMonthlyBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseVND(monthlyInput);
    if (val > 0) {
      onUpdateMonthlyBudget(val);
      setEditingMonthly(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Total Monthly Budget Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Target size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Ngân Sách Tháng {now.getMonth() + 1}/{now.getFullYear()}
                </h3>
                <button
                  onClick={handleOpenEditMonthly}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Chỉnh sửa hạn mức"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Mục tiêu hạn mức chi tiêu trong tháng
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold block">
              Hạn mức
            </span>
            <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              {formatVND(monthlyBudget)}
            </div>
          </div>
        </div>

        {/* Progress Bar & Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">
              Đã chi: <span className="text-slate-900 dark:text-white">{formatVND(totalSpent)}</span>
            </span>
            <span
              className={
                isOverBudget
                  ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                  : overallUtilization > 80
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }
            >
              {overallUtilization}% {isOverBudget && '(Vượt!)'}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : overallUtilization > 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, overallUtilization)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 pt-0.5">
            <span>
              {isOverBudget ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle size={13} />
                  Vượt mức {formatVND(totalSpent - monthlyBudget)}
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle size={13} />
                  Còn lại: {formatVND(remainingTotal)}
                </span>
              )}
            </span>
            <span>Hết hạn: {endOfMonth(now).getDate()}/{now.getMonth() + 1}</span>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Hạn Mức Từng Danh Mục
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Kiểm soát chi tiêu riêng lẻ cho ăn uống, mua sắm...
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const spent = catSpendMap.get(cat.id) || 0;
            const limit = cat.budgetLimit || 0;
            const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const isCategoryOver = limit > 0 && spent > limit;

            return (
              <div
                key={cat.id}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-slate-50/50 dark:bg-slate-800/20"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cat.bgLight }}
                    >
                      <CategoryIcon name={cat.icon} size={15} color={cat.color} />
                    </div>
                    <div className="truncate">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {cat.name}
                      </h5>
                      <span className="text-[10px] sm:text-[11px] text-slate-400">
                        Hạn mức: {limit > 0 ? formatVND(limit) : 'Chưa đặt'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEditCategory(cat)}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-700 transition-colors shrink-0"
                    title="Cài đặt hạn mức"
                  >
                    <Settings size={16} />
                  </button>
                </div>

                {limit > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs">
                      <span className="text-slate-500 font-medium">
                        Đã chi: <strong className="text-slate-800 dark:text-slate-200">{formatVND(spent)}</strong>
                      </span>
                      <span
                        className={`font-bold ${
                          isCategoryOver
                            ? 'text-rose-600'
                            : percentage > 80
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCategoryOver
                            ? 'bg-rose-500'
                            : percentage > 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>
                        {isCategoryOver
                          ? `Vượt ${formatVND(spent - limit)}`
                          : `Còn lại ${formatVND(limit - spent)}`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
                    <span>Đã chi: {formatVND(spent)}</span>
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                    >
                      + Đặt hạn mức
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Category Budget Modal (Bottom Sheet on Mobile) */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm pb-safe">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up sm:animate-none">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1">
              Hạn mức: {editingCategory.name}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mb-3.5">
              Nhập số tiền tối đa chi cho nhóm này trong tháng (nhập 0 để hủy).
            </p>
            <form onSubmit={handleSaveCategoryBudget} className="space-y-3.5">
              <input
                type="text"
                autoFocus
                placeholder="VD: 3000000"
                value={categoryLimitInput ? Number(categoryLimitInput).toLocaleString('vi-VN') : ''}
                onChange={(e) => setCategoryLimitInput(e.target.value.replace(/[^\d]/g, ''))}
                className="w-full text-lg font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  Lưu hạn mức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Total Monthly Budget Modal */}
      {editingMonthly && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm pb-safe">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slide-up sm:animate-none">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1">
              Ngân Sách Tổng Tháng
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-500 mb-3.5">
              Giới hạn tổng toàn bộ tiền chi trong tháng.
            </p>
            <form onSubmit={handleSaveMonthlyBudget} className="space-y-3.5">
              <input
                type="text"
                autoFocus
                placeholder="VD: 15000000"
                value={monthlyInput ? Number(monthlyInput).toLocaleString('vi-VN') : ''}
                onChange={(e) => setMonthlyInput(e.target.value.replace(/[^\d]/g, ''))}
                className="w-full text-lg font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingMonthly(false)}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
