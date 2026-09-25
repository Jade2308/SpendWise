import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, Category, FilterState } from '../types/expense';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { getMockExpenses } from '../constants/mockData';

interface ExpenseState {
  expenses: Expense[];
  categories: Category[];
  monthlyBudget: number;
  theme: 'light' | 'dark';
  filter: FilterState;

  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  duplicateExpense: (id: string) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  setMonthlyBudget: (amount: number) => void;
  setCategoryBudget: (categoryId: string, limit: number) => void;

  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;

  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  loadMockData: () => void;
  importExpenses: (imported: Expense[]) => void;
  clearAllData: () => void;
}

const defaultFilter: FilterState = {
  searchQuery: '',
  dateFilter: { range: 'this_month' },
  categoryId: 'all',
  paymentMethod: 'all',
  sortBy: 'date_desc',
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: getMockExpenses(), // Initialize with rich demo data so app is never blank
      categories: DEFAULT_CATEGORIES,
      monthlyBudget: 15000000, // 15 million VND default monthly budget
      theme: 'light',
      filter: defaultFilter,

      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
      },

      updateExpense: (id, updated) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updated } : e)),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },

      duplicateExpense: (id) => {
        const item = get().expenses.find((e) => e.id === id);
        if (!item) return;
        const cloned: Expense = {
          ...item,
          id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          createdAt: new Date().toISOString(),
          note: item.note ? `${item.note} (Bản sao)` : '(Bản sao)',
        };
        set((state) => ({
          expenses: [cloned, ...state.expenses],
        }));
      },

      addCategory: (categoryData) => {
        const newCat: Category = {
          ...categoryData,
          id: `cat-${Date.now()}`,
          bgLight: '#f1f5f9',
        };
        set((state) => ({
          categories: [...state.categories, newCat],
        }));
      },

      updateCategory: (id, updated) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      setMonthlyBudget: (amount) => {
        set({ monthlyBudget: amount });
      },

      setCategoryBudget: (categoryId, limit) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId ? { ...c, budgetLimit: limit } : c
          ),
        }));
      },

      setFilter: (updatedFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...updatedFilter },
        }));
      },

      resetFilter: () => {
        set({ filter: defaultFilter });
      },

      setTheme: (theme) => {
        set({ theme });
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          metaThemeColor?.setAttribute('content', '#020617');
        } else {
          document.documentElement.classList.remove('dark');
          metaThemeColor?.setAttribute('content', '#059669');
        }
      },

      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(nextTheme);
      },

      loadMockData: () => {
        set({
          expenses: getMockExpenses(),
          categories: DEFAULT_CATEGORIES,
          monthlyBudget: 15000000,
        });
      },

      importExpenses: (imported) => {
        set((state) => ({
          expenses: [...imported, ...state.expenses],
        }));
      },

      clearAllData: () => {
        set({
          expenses: [],
        });
      },
    }),
    {
      name: 'spendwise-storage',
      partialize: (state) => ({
        expenses: state.expenses,
        categories: state.categories,
        monthlyBudget: state.monthlyBudget,
        theme: state.theme,
      }),
    }
  )
);
