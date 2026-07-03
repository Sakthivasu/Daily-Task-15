import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(() => setError('Target product profile missing.'));
  }, [id]);

  if (error) return <div className="container"><h3>{error}</h3></div>;
  if (!product) return <div className="container"><h3>Gathering details...</h3></div>;

  return (
    <div className="container" style={{ display: 'flex', gap: '3rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--card-shadow)', marginTop: '2rem' }}>
      <img src={product.image_url} alt={product.name} style={{ width: '45%', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px' }} />
      <div style={{ width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span className="badge badge-confirmed" style={{ fontSize: '0.8rem' }}>{product.category_name}</span>
          <h1 style={{ margin: '0.5rem 0 1rem 0' }}>{product.name}</h1>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>${product.price}</h2>
          <p style={{ color: '#475569', lineHeight: '1.6' }}>{product.description}</p>
          <p style={{ marginTop: '1rem', fontWeight: '600' }}>Inventory Units Remaining: <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>{product.stock} units</span></p>
        </div>
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '2rem' }}>
          {product.stock > 0 ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="number" min="1" max={product.stock} value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} className="form-control" style={{ width: '80px', textAlign: 'center' }} />
              <button onClick={() => { addToCart(product, qty); navigate('/cart'); }} className="btn btn-success" style={{ flexGrow: 1, padding: '0.8rem' }}>Add To Shopping Cart</button>
            </div>
          ) : (
            <button className="btn" style={{ background: '#cbd5e1', color: '#64748b', width: '100%', cursor: 'not-allowed' }} disabled>Product Out of Stock</button>
          )}
        </div>
      </div>
    </div>
  );
}