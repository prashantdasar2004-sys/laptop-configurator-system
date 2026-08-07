import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role = 'sales_exec') => {
    setLoading(true);
    try {
      const demoUser = role === 'admin' 
        ? { id: 'demo-admin-1', name: 'Prashant Dasar (Manager)', email: 'prashantdasar2004@gmail.com', role: 'pricing_manager' }
        : { id: 'demo-sales-1', name: 'Sarah Connor (Sales)', email: 'sales@retailer.com', role: 'sales_exec' };

      const dummyToken = 'demo-jwt-token-' + role;
      setUser(demoUser);
      setToken(dummyToken);
      localStorage.setItem('token', dummyToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, demoLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
