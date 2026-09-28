import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Expense, Category } from '../types/expense';

// Chuyển đổi dữ liệu từ Supabase sang Frontend Model (camelCase)
export const mapDbToExpense = (row: any): Expense => ({
  id: row.id,
  amount: Number(row.amount),
  categoryId: row.category_id,
  date: row.date,
  paymentMethod: row.payment_method,
  note: row.note || '',
  isRecurring: Boolean(row.is_recurring),
  recurringPeriod: row.recurring_period || undefined,
  receiptImage: row.receipt_image || undefined,
  createdAt: row.created_at,
});

// Chuyển đổi dữ liệu từ Frontend Model sang Supabase Row (snake_case)
export const mapExpenseToDb = (expense: Expense) => ({
  id: expense.id,
  amount: expense.amount,
  category_id: expense.categoryId,
  date: expense.date,
  payment_method: expense.paymentMethod,
  note: expense.note,
  is_recurring: expense.isRecurring ?? false,
  recurring_period: expense.recurringPeriod ?? null,
  receipt_image: expense.receiptImage ?? null,
  created_at: expense.createdAt,
  updated_at: new Date().toISOString(),
});

export const mapDbToCategory = (row: any): Category => ({
  id: row.id,
  name: row.name,
  icon: row.icon,
  color: row.color,
  bgLight: row.bg_light,
  budgetLimit: row.budget_limit ? Number(row.budget_limit) : undefined,
});

export const mapCategoryToDb = (cat: Category) => ({
  id: cat.id,
  name: cat.name,
  icon: cat.icon,
  color: cat.color,
  bg_light: cat.bgLight,
  budget_limit: cat.budgetLimit ?? 0,
  updated_at: new Date().toISOString(),
});

// ====================== API Calls ======================

export const syncApi = {
  // Lấy toàn bộ dữ liệu ban đầu từ Supabase
  async fetchAll() {
    if (!isSupabaseConfigured) {
      return { expenses: [], categories: [], monthlyBudget: 15000000 };
    }
    const [expensesRes, categoriesRes, settingsRes] = await Promise.all([
      supabase.from('expenses').select('*').order('date', { ascending: false }),
      supabase.from('categories').select('*'),
      supabase.from('app_settings').select('*').eq('key', 'monthly_budget').single(),
    ]);

    const expenses: Expense[] = (expensesRes.data || []).map(mapDbToExpense);
    const categories: Category[] = (categoriesRes.data || []).map(mapDbToCategory);
    const monthlyBudget: number = settingsRes.data?.value?.amount ?? 15000000;

    return { expenses, categories, monthlyBudget };
  },

  // Đồng bộ 1 expense lên Supabase
  async upsertExpense(expense: Expense) {
    const dbRow = mapExpenseToDb(expense);
    const { error } = await supabase.from('expenses').upsert(dbRow);
    if (error) throw error;
  },

  // Đồng bộ danh sách expenses (khi import hoặc init)
  async upsertExpensesBatch(expenses: Expense[]) {
    if (expenses.length === 0) return;
    const rows = expenses.map(mapExpenseToDb);
    const { error } = await supabase.from('expenses').upsert(rows);
    if (error) throw error;
  },

  // Xóa expense
  async deleteExpense(id: string) {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
  },

  // Đồng bộ category
  async upsertCategory(category: Category) {
    const dbRow = mapCategoryToDb(category);
    const { error } = await supabase.from('categories').upsert(dbRow);
    if (error) throw error;
  },

  // Xóa category
  async deleteCategory(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },

  // Cập nhật ngân sách tháng
  async saveMonthlyBudget(amount: number) {
    const { error } = await supabase.from('app_settings').upsert({
      key: 'monthly_budget',
      value: { amount },
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  },
};
