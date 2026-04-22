'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

/**
 * Generate a deterministic gradient placeholder for products without real images.
 * Uses the product id to create unique but consistent colors.
 */
function getPlaceholderGradient(id, index = 0) {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = (hash + index * 47) % 360;
  const hue2 = (hash * 7 + index * 31) % 360;
  return `linear-gradient(${135 + index * 45}deg, hsl(${hue1}, 25%, 85%) 0%, hsl(${hue2}, 20%, 75%) 100%)`;
}

/**
 * Checks if an image path exists by attempting to load it.
 * Returns false for placeholder paths that don't exist yet.
 */
function useImageExists(src) {
  // For SSR safety, assume images exist. The browser will show the
  // fallback gradient if they fail to load via the onError handler.
  return true;
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());
  const cardRef = useRef(null);

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes?.[0] || 'One Size', product.colors?.[0] || '');
  };

  const handleThumbHover = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleCardEnter = useCallback(() => {
    setIsHovering(true);
    // If there's a second image, auto-switch to it on card hover
    if (hasMultipleImages && activeIndex === 0) {
      setActiveIndex(1);
    }
  }, [hasMultipleImages, activeIndex]);

  const handleCardLeave = useCallback(() => {
    setIsHovering(false);
    setActiveIndex(0);
  }, []);

  const handleImageError = useCallback((index) => {
    setFailedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // Determine what to show for each image slot
  const renderImage = (index, className) => {
    const src = images[index];
    const hasFailed = failedImages.has(index);

    if (src && !hasFailed) {
      return (
        <Image
          src={src}
          alt={`${product.name} - View ${index + 1}`}
          className={className}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
          onError={() => handleImageError(index)}
          draggable={false}
        />
      );
    }

    // Fallback: gradient placeholder
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          background: getPlaceholderGradient(product.id, index),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {index === 0 && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: getPlaceholderGradient(product.id, index + 10),
              opacity: 0.6,
            }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'rgba(0,0,0,0.4)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}>{product.subcategory}</span>
          </>
        )}
        {index > 0 && (
          <span style={{
            fontFamily: 'var(--font-subheading)',
            fontSize: '0.75rem',
            color: 'rgba(0,0,0,0.35)',
            fontStyle: 'italic',
          }}>View {index + 1}</span>
        )}
      </div>
    );
  };

  // Render thumbnail for the strip
  const renderThumb = (index) => {
    const src = images[index];
    const hasFailed = failedImages.has(index);

    if (src && !hasFailed) {
      return (
        <Image
          src={src}
          alt={`${product.name} thumb ${index + 1}`}
          fill
          sizes="48px"
          style={{ objectFit: 'cover' }}
          onError={() => handleImageError(index)}
          draggable={false}
        />
      );
    }

    return (
      <div style={{
        width: '100%',
        height: '100%',
        background: getPlaceholderGradient(product.id, index),
      }} />
    );
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="product-card"
      id={`product-${product.id}`}
      ref={cardRef}
      onMouseEnter={handleCardEnter}
      onMouseLeave={handleCardLeave}
    >
      <div className="product-card-image">
        {product.badge && <span className="product-card-badge">{product.badge}</span>}

        {/* Stacked images — all rendered, only active one is visible */}
        <div className="product-card-image-stack">
          {images.length > 0 ? (
            images.map((_, i) => (
              <div
                key={i}
                className={`product-card-layer ${i === activeIndex ? 'active' : ''}`}
              >
                {renderImage(i, 'product-card-layer-img')}
              </div>
            ))
          ) : (
            /* No images at all — single placeholder */
            <div className="product-card-layer active">
              {renderImage(0, 'product-card-layer-img')}
            </div>
          )}
        </div>

        <button
          className="product-card-quick-add"
          onClick={handleQuickAdd}
        >
          Quick Add
        </button>
      </div>

      {/* Thumbnail strip */}
      {hasMultipleImages && (
        <div className="product-card-thumbs">
          {images.map((_, i) => (
            <div
              key={i}
              className={`product-card-thumb ${i === activeIndex ? 'active' : ''}`}
              onMouseEnter={() => handleThumbHover(i)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveIndex(i);
              }}
            >
              {renderThumb(i)}
            </div>
          ))}
        </div>
      )}

      <div className="product-card-info">
        <div className="product-card-brand">{product.brand}</div>
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">
          ₹{product.price.toLocaleString()}
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
