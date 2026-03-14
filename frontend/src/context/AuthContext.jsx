import { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  console.log('AuthProvider: Initial token from localStorage:', token ? 'Present' : 'Not present');

  useEffect(() => {
    console.log('AuthProvider: useEffect triggered with token:', token ? 'Present' : 'Not present');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('AuthProvider: Decoded user:', decoded);
        setUser(decoded);
      } catch (error) {
        console.error('AuthProvider: Error decoding token:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    } else {
      console.log('AuthProvider: No token, setting user to null');
      setUser(null);
    }
  }, [token]);

  const login = (token) => {
    console.log('AuthProvider: Login called with token');
    localStorage.removeItem('token'); // Nettoyer d'abord
    localStorage.setItem('token', token);
    setToken(token);
    const decoded = jwtDecode(token);
    console.log('AuthProvider: User logged in:', decoded);
    setUser(decoded);
  };

  const logout = () => {
    console.log('AuthProvider: Logout called');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};