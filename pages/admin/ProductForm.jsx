import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });

  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data);
      if (res.data.length > 0 && !id) setFormData(p => ({ ...p, category_id: res.data[0].id }));
    });
    if (id) api.get(`/products/${id}`).then(res => setFormData(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await api.put(`/products/${id}`, formData);
    else await api.post('/products', formData);
    navigate('/admin/products');
  };

  return (
    <div className="container" style={{ maxWidth: '600px', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
      <h2>{id ? 'Modify Product Specifications' : 'Catalog New Product Entry'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="form-group"><label>Product Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-control" required /></div>
        <div className="form-group"><label>Detailed Description</label><textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-control" required></textarea></div>
        <div className="form-group"><label>Retail Price ($)</label><input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="form-control" required /></div>
        <div className="form-group"><label>Initial Inventory Stock Count</label><input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="form-control" required /></div>
        <div className="form-group">
          <label>Category Assignment</label>
          <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })} className="form-control">
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group"><label>External Asset Image URL</label><input type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="form-control" required /></div>
        <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>Save Changes to Inventory Ledger</button>
      </form>
    </div>
  );
}