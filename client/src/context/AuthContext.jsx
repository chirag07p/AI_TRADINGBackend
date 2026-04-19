import React, { createContext, useContext, useState } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login via backend API
  const login = async ({ email, password, role }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiLogin({ email, password });
      const userData = { ...data, role: role || 'Customer' };
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register via backend API
  const register = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRegister({ name, email, password });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Legacy mock login (for roles not backed by DB like Admin/Employee)
  const mockLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, login, register, mockLogin, logout, loading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
