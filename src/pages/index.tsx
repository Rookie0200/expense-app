import { useState, useEffect } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { MonthlyChart } from "@/components/MonthlyChart";
import { CategoryChart } from "@/components/CategoryChart";
import { BudgetChart } from "@/components/BudgetChart";
import { BudgetManager } from "@/components/BudgetManager";
import { StatsCards } from "@/components/StatsCards";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardOverview } from "@/components/DashboardOverview";
import { useFinancialDataAPI as useTransactions } from "@/hooks/useApiData";
import { getCurrentMonth } from "@/lib/finance-utils";


const Index = () => {

  const [activeSection, setActiveSection] = useState("dashboard");

  const {
    transactions,
    budgets,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    loadBudgets,
    loadTransactions,
    getBudgetVsActual,
  } = useTransactions();

  const [budgetVsActual, setBudgetVsActual] = useState<any[]>([]);
  const [budgetVsActualLoading, setBudgetVsActualLoading] = useState(false);
  const [budgetVsActualError, setBudgetVsActualError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());


  // Fetch budget vs actual data when switching to Budget Manager or Dashboard
  useEffect(() => {
    const fetchBudgetVsActual = async () => {
      setBudgetVsActualLoading(true);
      setBudgetVsActualError(null);
      try {
        // You can pass a month string if needed, e.g. "2025-09"
        const data = await getBudgetVsActual(selectedMonth);
        console.log("the data of type :", typeof(data))
        setBudgetVsActual(data);
      } catch (err: any) {
        setBudgetVsActualError(err.message || "Failed to fetch budget vs actual");
      } finally {
        setBudgetVsActualLoading(false);
      }
    };
    if (activeSection === "budgets" || activeSection === "dashboard") {
      fetchBudgetVsActual();
    }
  }, [activeSection]);

  // console.log("the value of budgetvsactual in parent container :",budgetVsActual ," and of type :", typeof(budgetVsActual))

  // Refetch budgets and transactions when switching to Budget Manager
  useEffect(() => {
    if (activeSection === "budgets") {
      loadBudgets();
      loadTransactions();
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardOverview />

            <div className="px-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <MonthlyChart transactions={transactions} />
                <CategoryChart transactions={transactions} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <BudgetChart budgets={budgets} transactions={transactions} budgetVsActual={budgetVsActual} loading={budgetVsActualLoading} error={budgetVsActualError} />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                  <TransactionForm onSubmit={addTransaction} />
                </div>
              </div>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="p-6 space-y-6">
            <StatsCards transactions={transactions} budgets={budgets} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MonthlyChart transactions={transactions} />
              <CategoryChart transactions={transactions} />
            </div>
            <BudgetChart budgets={budgets} transactions={transactions} budgetVsActual={budgetVsActual} loading={budgetVsActualLoading} error={budgetVsActualError} />
          </div>
        );

      case "transactions":
        return (
          <div className="p-6 space-y-6">
            <div className="max-w-md">
              <TransactionForm onSubmit={addTransaction} />
            </div>
            <TransactionList
              transactions={transactions}
              loading={loading}
              onUpdate={updateTransaction}
              onDelete={deleteTransaction}
            />
          </div>
        );

      case "budgets":
        return (
          <div className="p-6 space-y-6">
            <BudgetManager
              budgets={budgets}
              transactions={transactions}
              onAddBudget={addBudget}
              onUpdateBudget={updateBudget}
              onDeleteBudget={deleteBudget}
              onMonthChange={setSelectedMonth}
              budgetVsActualData={budgetVsActual}
            />
            <BudgetChart budgets={budgets} transactions={transactions} budgetVsActual={budgetVsActual} loading={budgetVsActualLoading} error={budgetVsActualError}/>
          </div>
        );

      default:
        return <div className="p-6">Section not found</div>;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "Dashboard";
      case "analytics":
        return "Analytics";
      case "transactions":
        return "Transactions";
      case "budgets":
        return "Budget Manager";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={getSectionTitle()}
          subtitle={
            activeSection === "dashboard"
              ? "Track every change in your balance."
              : undefined
          }
          transactions={transactions}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
