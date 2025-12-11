import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../services/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_SESSION = 'mineprev_current_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for persisted session
    const savedUser = localStorage.getItem(STORAGE_KEY_SESSION);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = loginUser(email, password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password // storing plain text for this mock
    };
    const result = registerUser(newUser);
    if (result) {
      setUser(result);
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(result));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};