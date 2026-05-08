'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

export default function ClothingClient({ products, subcategories, initialFilter, initialCollection, initialBadgeFilter }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || '');

  useEffect(() => {
    if (initialFilter) setActiveFilter(initialFilter);
    else if (initialBadgeFilter === 'new') setActiveFilter('__new');
    else if (initialBadgeFilter === 'trending') setActiveFilter('__trending');
    else if (initialCollection) setActiveFilter('__col_' + initialCollection);
  }, [initialFilter, initialCollection, initialBadgeFilter]);

  const filtered = useMemo(() => {
    if (!activeFilter) return products;
    if (activeFilter === '__new') return products.filter(p => p.badge === 'NEW' || p.badge === 'EXCLUSIVE');
    if (activeFilter === '__trending') return products.filter(p => p.badge === 'TRENDING' || p.badge === 'BESTSELLER');
    if (activeFilter.startsWith('__col_')) {
      const col = activeFilter.replace('__col_', '');
      return products.filter(p => p.collection === col);
    }
    return products.filter(p => p.subcategory === activeFilter);
  }, [products, activeFilter]);

  const tabs = [
    { slug: '', label: 'All' },
    { slug: '__trending', label: 'Trending' },
    { slug: '__new', label: 'New Arrivals' },
    ...subcategories.map(s => ({ slug: s.slug, label: s.name })),
  ];

  const title = activeFilter && !activeFilter.startsWith('__')
    ? subcategories.find(s => s.slug === activeFilter)?.name || 'Clothing'
    : activeFilter === '__new' ? 'New Arrivals'
    : activeFilter === '__trending' ? 'Trending Now'
    : activeFilter.startsWith('__col_') ? activeFilter.replace('__col_', '').replace(/-/g, ' ').toUpperCase()
    : "MEN'S CLOTHING";

  return (
    <section className="clothing-page">
      <div className="container">
        <h1>{title}</h1>
        <p className="clothing-count">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}</p>

        <div className="filter-chips">
          {tabs.map(tab => (
            <button
              key={tab.slug}
              className={`filter-chip ${activeFilter === tab.slug ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.slug)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No products found</p>
            <p style={{ fontSize: '0.85rem' }}>Check back soon for new arrivals!</p>
          </div>
        )}
      </div>
    </section>
  );
}
