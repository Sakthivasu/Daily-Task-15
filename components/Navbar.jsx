import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav style={{ background: '#1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold' }}>🛒Digital Store</Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>🏠Home</Link>
        <Link to="/cart" style={{ color: '#cbd5e1', textDecoration: 'none', position: 'relative' }}>
          🛍Cart 
          {totalItems > 0 && <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', position: 'absolute', top: '-10px', right: '-15px' }}>{totalItems}</span>}
        </Link>
        {user ? (
          <>
            <Link to="/orders" style={{ color: '#cbd5e1', textDecoration: 'none' }}>History</Link>
            {user.role === 'admin' && <Link to="/admin/products" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>}
            <span style={{ color: '#94a3b8' }}>Hi, {user.name}</span>
            <button onClick={() => logout().then(() => navigate('/login'))} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>👤Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>👥Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}