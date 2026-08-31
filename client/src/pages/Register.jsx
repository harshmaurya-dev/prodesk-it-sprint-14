import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => { e.preventDefault(); setBusy(true); setError(''); try { await register(form.name, form.email, form.password); navigate('/dashboard', { replace:true }); } catch(err) { setError(err.message); } finally { setBusy(false); } };
  return <AuthCard title="Create account" subtitle="Register once and your session is ready for protected routes."><form onSubmit={submit}><label>Name<input required minLength="2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" required minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error && <div className="error">{error}</div>}<button disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button></form><p className="switch">Already registered? <Link to="/login">Sign in</Link></p></AuthCard>;
}
