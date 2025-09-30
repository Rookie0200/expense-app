// =============================================================================
// API DATA HOOKS FOR BACKEND INTEGRATION
// =============================================================================
// This file contains React hooks that integrate with the backend API
// Replace the useTransactions hook usage with these when backend is ready

import { useState, useEffect } from 'react';
import type { Transaction, Budget } from '../types/finance';
import { transactionsApi, budgetsApi } from '../services/api';
import { useToast } from './use-toast';

// =============================================================================
// TRANSACTIONS HOOK WITH REAL API INTEGRATION
// =============================================================================
export const useTransactionsAPI = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load transactions from API
  const loadTransactions = async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    category?: string;
    type?: 'income' | 'expense';
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsApi.getTransactions(params);
      // console.log("API - Fetched transactions:", response?.transactions);
      // Defensive: unwrap and map _id to id for UI compatibility
      const txs = Array.isArray(response?.transactions)
        ? response.transactions.map((tx: any) => ({
            ...tx,
            id: tx._id || tx.id // ensure id exists
          }))
        : [];
        // console.log("API - Processed transactions:", txs);
      setTransactions(txs);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load transactions';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTransactions();
  }, []);

  // Add new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionsApi.createTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
      
      return newTransaction;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add transaction';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const updatedTransaction = await transactionsApi.updateTransaction(id, updates);
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      
      toast({
        title: "Success",
        description: "Transaction updated successfully!",
      });
      
      return updatedTransaction;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update transaction';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      await transactionsApi.deleteTransaction(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully!",
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete transaction';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Get transaction statistics
  const getTransactionStats = async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      return await transactionsApi.getTransactionStats(params);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load statistics';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    loadTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionStats,
  };
};

// =============================================================================
// BUDGETS HOOK WITH REAL API INTEGRATION
// =============================================================================
export const useBudgetsAPI = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load budgets from API
  const loadBudgets = async (params?: {
    month?: string;
    year?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const budgetsData = await budgetsApi.getBudgets(params);
      setBudgets(budgetsData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load budgets';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadBudgets();
  }, []);

  // Add new budget
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const newBudget = await budgetsApi.createBudget(budget);
      setBudgets(prev => [...prev, newBudget]);
      
      toast({
        title: "Success",
        description: "Budget created successfully!",
      });
      
      return newBudget;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create budget';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Update budget
  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const updatedBudget = await budgetsApi.updateBudget(id, updates);
      setBudgets(prev =>
        prev.map(budget =>
          budget.id === id ? updatedBudget : budget
        )
      );
      
      toast({
        title: "Success",
        description: "Budget updated successfully!",
      });
      
      return updatedBudget;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update budget';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Delete budget
  const deleteBudget = async (id: string) => {
    try {
      await budgetsApi.deleteBudget(id);
      setBudgets(prev => prev.filter(budget => budget.id !== id));
      
      toast({
        title: "Success",
        description: "Budget deleted successfully!",
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete budget';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  // Get budget vs actual comparison
  const getBudgetVsActual = async (month?: string) => {
    try {
      return await budgetsApi.getBudgetVsActual(month);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load budget comparison';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    budgets,
    loading,
    error,
    loadBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetVsActual,
  };
};

// =============================================================================
// COMBINED HOOK FOR EASY MIGRATION
// =============================================================================
export const useFinancialDataAPI = () => {
  const transactionsHook = useTransactionsAPI();
  const budgetsHook = useBudgetsAPI();

  return {
    // Transactions
    transactions: transactionsHook.transactions,
    transactionsLoading: transactionsHook.loading,
    transactionsError: transactionsHook.error,
    loadTransactions: transactionsHook.loadTransactions,
    addTransaction: transactionsHook.addTransaction,
    updateTransaction: transactionsHook.updateTransaction,
    deleteTransaction: transactionsHook.deleteTransaction,
    getTransactionStats: transactionsHook.getTransactionStats,

    // Budgets
    budgets: budgetsHook.budgets,
    budgetsLoading: budgetsHook.loading,
    budgetsError: budgetsHook.error,
    loadBudgets: budgetsHook.loadBudgets,
    addBudget: budgetsHook.addBudget,
    updateBudget: budgetsHook.updateBudget,
    deleteBudget: budgetsHook.deleteBudget,
    getBudgetVsActual: budgetsHook.getBudgetVsActual,

    // Combined loading state
    loading: transactionsHook.loading || budgetsHook.loading,
  };
};

// =============================================================================
// MIGRATION INSTRUCTIONS
// =============================================================================
/*
TO MIGRATE FROM MOCK DATA TO REAL API:

1. Replace useTransactions import in components:
   OLD: import { useTransactions } from '@/hooks/useTransactions';
   NEW: import { useFinancialDataAPI as useTransactions } from '@/hooks/useApiData';

2. Update component usage:
   OLD: const { transactions, budgets, loading, addTransaction, ... } = useTransactions();
   NEW: const { transactions, budgets, loading, addTransaction, ... } = useTransactions();

3. Handle async operations:
   OLD: addTransaction(data); // Synchronous
   new: await addtransaction(data); // asynchronous - add try/catch blocks

4. Files to update:
   - src/pages/Index.tsx
   - src/components/TransactionForm.tsx
   - src/components/TransactionList.tsx
   - src/components/BudgetManager.tsx
   - src/components/StatsCards.tsx

5. Add environment variable:
   Create .env file in root:
   REACT_APP_API_URL=http://localhost:5000/api

6. Test error handling:
   - Network failures
   - Invalid credentials
   - Server errors
   - Validation errors
*/