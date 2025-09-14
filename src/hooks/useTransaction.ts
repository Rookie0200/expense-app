import { useState, useEffect } from "react";
import type { Transaction, Budget } from "../types/finance";
const BACKEND_URL = import.meta.env.VITE_API_URL;
import axios from "axios";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch transactions
        const txRes = await axios.get(`${BACKEND_URL}/api/transactions`, {
          headers: { "Content-Type": "application/json" },
        });
        setTransactions(txRes.data);

        // Fetch budgets
        const budgetRes = await axios.get(`${BACKEND_URL}/api/budgets`, {
          headers: { "Content-Type": "application/json" },
        });
        setBudgets(budgetRes.data);
      } catch (err) {
        setTransactions([]);
        setBudgets([]);
      }
      setLoading(false);
    };
    loadData();
  }, []);
console.log(transactions);
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/transactions`,
        transaction,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setTransactions((prev) => [res.data, ...prev]);
    } catch (err) {}
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/transactions/${id}`,
        updates,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? res.data : transaction
        )
      );
    } catch (err) {}
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/transactions/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id)
      );
    } catch (err) {}
  };

  const addBudget = async (budget: Omit<Budget, "id">) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/budgets`, budget, {
        headers: { "Content-Type": "application/json" },
      });
      setBudgets((prev) => [...prev, res.data]);
    } catch (err) {}
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/api/budgets/${id}`, updates, {
        headers: { "Content-Type": "application/json" },
      });
      setBudgets((prev) =>
        prev.map((budget) => (budget.id === id ? res.data : budget))
      );
    } catch (err) {}
  };

  const deleteBudget = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/budgets/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setBudgets((prev) => prev.filter((budget) => budget.id !== id));
    } catch (err) {}
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
