import { create } from 'zustand';
import type { Expense, Category, FilterState } from '../types/expense';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { getMockExpenses } from '../constants/mockData';
import { syncApi } from '../services/syncService';

// Xóa sạch dữ liệu cũ trên máy (chỉ lưu trên Cloud Database)
try {
  localStorage.removeItem('spendwise-storage');
} catch (e) {}

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
  dateFilter: { range: 'this_week' }, // Mặc định là tuần này
  categoryId: 'all',
  paymentMethod: 'all',
  sortBy: 'date_desc',
};

export const useExpenseStore = create<ExpenseState>()(
  (set, get) => ({
    expenses: [], // Chỉ lưu trên database, không lưu trên máy
    categories: DEFAULT_CATEGORIES,
    monthlyBudget: 15000000,
    theme: (typeof window !== 'undefined' && (localStorage.getItem('spendwise-theme') as 'light' | 'dark')) || 'light',
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
        // Đồng bộ ngầm lên Supabase (0ms UI lag)
        syncApi.upsertExpense(newExpense).catch((err) => {
          console.warn('Sync expense failed (will retry):', err);
        });
      },

      updateExpense: (id, updated) => {
        let updatedItem: Expense | undefined;
        set((state) => {
          const next = state.expenses.map((e) => {
            if (e.id === id) {
              updatedItem = { ...e, ...updated };
              return updatedItem;
            }
            return e;
          });
          return { expenses: next };
        });
        if (updatedItem) {
          syncApi.upsertExpense(updatedItem).catch((err) => {
            console.warn('Sync update expense failed:', err);
          });
        }
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
        syncApi.deleteExpense(id).catch((err) => {
          console.warn('Sync delete expense failed:', err);
        });
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
        syncApi.upsertExpense(cloned).catch((err) => {
          console.warn('Sync duplicate expense failed:', err);
        });
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
        syncApi.upsertCategory(newCat).catch((err) => {
          console.warn('Sync add category failed:', err);
        });
      },

      updateCategory: (id, updated) => {
        let updatedCat: Category | undefined;
        set((state) => {
          const next = state.categories.map((c) => {
            if (c.id === id) {
              updatedCat = { ...c, ...updated };
              return updatedCat;
            }
            return c;
          });
          return { categories: next };
        });
        if (updatedCat) {
          syncApi.upsertCategory(updatedCat).catch((err) => {
            console.warn('Sync update category failed:', err);
          });
        }
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
        syncApi.deleteCategory(id).catch((err) => {
          console.warn('Sync delete category failed:', err);
        });
      },

      setMonthlyBudget: (amount) => {
        set({ monthlyBudget: amount });
        syncApi.saveMonthlyBudget(amount).catch((err) => {
          console.warn('Sync monthly budget failed:', err);
        });
      },

      setCategoryBudget: (categoryId, limit) => {
        let updatedCat: Category | undefined;
        set((state) => {
          const next = state.categories.map((c) => {
            if (c.id === categoryId) {
              updatedCat = { ...c, budgetLimit: limit };
              return updatedCat;
            }
            return c;
          });
          return { categories: next };
        });
        if (updatedCat) {
          syncApi.upsertCategory(updatedCat).catch((err) => {
            console.warn('Sync category budget failed:', err);
          });
        }
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
        try {
          localStorage.setItem('spendwise-theme', theme);
        } catch (e) {}
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
        const mock = getMockExpenses();
        set({
          expenses: mock,
          categories: DEFAULT_CATEGORIES,
          monthlyBudget: 15000000,
        });
        syncApi.upsertExpensesBatch(mock).catch(console.warn);
      },

      importExpenses: (imported) => {
        set((state) => ({
          expenses: [...imported, ...state.expenses],
        }));
        syncApi.upsertExpensesBatch(imported).catch(console.warn);
      },

      clearAllData: () => {
        set({
          expenses: [],
        });
        syncApi.clearAllExpenses().catch(console.warn);
      },
    })
);

