import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [sort, setSort] = useState('newest');
  
  // Pagination State parameters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearch = useDebounce(search, 300);

  // Fetch categories on mount
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Reset to page 1 automatically whenever search queries change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCat, sort]);

  // Handle data fetching dynamically
  useEffect(() => {
    let url = `/products?page=${currentPage}&limit=8&search=${debouncedSearch}&sort=${sort}`;
    if (selectedCat) {
      url += `&category=${selectedCat}`;
    }

    api.get(url)
      .then(res => {
        setProducts(res.data.products);
        setTotalPages(res.data.total_pages);
        setTotalCount(res.data.total);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, [currentPage, debouncedSearch, selectedCat, sort]);

  return (
    <div className="container">
      {/* Filter Options Panel */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
        <input 
          type="text" 
          placeholder="Search product catalogue..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="form-control" 
          style={{ flex: 2, minWidth: '200px' }} 
        />
        
        <select 
          value={selectedCat} 
          onChange={e => setSelectedCat(e.target.value)} 
          className="form-control" 
          style={{ flex: 1, minWidth: '150px' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select 
          value={sort} 
          onChange={e => setSort(e.target.value)} 
          className="form-control" 
          style={{ flex: 1, minWidth: '150px' }}
        >
          <option value="newest">Sort by: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Item Counter Info Indicators */}
      <div style={{ marginBottom: '1rem', color: '#475569', fontWeight: '500' }}>
        Showing {products.length} of {totalCount} products
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Our Products</h2>
      {products.length === 0 ? (
        <p style={{ color: '#64748b' }}>No catalog records matched your criteria.</p>
      ) : (
        <>
          <div className="product-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

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