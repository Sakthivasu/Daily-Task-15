import React, { useState, useEffect } from 'react';
import api from '../../api';
import Pagination from '../../components/Pagination';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination Hooks configuration parameters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllOrders = () => {
    setLoading(true);
    api.get(`/orders?page=${currentPage}&limit=10`)
      .then(res => {
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
        setTotalPages(res.data.total_pages);
        setLoading(false);
      })
      .catch(err => {
        console.error("Order fetch error details:", err);
        setError(
          err.response?.status === 403 
            ? "Access Denied: Your account role does not have admin permissions."
            : err.response?.data?.message || 'Failed to fetch customer history records from backend.'
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllOrders();
  }, [currentPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      alert(`Order #${orderId} has been successfully updated to ${newStatus}!`);
      fetchAllOrders(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating fulfillment status.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}><h3>⏳ Loading customer history records...</h3></div>;
  
  if (error) return (
    <div className="container" style={{ background: '#fef2f2', padding: '2rem', borderRadius: '8px', border: '1px solid #fecaca', marginTop: '2rem' }}>
      <h3 style={{ color: '#dc2626', margin: '0 0 0.5rem 0' }}>⚠️ Authentication or Server Error</h3>
      <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
      <button onClick={fetchAllOrders} className="btn btn-primary" style={{ marginTop: '1rem', background: '#dc2626', border: 'none' }}>Retry Connection</button>
    </div>
  );

  return (
    <div className="container" style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)', marginTop: '2rem' }}>
      <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>👥 Master Customer Order History Ledger</h2>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Monitor client purchases, shipping addresses, and control fulfillment states.</p>
        </div>
        <button className="btn btn-primary" onClick={fetchAllOrders} style={{ background: '#475569', border: 'none' }}>🔄 Refresh</button>
      </div>

      {orders.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No customer checkout transactions have been recorded yet.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569', fontSize: '0.9rem' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Order ID</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Date Placed</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Purchased Items</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Grand Total</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Shipping Destination</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Fulfillment Control</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.95rem' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>#00{o.id}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{o.customer_name || 'Anonymous Client'}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    {o.ordered_at ? new Date(o.ordered_at).toLocaleDateString() : 'Date Pending'}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                    {(o.items || []).map((item, idx) => (
                      <div key={idx} style={{ margin: '2px 0' }}>
                        📦 {item.product_name || 'Item Name Missing'} <strong style={{ color: '#64748b' }}>x{item.quantity || 1}</strong> (${item.unit_price || 0})
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', color: '#0f172a' }}>${o.total_amount || 0}</td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.8rem', color: '#64748b', maxWidth: '180px', wordWrap: 'break-word' }}>
                    {o.address || 'No Address Listed'}
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <select 
                      value={o.status || 'Pending'} 
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      className="form-control" 
                      style={{ 
                        padding: '0.4rem', 
                        fontSize: '0.85rem', 
                        width: '135px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '1px solid #cbd5e1',
                        fontWeight: '600'
                      }}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Confirmed">✅ Confirmed</option>
                      <option value="Shipped">🚚 Shipped</option>
                      <option value="Delivered">🏠 Delivered</option>
                      <option value="Cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}