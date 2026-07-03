import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setProcessing(true);
    setErrorMessage('');

    const payload = {
      address: address,
      items: cartItems.map(i => ({ product_id: i.id, qty: i.qty }))
    };

    try {
      await api.post('/orders', payload);
      clearCart();
      alert('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Order routing connection execution timed out.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container">
      <h2>Secure Order Checkout</h2>
      {errorMessage && <div style={{ color: 'white', background: 'var(--danger)', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>{errorMessage}</div>}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSubmitOrder} style={{ flex: 2, minWidth: '320px', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
          <h3>Shipping Destination Address</h3>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Full Delivery Street Address</label>
            <textarea rows="4" value={address} onChange={e => setAddress(e.target.value)} className="form-control" placeholder="123 Developer Way, Apartment 4B, Tech City, 560001" required></textarea>
          </div>
          <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }} disabled={processing}>{processing ? 'Authorizing Transaction...' : 'Place Secure Order'}</button>
        </form>
        <div style={{ flex: 1, minWidth: '280px', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
          <h3>Summary Overview</h3>
          {cartItems.map(i => <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', margin: '0.5rem 0' }}><span>{i.name} (x{i.qty})</span><span>${(i.price * i.qty).toFixed(2)}</span></div>)}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}><span>Grand Total:</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}