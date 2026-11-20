import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getStoredToken, getStoredUser, setAuthSession, clearAuthSession } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial session check
  useEffect(() => {
    async function checkAuth() {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        setUser(storedUser);
        setToken(storedToken);

        try {
          const res = await api.validateSession(storedToken);
          if (res.status === 'success' && res.user) {
            setUser(res.user);
            setAuthSession(storedToken, res.user);
          } else if (res.expired) {
            clearAuthSession();
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.warn('Session verification warning:', err);
        }
      }
      setLoading(false);
    }

    checkAuth();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.status === 'success') {
        setUser(res.user);
        setToken(res.token);
        if (rememberMe) {
          setAuthSession(res.token, res.user);
        }
        return { success: true, user: res.user };
      } else {
        return { success: false, message: res.message || 'Login gagal' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Terjadi kesalahan jaringan' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, username, email, password) => {
    setLoading(true);
    try {
      const res = await api.register({
        full_name: fullName,
        username,
        email,
        password
      });

      if (res.status === 'success') {
        setUser(res.user);
        setToken(res.token);
        setAuthSession(res.token, res.user);
        return { success: true, user: res.user };
      } else {
        return { success: false, message: res.message || 'Registrasi gagal' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Terjadi kesalahan jaringan' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout warning:', err);
    }
    clearAuthSession();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, message: 'Tidak terotentikasi' };
    try {
      const res = await api.updateProfile({ user_id: user.id, ...updates });
      if (res.status === 'success') {
        setUser(res.user);
        setAuthSession(token, res.user);
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, message: 'Tidak terotentikasi' };
    try {
      const res = await api.changePassword({
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword
      });
      return { success: res.status === 'success', message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
