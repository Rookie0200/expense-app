import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, handleApiError } from "../services/api";
// All API calls now use axios via api.ts

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ...existing code...

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user_data");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: userData, token } = await authApi.login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName:string) => {
    setIsLoading(true);
    try {
      const { user: userData, token } = await authApi.signup(
        email,
        password,
        firstName,
        lastName
      );
      localStorage.setItem("token", token);
      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
