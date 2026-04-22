'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';

function getPlaceholderGradient(id, index = 0) {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = (hash + index * 47) % 360;
  const hue2 = (hash * 7 + index * 31) % 360;
  return `linear-gradient(${135 + index * 45}deg, hsl(${hue1}, 25%, 85%) 0%, hsl(${hue2}, 20%, 75%) 100%)`;
}

export default function ProductDetailClient({ product, relatedProducts }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const images = product.images || [];
  const hasImages = images.length > 0;

  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const handleImageError = useCallback((index) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);

  const handleAddToCart = () => {
    addItem(
      product,
      selectedSize || product.sizes?.[0] || 'One Size',
      selectedColor || product.colors?.[0] || ''
    );
  };

  const renderGalleryImage = (index) => {
    const src = images[index];
    const isLoaded = loadedImages.has(index);

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: getPlaceholderGradient(product.id, index),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '12px',
          opacity: isLoaded ? 0 : 1, transition: 'opacity 0.3s ease',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: getPlaceholderGradient(product.id, index + 10), opacity: 0.5,
          }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            color: 'rgba(0,0,0,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>{product.subcategory}</span>
        </div>
        {src && (
          <Image
            src={src}
            alt={`${product.name} - View ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{
              objectFit: 'cover',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            draggable={false}
          />
        )}
      </div>
    );
  };

  const renderThumb = (index) => {
    const src = images[index];
    const isLoaded = loadedImages.has(index);

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: getPlaceholderGradient(product.id, index),
          opacity: isLoaded ? 0 : 1, transition: 'opacity 0.3s ease',
        }} />
        {src && (
          <Image
            src={src}
            alt={`${product.name} thumb ${index + 1}`}
            fill
            sizes="80px"
            style={{
              objectFit: 'cover',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            draggable={false}
          />
        )}
      </div>
    );
  };

  const imageIndices = hasImages ? images.map((_, i) => i) : [0, 1, 2];

  return (
    <>
      <section className="product-detail" id="product-detail">
        <div className="container">
          {/* Breadcrumb */}
          <div style={{
            marginBottom: '24px', fontSize: '0.8rem',
            color: 'var(--color-gray-300)', fontFamily: 'var(--font-body)',
          }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            {' / '}
            <Link href={`/${product.category}`} style={{ color: 'inherit', textTransform: 'capitalize' }}>
              {product.category}
            </Link>
            {' / '}
            <span style={{ color: 'var(--color-charcoal)' }}>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            {/* Gallery */}
            <div className="product-gallery">
              <div className="product-gallery-main">
                {imageIndices.map(i => (
                  <div key={i} className={`product-gallery-layer ${i === activeImageIndex ? 'active' : ''}`}>
                    {renderGalleryImage(i)}
                  </div>
                ))}
              </div>
              <div className="product-gallery-thumbs">
                {imageIndices.map(i => (
                  <div key={i}
                    className={`product-gallery-thumb ${i === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(i)}
                    onMouseEnter={() => setActiveImageIndex(i)}
                  >
                    {renderThumb(i)}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="product-info">
              {product.badge && (
                <span style={{
                  display: 'inline-block', background: 'var(--color-crimson)', color: '#fff',
                  fontFamily: 'var(--font-heading)', fontSize: '0.7rem',
                  letterSpacing: '0.1em', padding: '4px 14px', marginBottom: '12px',
                }}>
                  {product.badge}
                </span>
              )}
              <div className="product-info-brand">{product.brand}</div>
              <h1>{product.name}</h1>
              <div className="product-info-price">
                ₹{product.price.toLocaleString()}
                {product.originalPrice && (
                  <span style={{
                    color: 'var(--color-gray-300)', textDecoration: 'line-through',
                    fontSize: '1.1rem', marginLeft: '12px',
                  }}>
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <span style={{
                    color: '#27AE60', fontSize: '0.9rem', marginLeft: '12px',
                    fontFamily: 'var(--font-body)',
                  }}>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              <p className="product-info-desc">{product.description}</p>

              {/* Sizes */}
              {product.sizes && product.sizes[0] !== 'One Size' && (
                <div className="product-sizes">
                  <label>SELECT SIZE</label>
                  <div className="size-options">
                    {product.sizes.map(size => (
                      <button key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block', fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem', letterSpacing: '0.15em', marginBottom: '8px',
                  }}>COLOR</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.colors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)}
                        style={{
                          padding: '8px 16px',
                          border: selectedColor === color ? '2px solid var(--color-crimson)' : '1px solid var(--color-gray-200)',
                          background: selectedColor === color ? 'rgba(196,18,48,0.05)' : 'transparent',
                          fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn-magnetic" onClick={handleAddToCart}
                style={{ width: '100%', marginBottom: '12px' }} id="add-to-cart-btn">
                ADD TO BAG — ₹{product.price.toLocaleString()}
              </button>

              <a
                href={`https://wa.me/918074548419?text=Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString()})`}
                target="_blank" rel="noopener noreferrer"
                className="btn-magnetic btn-magnetic--dark"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                ENQUIRE ON WHATSAPP
              </a>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div style={{ marginTop: '80px' }}>
              <h2 className="section-title">YOU MAY ALSO LIKE</h2>
              <div className="products-grid" style={{ marginTop: '32px' }}>
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
