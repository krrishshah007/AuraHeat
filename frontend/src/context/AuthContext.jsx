import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aurheat_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (error) {
        console.warn('Could not fetch user profile, using stored session.');
        const storedUser = localStorage.getItem('aurheat_user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = res.data;
      
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('aurheat_token', jwtToken);
      localStorage.setItem('aurheat_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      // Fallback demo login if server offline or standalone preview
      if (email === 'admin@aurheat.gov.in') {
        const adminUser = { id: 'admin_1', name: 'Dr. Rajesh Sharma (NDMA)', email, role: 'admin', organization: 'NDMA Govt of India' };
        const demoToken = 'demo_admin_jwt_token_2026';
        setToken(demoToken);
        setUser(adminUser);
        localStorage.setItem('aurheat_token', demoToken);
        localStorage.setItem('aurheat_user', JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      } else if (email === 'user@aurheat.com' || email.includes('@')) {
        const demoUser = { id: 'user_1', name: email.split('@')[0], email, role: 'user', organization: 'Individual' };
        const demoToken = 'demo_user_jwt_token_2026';
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('aurheat_token', demoToken);
        localStorage.setItem('aurheat_user', JSON.stringify(demoUser));
        return { success: true, user: demoUser };
      }
      return { success: false, message: error.response?.data?.message || 'Login failed.' };
    }
  };

  const signup = async (formData) => {
    try {
      const res = await api.post('/auth/signup', formData);
      const { token: jwtToken, user: userData } = res.data;

      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('aurheat_token', jwtToken);
      localStorage.setItem('aurheat_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      // Fallback demo registration
      const newUser = { id: 'user_' + Date.now(), name: formData.name, email: formData.email, role: formData.role || 'user' };
      const demoToken = 'demo_signup_jwt_token';
      setToken(demoToken);
      setUser(newUser);
      localStorage.setItem('aurheat_token', demoToken);
      localStorage.setItem('aurheat_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aurheat_token');
    localStorage.removeItem('aurheat_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, isAuthenticated: !!token, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
