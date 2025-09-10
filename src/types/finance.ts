
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category?: string;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string;
}

export interface BudgetVsActual {
  category: string;
  budget: number;
  actual: number;
  percentage: number;
  status: 'under' | 'over' | 'on-track';
}

export const CATEGORIES = [
  'Food',
  'Bills',
  'Transport',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_COLORS = {
  Food: '#ef4444',
  Bills: '#f59e0b',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Entertainment: '#8b5cf6',
  Healthcare: '#10b981',
  Education: '#06b6d4',
  Other: '#6b7280'
} as const;
