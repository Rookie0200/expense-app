import { useState, useEffect } from 'react';
import { Transaction, Budget } from '@/types/finance';
import { generateId } from '@/lib/finance-utils';

// Enhanced mock data for demonstration
const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: -120.50,
    description: 'Grocery shopping at Whole Foods',
    date: '2024-07-01',
    type: 'expense',
    category: 'Food'
  },
  {
    id: '2',
    amount: 3500,
    description: 'Monthly Salary',
    date: '2024-07-01',
    type: 'income'
  },
  {
    id: '3',
    amount: -85,
    description: 'Electricity Bill',
    date: '2024-06-28',
    type: 'expense',
    category: 'Bills'
  },
  {
    id: '4',
    amount: -45.30,
    description: 'Coffee and lunch',
    date: '2024-07-02',
    type: 'expense',
    category: 'Food'
  },
  {
    id: '5',
    amount: -200,
    description: 'Monthly gym membership',
    date: '2024-06-15',
    type: 'expense',
    category: 'Healthcare'
  },
  {
    id: '6',
    amount: -75,
    description: 'Gas for car',
    date: '2024-07-03',
    type: 'expense',
    category: 'Transport'
  },
  {
    id: '7',
    amount: -150,
    description: 'New shoes',
    date: '2024-07-05',
    type: 'expense',
    category: 'Shopping'
  },
  {
    id: '8',
    amount: -25,
    description: 'Movie tickets',
    date: '2024-07-06',
    type: 'expense',
    category: 'Entertainment'
  },
  {
    id: '9',
    amount: -300,
    description: 'Online course',
    date: '2024-06-20',
    type: 'expense',
    category: 'Education'
  },
  {
    id: '10',
    amount: -90,
    description: 'Restaurant dinner',
    date: '2024-07-07',
    type: 'expense',
    category: 'Food'
  }
];

const mockBudgets: Budget[] = [
  { id: '1', category: 'Food', amount: 400, month: 'Jul 2024' },
  { id: '2', category: 'Bills', amount: 300, month: 'Jul 2024' },
  { id: '3', category: 'Transport', amount: 200, month: 'Jul 2024' },
  { id: '4', category: 'Shopping', amount: 250, month: 'Jul 2024' },
  { id: '5', category: 'Entertainment', amount: 100, month: 'Jul 2024' },
  { id: '6', category: 'Healthcare', amount: 150, month: 'Jul 2024' },
  { id: '7', category: 'Education', amount: 200, month: 'Jul 2024' },
  { id: '8', category: 'Other', amount: 100, month: 'Jul 2024' },
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
      setBudgets(mockBudgets);
      setLoading(false);
    };

    loadData();
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      ...budget,
      id: generateId(),
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev =>
      prev.map(budget =>
        budget.id === id ? { ...budget, ...updates } : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
  };

  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return {
    transactions: sortedTransactions,
    budgets,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
  };
};
