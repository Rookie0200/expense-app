
import { useState } from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { CategoryChart } from '@/components/CategoryChart';
import { BudgetChart } from '@/components/BudgetChart';
import { BudgetManager } from '@/components/BudgetManager';
import { StatsCards } from '@/components/StatsCards';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardOverview } from '@/components/DashboardOverview';
import { useTransactions } from '@/hooks/useTransactions';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const { 
    transactions, 
    budgets,
    loading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget
  } = useTransactions();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardOverview transactions={transactions} budgets={budgets} />
            
            <div className="px-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <MonthlyChart transactions={transactions} />
                <CategoryChart transactions={transactions} />
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <BudgetChart budgets={budgets} transactions={transactions} />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                  <TransactionForm onSubmit={addTransaction} />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
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
      
      case 'transactions':
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
      
      case 'budgets':
        return (
          <div className="p-6 space-y-6">
            <BudgetManager
              budgets={budgets}
              transactions={transactions}
              onAddBudget={addBudget}
              onUpdateBudget={updateBudget}
              onDeleteBudget={deleteBudget}
            />
            <BudgetChart budgets={budgets} transactions={transactions} />
          </div>
        );
      
      default:
        return <div className="p-6">Section not found</div>;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard';
      case 'analytics': return 'Analytics';
      case 'transactions': return 'Transactions';
      case 'budgets': return 'Budget Manager';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title={getSectionTitle()}
          subtitle={activeSection === 'dashboard' ? 'Track every change in your balance.' : undefined}
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
