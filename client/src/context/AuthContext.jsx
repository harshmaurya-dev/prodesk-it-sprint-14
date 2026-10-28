import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const clearStoredSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  // Validate any saved session against the protected API before showing protected pages.
  useEffect(() => {
    let active = true;
    const validateSession = async () => {
      const token = localStorage.getItem('token');
      const storedUser = readStoredUser();

      if (!token || !storedUser) {
        clearStoredSession();
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Session is invalid or expired.');
        const data = await response.json();
        if (active) {
          const verifiedUser = data.user || storedUser;
          localStorage.setItem('user', JSON.stringify(verifiedUser));
          setUser(verifiedUser);
        }
      } catch {
        clearStoredSession();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    validateSession();
    return () => { active = false; };
  }, []);

  const saveSession = (data) => {
    if (!data?.token || !data?.user) throw new Error('The server did not return a valid session.');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed.');
    saveSession(data);
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed.');
    saveSession(data);
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
