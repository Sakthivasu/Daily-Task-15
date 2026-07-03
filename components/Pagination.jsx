import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) { pages.push(i); }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', padding: '1rem' }}>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="btn"
        style={{ background: currentPage === 1 ? '#cbd5e1' : '#475569', color: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
      >
        ◀ Prev
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="btn"
          style={{
            background: currentPage === page ? '#3b82f6' : 'white',
            color: currentPage === page ? 'white' : '#1e293b',
            border: '1px solid #cbd5e1',
            fontWeight: currentPage === page ? 'bold' : 'normal'
          }}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="btn"
        style={{ background: currentPage === totalPages ? '#cbd5e1' : '#475569', color: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
      >
        Next ▶
      </button>
    </div>
  );
}