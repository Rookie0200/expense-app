import { useState, useEffect } from "react";
import { transactionsApi, budgetsApi } from "../services/api";
import { useToast } from "./use-toast";
import type { Transaction, Budget } from "../types/finance";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load transactions and budgets in parallel
        const [transactionsResponse, budgetsResponse] = await Promise.all([
          transactionsApi.getTransactions(),
          budgetsApi.getBudgets(),
        ]);
        setTransactions(transactionsResponse.transactions);
        setBudgets(budgetsResponse);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.message ||
            "Failed to load your financial data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    console.log(
      "controle inside addTransaction with transaction : ",
      transaction
    );
    try {
      const newTransaction = await transactionsApi.createTransaction(
        transaction
      );
      setTransactions((prev) => [newTransaction, ...prev]);
      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
      return newTransaction;
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    try {
      const updatedTransaction = await transactionsApi.updateTransaction(
        id,
        updates
      );
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      toast({
        title: "Success",
        description: "Transaction updated successfully!",
      });
      return updatedTransaction;
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update transaction. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionsApi.deleteTransaction(id);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
      toast({
        title: "Success",
        description: "Transaction deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addBudget = async (budget: Omit<Budget, "id">) => {
    try {
      const newBudget = await budgetsApi.createBudget(budget);
      setBudgets((prev) => [...prev, newBudget]);
      toast({
        title: "Success",
        description: "Budget created successfully!",
      });
      return newBudget;
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create budget. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const updatedBudget = await budgetsApi.updateBudget(id, updates);
      setBudgets((prev) =>
        prev.map((budget) => (budget.id === id ? updatedBudget : budget))
      );
      toast({
        title: "Success",
        description: "Budget updated successfully!",
      });
      return updatedBudget;
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update budget. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await budgetsApi.deleteBudget(id);
      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
      toast({
        title: "Success",
        description: "Budget deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete budget. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
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
