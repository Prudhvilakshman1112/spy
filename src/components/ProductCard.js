'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product, compact = false }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const touchStartX = useRef(null);

  const images = product.images || [];
  const hasMultiple = images.length > 1;

  // Touch swipe
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0
        ? setActiveIndex(p => (p === images.length - 1 ? 0 : p + 1))
        : setActiveIndex(p => (p === 0 ? images.length - 1 : p - 1));
    }
    touchStartX.current = null;
  };

  const handleWishlistClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }, [product.id, toggleWishlist]);

  const currentSrc = images[activeIndex];

  return (
    <Link
      href={`/product/${product.id}`}
      className={`product-card ${compact ? 'product-card--compact' : ''}`}
      id={`product-${product.id}`}
    >
      {/* ── Image Area ── */}
      <div
        className="product-card-image"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fit Badge */}
        {product.fit && (
          <span className="product-card-fit">{product.fit.toUpperCase()}</span>
        )}

        {/* Product Image */}
        {currentSrc && !imgFailed ? (
          <Image
            src={currentSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            style={{ objectFit: 'cover' }}
            onError={() => setImgFailed(true)}
            draggable={false}
          />
        ) : (
          <div className="product-card-placeholder">
            <span>{product.subcategory}</span>
          </div>
        )}

        {/* Badge overlay (e.g. "PREMIUM INTERLOCK FABRIC") */}
        {product.badge && product.badge !== 'BESTSELLER' && product.badge !== 'TRENDING' && (
          <span className="product-card-badge">{product.badge}</span>
        )}
      </div>

      {/* ── Product Info ── */}
      <div className="product-card-info">
        <div className="product-card-info-left">
          <div className="product-card-name">{product.name}</div>
          <div className="product-card-sub">{product.subcategory ? product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1).replace(/-/g, ' ') : product.brand}</div>
          <div className="product-card-price">₹ {product.price.toLocaleString()}</div>
        </div>
        <button
          className={`product-card-heart ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24"
            fill={wishlisted ? '#ED1C24' : 'none'}
            stroke={wishlisted ? '#ED1C24' : '#999'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </Link>
  );
}
