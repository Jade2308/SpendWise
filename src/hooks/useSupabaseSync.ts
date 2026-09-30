import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useExpenseStore } from '../store/useExpenseStore';
import { syncApi, mapDbToExpense, mapDbToCategory } from '../services/syncService';
import { sortCategoriesWithFoodFirst } from '../constants/categories';
import type { Expense } from '../types/expense';

export type SyncState = 'synced' | 'syncing' | 'offline' | 'error';

export function useSupabaseSync() {
  const [syncState, setSyncState] = useState<SyncState>('syncing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);

  const isInitialSyncDone = useRef(false);

  // Sync toàn bộ dữ liệu lần đầu khi mở app
  const syncInitialData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setSyncState('offline');
      return;
    }

    if (!navigator.onLine) {
      setSyncState('offline');
      return;
    }

    try {
      setSyncState('syncing');
      const { expenses: remoteExpenses, categories: remoteCategories } =
        await syncApi.fetchAll();

      // Kéo dữ liệu thuần túy từ Cloud Database
      const cleanRemoteExpenses = remoteExpenses
        .filter((e) => !e.id.startsWith('mock-exp-'))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const sortedRemoteCategories = sortCategoriesWithFoodFirst(remoteCategories);

      useExpenseStore.setState((state) => ({
        expenses: cleanRemoteExpenses,
        categories: sortedRemoteCategories.length > 0 ? sortedRemoteCategories : state.categories,
      }));

      setSyncState('synced');
      setLastSyncedTime(new Date());
      setErrorMessage(null);
      isInitialSyncDone.current = true;
    } catch (err: any) {
      console.error('Lỗi khi đồng bộ ban đầu với Supabase:', err);
      setSyncState('error');
      setErrorMessage(err.message || 'Không thể đồng bộ với máy chủ');
    }
  }, []);

  // Lắng nghe realtime từ Supabase qua WebSocket
  useEffect(() => {
    // 1. Kéo dữ liệu ban đầu
    syncInitialData();

    // 2. Lắng nghe trạng thái online/offline của trình duyệt
    const handleOnline = () => {
      syncInitialData();
    };
    const handleOffline = () => {
      setSyncState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!isSupabaseConfigured) {
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // 3. Đăng ký kênh Supabase Realtime cho bảng expenses
    const channel = supabase
      .channel('spendwise_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'expenses' },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;

          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            const incomingExpense = mapDbToExpense(newRow);
            useExpenseStore.setState((state) => {
              const exists = state.expenses.some((e) => e.id === incomingExpense.id);
              let updatedExpenses: Expense[];
              if (exists) {
                updatedExpenses = state.expenses.map((e) =>
                  e.id === incomingExpense.id ? incomingExpense : e
                );
              } else {
                updatedExpenses = [incomingExpense, ...state.expenses];
              }
              return { expenses: updatedExpenses };
            });
            setLastSyncedTime(new Date());
          } else if (eventType === 'DELETE') {
            const deletedId = oldRow.id;
            useExpenseStore.setState((state) => ({
              expenses: state.expenses.filter((e) => e.id !== deletedId),
            }));
            setLastSyncedTime(new Date());
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            const incomingCat = mapDbToCategory(newRow);
            useExpenseStore.setState((state) => {
              const exists = state.categories.some((c) => c.id === incomingCat.id);
              const updatedCats = exists
                ? state.categories.map((c) => (c.id === incomingCat.id ? incomingCat : c))
                : [...state.categories, incomingCat];
              return { categories: sortCategoriesWithFoodFirst(updatedCats) };
            });
          } else if (eventType === 'DELETE') {
            useExpenseStore.setState((state) => ({
              categories: state.categories.filter((c) => c.id !== oldRow.id),
            }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings' },
        (payload) => {
          const newRow = payload.new as Record<string, any> | null;
          if (newRow && newRow.key === 'monthly_budget' && newRow.value?.amount) {
            useExpenseStore.setState({ monthlyBudget: Number(newRow.value.amount) });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setSyncState('synced');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setSyncState('offline');
        }
      });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(channel);
    };
  }, [syncInitialData]);

  return {
    syncState,
    errorMessage,
    lastSyncedTime,
    manualSync: syncInitialData,
  };
}
