import { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(false); }, []);
  const saveSession = (data) => { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); };
  const login = async (email, password) => { const res = await fetch(`${API}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) }); const data=await res.json(); if(!res.ok) throw new Error(data.message || 'Login failed'); saveSession(data); };
  const register = async (name, email, password) => { const res = await fetch(`${API}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password}) }); const data=await res.json(); if(!res.ok) throw new Error(data.message || 'Registration failed'); saveSession(data); };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };
  return <AuthContext.Provider value={{user,loading,login,register,logout,API}}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
