import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function Dashboard() {
  const { user, logout, API } = useAuth(); const [message,setMessage]=useState('Loading protected data...');
  useEffect(()=>{ fetch(`${API}/dashboard`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}).then(async r=>{const d=await r.json();if(!r.ok) throw new Error(d.message);setMessage(d.message);}).catch(e=>setMessage(e.message));},[API]);
  return <main className="dashboard"><header><div><div className="brand">PRODESK <span>IT</span></div><small>Sprint 14 · Secure Authentication MVP</small></div><button className="logout" onClick={logout}>Logout</button></header><section className="hero"><p className="eyebrow">PROTECTED ROUTE</p><h1>Welcome, {user?.name}</h1><p>{message}</p></section><section className="grid"><article><h3>JWT verified</h3><p>Your dashboard request includes a Bearer token.</p></article><article><h3>Route guard active</h3><p>Unauthenticated users are redirected to the login page.</p></article><article><h3>Secure password</h3><p>Passwords are hashed with bcrypt before MongoDB storage.</p></article></section></main>;
}
