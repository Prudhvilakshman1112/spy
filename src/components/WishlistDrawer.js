'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { DUMMY_PRODUCTS } from '@/lib/dummyData';

export default function WishlistDrawer() {
  const { wishlistIds, isOpen, setIsOpen, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);

  // Look up wishlist products from local dummy data
  useEffect(() => {
    if (!isOpen || wishlistIds.length === 0) {
      setProducts([]);
      return;
    }
    const found = DUMMY_PRODUCTS.filter(p => wishlistIds.includes(p.id));
    setProducts(found);
  }, [isOpen, wishlistIds]);

  const handleAddToCart = (product) => {
    addItem(product, product.sizes?.[0] || 'One Size', product.colors?.[0] || '');
    removeFromWishlist(product.id);
  };

  const visibleProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`drawer drawer--right ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>WISHLIST ({wishlistIds.length})</h3>
          <button className="drawer-close" onClick={() => setIsOpen(false)} aria-label="Close wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {wishlistIds.length === 0 ? (
          <div className="drawer-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p>Your wishlist is empty</p>
            <span>Start adding products you love!</span>
          </div>
        ) : (
          <div className="drawer-items">
            {visibleProducts.map(product => (
              <div className="drawer-item" key={product.id}>
                <div className="drawer-item-image">
                  {product.images?.[0] && (
                    <Image src={product.images[0]} alt={product.name} fill sizes="80px"
                      style={{ objectFit: 'cover' }} />
                  )}
                </div>
                <div className="drawer-item-info">
                  <div className="drawer-item-name">{product.name}</div>
                  <div className="drawer-item-price">₹{product.price?.toLocaleString()}</div>
                  <div className="drawer-item-actions">
                    <button className="btn-sm btn-primary" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                    <button className="btn-sm btn-ghost" onClick={() => removeFromWishlist(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
