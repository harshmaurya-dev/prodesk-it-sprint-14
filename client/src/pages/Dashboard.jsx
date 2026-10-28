import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout, API } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Loading protected data...');

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API}/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
        });
        const data = await response.json();
        if (response.status === 401) { logout(); navigate('/login', { replace: true }); return; }
        if (!response.ok) throw new Error(data.message || 'Could not load dashboard.');
        if (active) setMessage(data.message);
      } catch (error) {
        if (active) setMessage(error.message || 'Unable to connect to the API.');
      }
    };
    loadDashboard();
    return () => { active = false; };
  }, [API, logout, navigate]);

  return (
    <main className="dashboard">
      <header><div><div className="brand">PRODESK <span>IT</span></div><small>Sprint 14 · Secure Authentication MVP</small></div>
        <button className="logout" onClick={() => { logout(); navigate('/login', { replace: true }); }}>Logout</button>
      </header>
      <section className="hero"><p className="eyebrow">PROTECTED ROUTE</p><h1>Welcome, {user?.name}</h1><p>{message}</p></section>
      <section className="grid"><article><h3>JWT verified</h3><p>Your dashboard request includes a Bearer token.</p></article><article><h3>Route guard active</h3><p>Unauthenticated users are redirected to the login page.</p></article><article><h3>Secure password</h3><p>Passwords are hashed with bcrypt before MongoDB storage.</p></article></section>
    </main>
  );
}
