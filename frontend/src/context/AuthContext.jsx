import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { useToast } from '../components/Toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // Verify token on mount to restore user session (persists after browser refreshes)
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('prepai_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data?.success) {
          setUser(response.data.data.user);
        }
      } catch (err) {
        console.error('JWT validation failed on startup:', err.message);
        localStorage.removeItem('prepai_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();

    // Listen for global 401 unauthorization intercepts from Axios client
    const handleUnauthorized = (e) => {
      setUser(null);
      const msg = e.detail?.message || 'Session expired. Please login again.';
      showToast(msg, 'error');
    };
    window.addEventListener('prepai_unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('prepai_unauthorized', handleUnauthorized);
    };
  }, [showToast]);

  // Register Controller
  const registerUser = async (fullName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      if (response.data?.success) {
        const { token, user: newUser } = response.data.data;
        localStorage.setItem('prepai_token', token);
        setUser(newUser);
        showToast('Registration successful! Welcome to PrepAI.', 'success');
        return { success: true };
      }
    } catch (err) {
      // Axios interceptor parsed error
      let errMsg = err.message || 'Registration failed.';
      if (err.errors && err.errors.length > 0) {
        errMsg = err.errors.map(e => e.message).join(' ');
      }
      setError(errMsg);
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login Controller
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success) {
        const { token, user: loggedUser } = response.data.data;
        localStorage.setItem('prepai_token', token);
        setUser(loggedUser);
        showToast(`Welcome back, ${loggedUser.fullName}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      let errMsg = err.message || 'Invalid login credentials.';
      if (err.errors && err.errors.length > 0) {
        errMsg = err.errors.map(e => e.message).join(' ');
      }
      setError(errMsg);
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout Controller
  const logoutUser = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Backend logout out-of-sync:', err.message);
    } finally {
      localStorage.removeItem('prepai_token');
      setUser(null);
      setLoading(false);
      showToast('Logged out successfully.', 'success');
    }
  };

  const value = {
    user,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    setError,
    updateUser: (updatedUser) => setUser(updatedUser)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an AuthProvider context');
  }
  return context;
};
