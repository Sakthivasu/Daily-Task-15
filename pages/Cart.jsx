import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const grandTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Your shopping cart is completely empty</h2>
        <p style={{ color: '#64748b', margin: '1rem 0 2rem 0' }}>Add some products from the storefront to get started.</p>
        <Link to="/" className="btn btn-primary">Browse Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Shopping Cart Ledger</h2>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '320px' }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', alignItems: 'center', boxShadow: 'var(--card-shadow)' }}>
              <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ margin: 0 }}>{item.name}</h4>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>${item.price} each</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => updateQuantity(item.id, -1)} className="btn" style={{ padding: '0.2rem 0.6rem', background: '#e2e8f0' }}>-</button>
                <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="btn" style={{ padding: '0.2rem 0.6rem', background: '#e2e8f0' }}>+</button>
              </div>
              <div style={{ fontWeight: 'bold', width: '80px', textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</div>
              <button onClick={() => removeFromCart(item.id)} className="btn btn-danger" style={{ padding: '0.4rem' }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: '280px', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)', height: 'fit-content' }}>
          <h3>Order Subtotal</h3>
          <div style={{ display: 'flex', justifyContent: 'span-between', fontSize: '1.2rem', margin: '1.5rem 0', fontWeight: 'bold' }}>
            <span>Estimated Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-success" style={{ width: '100%', padding: '0.8rem' }}>Proceed To Secure Checkout</Link>
        </div>
      </div>
    </div>
  );
}