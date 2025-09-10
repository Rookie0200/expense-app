import { useState } from "react";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { MonthlyChart } from "../components/MonthlyChart";
import { CategoryChart } from "../components/CategoryChart";
import { BudgetChart } from "../components/BudgetChart";
import { StatsCards } from "../components/StatsCards";
import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardOverview } from "../components/DashboardOverview";
import { useTransactions } from "../hooks/useTransaction";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const {
    transactions,
    budgets,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardOverview transactions={transactions} />
            <div className="px-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <MonthlyChart transactions={transactions} />
                <CategoryChart transactions={transactions} />
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
            <BudgetChart budgets={budgets} transactions={transactions} />
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
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
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
