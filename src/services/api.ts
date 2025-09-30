// API Service Layer for Backend Communication
// Simplified API communication logic for the finance tracker app

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

// Helper to get headers
function getHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Error handler
export function handleApiError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as any).response?.data?.message
  ) {
    return (error as any).response.data.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as any).message;
  }
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
}

// ===================== AUTH =====================
export const authApi = {
  async login(
    email: string,
    password: string
  ): Promise<{ user: any; token: string }> {
    const res = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { email, password },
      { headers: getHeaders() }
    );
    return res.data;
  },
  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ user: any; token: string }> {
    const res = await axios.post(
      `${API_BASE_URL}/auth/register`,
      { email, password, firstName, lastName },
      { headers: getHeaders() }
    );
    return res.data;
  },
  async getProfile(): Promise<any> {
    const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(),
    });
    return res.data;
  },
  async updateProfile(updates: {
    name?: string;
    email?: string;
  }): Promise<any> {
    const res = await axios.put(`${API_BASE_URL}/auth/profile`, updates, {
      headers: getHeaders(),
    });
    return res.data;
  },
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/auth/change-password`,
      { currentPassword, newPassword },
      { headers: getHeaders() }
    );
  },
};

// ===================== TRANSACTIONS =====================
export interface TransactionParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: "income" | "expense";
}

export interface Transaction {
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category?: string;
}

export const transactionsApi = {
  async getTransactions(params: TransactionParams = {}): Promise<{
    transactions: any[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        query.append(key, String(value));
    });
    const url = `${API_BASE_URL}/transactions${
      query.toString() ? `?${query.toString()}` : ""
    }`;
    const res = await axios.get(url, { headers: getHeaders() });
    // console.log("API - getTransactions response:", res.data);
    return res.data.data;
  },
  async createTransaction(transaction: Transaction): Promise<any> {
    // console.log("API - Creating transaction:", transaction);
    const res = await axios.post(
      `${API_BASE_URL}/transactions/add`,
      { ...transaction },
      { headers: getHeaders() }
    );
    // console.log("API - Created transaction response:", res.data);
    return res.data;
  },
  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<any> {
    const res = await axios.put(
      `${API_BASE_URL}/transactions/update/${id}`,
      updates,
      { headers: getHeaders() }
    );
    return res.data;
  },
  async deleteTransaction(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/transactions/delete/${id}`, {
      headers: getHeaders(),
    });
  },
  async getTransactionStats(
    params: { startDate?: string; endDate?: string } = {}
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    categoryBreakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
    monthlyData: Array<{
      month: string;
      income: number;
      expenses: number;
    }>;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        query.append(key, String(value));
    });
    const url = `${API_BASE_URL}/transactions/stats${
      query.toString() ? `?${query.toString()}` : ""
    }`;
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data;
  },
};

// ===================== BUDGETS =====================
export interface BudgetParams {
  month?: string;
  year?: number;
}

export interface Budget {
  category: string;
  amount: number;
  month: string;
}

export const budgetsApi = {
  async getBudgets(params: BudgetParams = {}): Promise<any[]> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        query.append(key, String(value));
    });
    const url = `${API_BASE_URL}/budget${
      query.toString() ? `?${query.toString()}` : ""
    }`;
    const res = await axios.get(url, { headers: getHeaders() });
    return res.data.data.budgets;
  },
  async createBudget(budget: Budget): Promise<any> {
    const res = await axios.post(`${API_BASE_URL}/budget/add`, budget, {
      headers: getHeaders(),
    });
    return res.data;
  },
  async updateBudget(id: string, updates: Partial<Budget>): Promise<any> {
    const res = await axios.put(
      `${API_BASE_URL}/budget/update/${id}`,
      updates,
      { headers: getHeaders() }
    );
    return res.data;
  },
  async deleteBudget(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/budget/delete/${id}`, {
      headers: getHeaders(),
    });
  },
  async getBudgetVsActual(month?: string): Promise<
    Array<{
      category: string;
      budget: number;
      actual: number;
      percentage: number;
      status: "under" | "over" | "on-track";
    }>
  > {
    const url = `${API_BASE_URL}/budget/vs${month ? `?month=${month}` : ""}`;
    const res = await axios.get(url, { headers: getHeaders() });
    console.log("the res.data.comparison is :", res.data.data.comparison)
    return res.data.data.comparison;
  },
};

// ===================== CATEGORIES =====================
export const categoriesApi = {
  async getCategories(): Promise<string[]> {
    const res = await axios.get(`${API_BASE_URL}/categories`, {
      headers: getHeaders(),
    });
    return res.data;
  },
  async addCategory(category: string): Promise<string[]> {
    const res = await axios.post(
      `${API_BASE_URL}/categories`,
      { category },
      { headers: getHeaders() }
    );
    return res.data;
  },
  async deleteCategory(category: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/categories/${encodeURIComponent(category)}`,
      { headers: getHeaders() }
    );
  },
};

// ===================== EXPORT =====================
export const exportApi = {
  async exportTransactionsCSV(
    params: {
      startDate?: string;
      endDate?: string;
      category?: string;
      type?: "income" | "expense";
    } = {}
  ): Promise<Blob> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        query.append(key, String(value));
    });
    const url = `${API_BASE_URL}/export/transactions/csv${
      query.toString() ? `?${query.toString()}` : ""
    }`;
    const token = getAuthToken();
    const res = await axios.get(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      responseType: "blob",
    });
    return res.data;
  },
  async exportBudgetReportPDF(month?: string): Promise<Blob> {
    const url = `${API_BASE_URL}/export/budget-report/pdf${
      month ? `?month=${month}` : ""
    }`;
    const token = getAuthToken();
    const res = await axios.get(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      responseType: "blob",
    });
    return res.data;
  },
};
