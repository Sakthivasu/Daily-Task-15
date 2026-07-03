import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchItems = () => {
    api.get('/products').then(res => {
      // Safely extract the array from the API response
      const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
      setProducts(data);
    });
  };

  useEffect(() => { fetchItems(); }, []);

  const handlePurge = async (id) => {
    if (!window.confirm("Confirm deletion of this product?")) return;
    await api.delete(`/products/${id}`);
    fetchItems();
    setCurrentPage(1); // Reset page to avoid empty states after deletion
  };

  // Safe pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstItem, indexOfLastItem) : [];

  return (
    <div className="container" style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)', marginTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <Link to="/admin/products" style={{ fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>📦 Products Catalog</Link>
        <Link to="/admin/orders" style={{ fontWeight: '500', color: '#64748b', textDecoration: 'none' }}>📋 Customer Order Ledger</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Product Inventory Catalog Control</h2>
        <Link to="/admin/products/add" className="btn btn-success">+ Add New Product</Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <th>ID</th>
            <th>Item Preview</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td>{p.id}</td>
              <td><img src={p.image_url} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', margin: '0.5rem 0' }} /></td>
              <td style={{ fontWeight: '500' }}>{p.name}</td>
              <td>{p.category_name}</td>
              <td>${p.price}</td>
              <td style={{ color: p.stock === 0 ? 'var(--danger)' : 'inherit', fontWeight: p.stock === 0 ? 'bold' : 'normal' }}>{p.stock} units</td>
              <td>
                <Link to={`/admin/products/edit/${p.id}`} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', marginRight: '0.5rem', background: '#475569' }}>Edit</Link>
                <button type="button" onClick={() => handlePurge(p.id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="btn">Previous</button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button type="button" disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="btn">Next</button>
      </div>
    </div>
  );
}