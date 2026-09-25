import { useState, useEffect } from 'react';
import { useExpenseStore } from './store/useExpenseStore';
import { useExpenseAnalytics } from './hooks/useExpenseAnalytics';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { BottomNavigation } from './components/layout/BottomNavigation';
import type { NavTab } from './components/layout/Navigation';
import { StatSummaryCards } from './components/analytics/StatSummaryCards';
import { CategoryDonutChart } from './components/analytics/CategoryDonutChart';
import { DailyTrendChart } from './components/analytics/DailyTrendChart';
import { MonthlyComparisonBar } from './components/analytics/MonthlyComparisonBar';
import { WeekdayHeatmapChart } from './components/analytics/WeekdayHeatmapChart';
import { PaymentMethodChart } from './components/analytics/PaymentMethodChart';
import { SpendingCalendar } from './components/analytics/SpendingCalendar';
import { ExpenseFilters } from './components/expenses/ExpenseFilters';
import { ExpenseList } from './components/expenses/ExpenseList';
import { ExpenseFormModal } from './components/expenses/ExpenseFormModal';
import { BudgetOverview } from './components/budget/BudgetOverview';
import { DataBackupModal } from './components/settings/DataBackupModal';
import { printFinancialReport } from './utils/exportExcel';
import type { Expense } from './types/expense';

export function App() {
  const {
    expenses,
    categories,
    monthlyBudget,
    filter,
    theme,
    addExpense,
    updateExpense,
    deleteExpense,
    duplicateExpense,
    setMonthlyBudget,
    setCategoryBudget,
    setFilter,
    resetFilter,
  } = useExpenseStore();

  const [activeTab, setActiveTab] = useState<NavTab>('analytics');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Comprehensive analytics calculation
  const {
    filteredExpenses,
    summary,
    categoryStats,
    dailyStats,
    monthlyStats,
    weekdayStats,
    paymentStats,
    periodLabel,
  } = useExpenseAnalytics({
    expenses,
    categories,
    monthlyBudget,
    filter,
  });

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
  };

  const handlePrintReport = () => {
    printFinancialReport(filteredExpenses, categories, summary, periodLabel);
  };

  const handleSelectCategoryFromChart = (categoryId: string) => {
    setFilter({ categoryId });
    setActiveTab('ledger');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenAddExpense={handleOpenAddExpense}
        onPrintReport={handlePrintReport}
        periodLabel={periodLabel}
      />

      {/* Desktop Navigation Tabs (Hidden on mobile) */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        expenseCount={filteredExpenses.length}
      />

      {/* Main Body Content with bottom padding for mobile bottom bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-24 md:pb-8">
        {/* Tab 1: Analytics & Reports */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            {/* KPI Summary Cards */}
            <StatSummaryCards
              summary={summary}
              categories={categories}
              monthlyBudget={monthlyBudget}
            />

            {/* Primary Charts: Category Donut & Daily Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              <div className="lg:col-span-5">
                <CategoryDonutChart
                  categoryStats={categoryStats}
                  totalSpend={summary.totalSpend}
                  onSelectCategory={handleSelectCategoryFromChart}
                />
              </div>
              <div className="lg:col-span-7">
                <DailyTrendChart
                  dailyStats={dailyStats}
                  dailyAverage={summary.dailyAverage}
                />
              </div>
            </div>

            {/* Deep Analytics: Habit Analysis & Payment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <WeekdayHeatmapChart weekdayStats={weekdayStats} />
              <PaymentMethodChart
                paymentStats={paymentStats}
                totalSpend={summary.totalSpend}
              />
              <MonthlyComparisonBar monthlyStats={monthlyStats} />
            </div>
          </div>
        )}

        {/* Tab 2: Expense Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-3.5 sm:space-y-4 animate-fadeIn">
            <ExpenseFilters
              filter={filter}
              categories={categories}
              onFilterChange={setFilter}
              onReset={resetFilter}
              totalFilteredCount={filteredExpenses.length}
            />

            <ExpenseList
              expenses={filteredExpenses}
              categories={categories}
              onOpenAddExpense={handleOpenAddExpense}
              onEditExpense={handleOpenEditExpense}
              onDuplicateExpense={duplicateExpense}
              onDeleteExpense={deleteExpense}
              periodLabel={periodLabel}
            />
          </div>
        )}

        {/* Tab 3: Calendar Heatmap */}
        {activeTab === 'calendar' && (
          <div className="animate-fadeIn">
            <SpendingCalendar expenses={expenses} categories={categories} />
          </div>
        )}

        {/* Tab 4: Budget Planner */}
        {activeTab === 'budget' && (
          <div className="animate-fadeIn">
            <BudgetOverview
              expenses={expenses}
              categories={categories}
              monthlyBudget={monthlyBudget}
              onUpdateMonthlyBudget={setMonthlyBudget}
              onUpdateCategoryBudget={setCategoryBudget}
            />
          </div>
        )}

        {/* Tab 5: Settings & Backup */}
        {activeTab === 'settings' && (
          <div className="animate-fadeIn">
            <DataBackupModal />
          </div>
        )}
      </main>

      {/* Mobile-Native Bottom Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddExpense={handleOpenAddExpense}
        expenseCount={filteredExpenses.length}
      />

      {/* Expense Modal (Add / Edit) with mobile bottom-sheet */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        initialData={editingExpense}
        categories={categories}
      />

      {/* Desktop Footer (Hidden on mobile) */}
      <footer className="hidden md:block border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SpendWise © 2026 — Sổ Quản Lý & Thống Kê Chi Tiêu Thông Minh</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            ● Dữ liệu lưu an toàn trên máy (Offline-first)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
