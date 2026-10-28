import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const configuredApi = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const API = configuredApi || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');

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

async function apiRequest(path, options = {}) {
  if (!API) {
    throw new Error('Backend is not configured yet. Set VITE_API_URL in the Vercel frontend project and redeploy.');
  }
  let response;
  try {
    response = await fetch(`${API}${path}`, options);
  } catch {
    throw new Error('Cannot reach the backend API. Check that the server is deployed and VITE_API_URL points to its /api URL.');
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The backend returned an invalid response. Check the backend deployment and API route.');
  }
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status}).`);
  return data;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

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
        const data = await apiRequest('/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
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
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    saveSession(data);
  };

  const register = async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    saveSession(data);
  };

  const logout = useCallback(() => {
    clearStoredSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
