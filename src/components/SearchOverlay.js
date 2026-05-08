'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/ProductCard';
import { DUMMY_PRODUCTS } from '@/lib/dummyData';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const filtered = query.trim().length < 2
    ? []
    : DUMMY_PRODUCTS.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q)
        );
      });

  return (
    <div className={`search-overlay ${isOpen ? 'open' : ''}`}>
      <div className="search-overlay-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          className="search-overlay-input"
          placeholder="Search for products..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="search-overlay-close" onClick={onClose} aria-label="Close search">✕</button>
      </div>
      <div className="search-overlay-results">
        {query.trim().length < 2 ? (
          <div className="search-overlay-empty">Start typing to search products...</div>
        ) : filtered.length === 0 ? (
          <div className="search-overlay-empty">No products found for &quot;{query}&quot;</div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
