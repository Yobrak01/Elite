import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // api.interceptors will automatically attach the token
      // Fetch user profile
      api.get('/auth/me')
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          console.error('Failed to fetch user', err);
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      const { token } = res.data;
      localStorage.setItem('token', token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token } = res.data;
      localStorage.setItem('token', token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};