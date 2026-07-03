import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(email, pass);
      navigate(u.role === 'admin' ? '/admin/products' : '/');
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Invalid email or password match configuration.');
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Account Login</h2>
      {err && <p style={{ color: 'white', background: 'var(--danger)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>{err}</p>}
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group"><label>Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required /></div>
        <div className="form-group"><label>Password</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} className="form-control" required /></div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem' }}>Authenticate</button>
      </form>
      <p style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem', color: '#64748b' }}>New to the store? <Link to="/register" style={{ color: 'var(--primary)' }}>Register account here</Link></p>
    </div>
  );
}