import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email:'', password:'' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => { e.preventDefault(); setBusy(true); setError(''); try { await login(form.email, form.password); navigate(location.state?.from?.pathname || '/dashboard', { replace:true }); } catch(err) { setError(err.message); } finally { setBusy(false); } };
  return <AuthCard title="Welcome back" subtitle="Sign in to access your protected workspace."><form onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error && <div className="error">{error}</div>}<button disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form><p className="switch">New here? <Link to="/register">Create an account</Link></p></AuthCard>;
}
