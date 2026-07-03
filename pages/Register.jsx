import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState('customer');
  const [err, setErr] = useState('');

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, pass, role);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-card">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
      {err && <p style={{ color: 'white', background: 'var(--danger)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>{err}</p>}
      <form onSubmit={handleRegSubmit}>
        <div className="form-group"><label>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" required /></div>
        <div className="form-group"><label>Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required /></div>
        <div className="form-group"><label>Password</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} className="form-control" required /></div>
        <div className="form-group">
          <label>Account Role Access Privilege Level</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="form-control">
            <option value="customer">Standard Customer</option>
            <option value="admin">System Admin Manager</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem' }}>Register Account</button>
      </form>
      <p style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem', color: '#64748b' }}>Already possess an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in here</Link></p>
    </div>
  );
}