import React, { createContext, useContext, useState } from 'react';
import { MOCK_ADMIN_USER } from '../constants/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kth_admin_user');
    return saved ? JSON.parse(saved) : MOCK_ADMIN_USER;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kth_admin_auth') !== 'false';
  });

  const login = (email, password) => {
    // Simulated authentication success
    const userData = { ...MOCK_ADMIN_USER, email: email || MOCK_ADMIN_USER.email };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('kth_admin_auth', 'true');
    localStorage.setItem('kth_admin_user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('kth_admin_auth', 'false');
  };

  const updateProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('kth_admin_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
