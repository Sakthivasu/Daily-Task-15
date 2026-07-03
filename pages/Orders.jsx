import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Your Personal Order History</h2>
      {orders.length === 0 ? (
        <p style={{ color: '#64748b', marginTop: '1rem' }}>No historical checkout transactions recorded for this account.</p>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Invoice ID: #00{o.id}</span>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Purchased On: {new Date(o.ordered_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                  <div style={{ fontWeight: 'bold', marginTop: '0.25rem', textAlign: 'right' }}>Total: ${o.total_amount}</div>
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                {o.items?.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.95rem' }}>
                    <span style={{ color: '#334155' }}>{item.product_name} <span style={{ color: '#94a3b8' }}>x{item.quantity}</span></span>
                    <span style={{ fontWeight: '500' }}>${item.unit_price}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '0.6rem', borderRadius: '4px', fontSize: '0.85rem', color: '#475569' }}><strong>Shipping Destination:</strong> {o.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}