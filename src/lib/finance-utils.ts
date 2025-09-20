import type {
  Transaction,
  MonthlyData,
  CategoryData,
  Budget,
  BudgetVsActual,
} from "../types/finance";
import { CATEGORY_COLORS } from "../types/finance";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  const monthlyMap = new Map<string, { expenses: number; income: number }>();

  transactions.forEach((transaction) => {
    const month = new Date(transaction.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, { expenses: 0, income: 0 });
    }

    const data = monthlyMap.get(month)!;
    if (transaction.type === "expense") {
      data.expenses += Math.abs(transaction.amount);
    } else {
      data.income += transaction.amount;
    }
  });

  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      ...data,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
};

export const getCategoryData = (
  transactions: Transaction[]
): CategoryData[] => {
  const categoryMap = new Map<string, number>();
  let totalExpenses = 0;

  transactions
    .filter((t) => t.type === "expense" && t.category)
    .forEach((transaction) => {
      const category = transaction.category!;
      const amount = Math.abs(transaction.amount);

      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
      totalExpenses += amount;
    });

  return Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpenses) * 100,
      color:
        CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "#6b7280",
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getBudgetVsActual = (
  transactions: Transaction[],
  budgets: Budget[],
  month: string
): BudgetVsActual[] => {
  const actualSpending = new Map<string, number>();

  // Calculate actual spending for the month
  transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        t.category &&
        new Date(t.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }) === month
    )
    .forEach((transaction) => {
      const category = transaction.category!;
      const amount = Math.abs(transaction.amount);
      actualSpending.set(
        category,
        (actualSpending.get(category) || 0) + amount
      );
    });

  // Get budgets for the month
  const monthBudgets = budgets.filter((b) => b.month === month);

  return monthBudgets.map((budget) => {
    const actual = actualSpending.get(budget.category) || 0;
    const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;

    let status: "under" | "over" | "on-track" = "on-track";
    if (percentage > 100) status = "over";
    else if (percentage < 80) status = "under";

    return {
      category: budget.category,
      budget: budget.amount,
      actual,
      percentage,
      status,
    };
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};
