import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers = [
  { id: '1', email: 'demo@example.com', password: 'password123', name: 'Demo User' },
  { id: '2', email: 'john@example.com', password: 'password123', name: 'John Doe' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }

    // Mock JWT token
    const mockToken = `mock.jwt.token.${mockUser.id}`;
    const userData = { id: mockUser.id, email: mockUser.email, name: mockUser.name };
    
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      setIsLoading(false);
      throw new Error('User already exists with this email');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name
    };
    
    mockUsers.push(newUser);
    
    // Mock JWT token
    const mockToken = `mock.jwt.token.${newUser.id}`;
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
    
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}