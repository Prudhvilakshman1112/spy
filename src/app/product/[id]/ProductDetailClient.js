'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState, useCallback, useRef } from 'react';
import ProductCard from '@/components/ProductCard';

// ── Colour name → CSS value lookup ──────────────────────────────────────────
const COLOR_CSS = {
  'black':       '#1A1A1A',
  'navy':        '#1B3A6B',
  'white':       '#F0F0F0',
  'red':         '#C41230',
  'blue':        '#2563EB',
  'charcoal':    '#4A4A4A',
  'indigo':      '#3B3B8C',
  'dark indigo': '#1E1B6B',
  'medium blue': '#4A78C4',
  'mint':        '#98D4C4',
  'peach':       '#FFCBA4',
  'sky blue':    '#87CEEB',
  'light blue':  '#93C5FD',
  'pink':        '#F9A8D4',
  'grey':        '#9CA3AF',
  'gray':        '#9CA3AF',
  'green':       '#16A34A',
  'cream':       '#FFF8DC',
  'washed blue': '#6B9EC5',
  'multi':       'linear-gradient(135deg,#C41230,#F59E0B,#2563EB,#16A34A)',
};

function getColorCss(name) {
  const key = name.toLowerCase().split('/')[0].trim();
  return COLOR_CSS[key] || COLOR_CSS[name.toLowerCase()] || '#888';
}

function getPlaceholderGradient(id, index = 0) {
  const hash = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = (hash + index * 47) % 360;
  const hue2 = (hash * 7 + index * 31) % 360;
  return `linear-gradient(${135 + index * 45}deg, hsl(${hue1}, 25%, 85%) 0%, hsl(${hue2}, 20%, 75%) 100%)`;
}

// Short label for colour name
function shortName(name) {
  if (name.length <= 8) return name;
  const first = name.split('/')[0].trim();
  return first.length <= 8 ? first : first.slice(0, 7) + '…';
}

export default function ProductDetailClient({ product, relatedProducts }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const touchStartX = useRef(null);

  const images = product.images || [];
  const hasImages = images.length > 0;
  const colorImages = product.colorImages || {};
  const colors = product.colors || [];

  // Only colours that have a real mapped image are shown as thumbs
  const colorEntries = colors
    .map(c => ({ color: c, idx: colorImages[c] }))
    .filter(e => e.idx !== undefined && images[e.idx]);

  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => { const n = new Set(prev); n.add(index); return n; });
  }, []);

  const handleImageError = useCallback((index) => {
    setLoadedImages(prev => { const n = new Set(prev); n.delete(index); return n; });
  }, []);

  const goTo = useCallback((idx) => {
    setActiveImageIndex(Math.max(0, Math.min(idx, images.length - 1)));
  }, [images.length]);

  const goPrev = () => setActiveImageIndex(p => (p === 0 ? images.length - 1 : p - 1));
  const goNext = () => setActiveImageIndex(p => (p === images.length - 1 ? 0 : p + 1));

  // Touch swipe on hero
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  // Colour thumbnail click: only jump to image — does NOT set selected colour for ordering
  const handleThumbClick = (color) => {
    const idx = colorImages[color];
    if (idx !== undefined) goTo(idx);
  };

  const handleAddToCart = () => {
    addItem(
      product,
      selectedSize || product.sizes?.[0] || 'One Size',
      selectedColor || product.colors?.[0] || ''
    );
  };

  const imageIndices = hasImages ? images.map((_, i) => i) : [0, 1, 2];

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
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: getPlaceholderGradient(product.id, index + 10), opacity: 0.5 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(0,0,0,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {product.subcategory}
          </span>
        </div>
        {src && (
          <Image
            src={src}
            alt={`${product.name} - View ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{ objectFit: 'cover', opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
            draggable={false}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <section className="product-detail" id="product-detail">
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px', fontSize: '0.8rem', color: 'var(--color-gray-300)', fontFamily: 'var(--font-body)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            {' / '}
            <Link href={`/${product.category}`} style={{ color: 'inherit', textTransform: 'capitalize' }}>{product.category}</Link>
            {' / '}
            <span style={{ color: 'var(--color-charcoal)' }}>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            {/* ── Gallery column ─────────────────────────────────────────── */}
            <div className="product-gallery">
              {/* Hero image */}
              <div
                className="product-gallery-main"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {imageIndices.map(i => (
                  <div key={i} className={`product-gallery-layer ${i === activeImageIndex ? 'active' : ''}`}>
                    {renderGalleryImage(i)}
                  </div>
                ))}

                {/* Arrows */}
                {images.length > 1 && (
                  <>
                    <button className="pd-arrow pd-arrow--left" onClick={goPrev} aria-label="Previous image">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button className="pd-arrow pd-arrow--right" onClick={goNext} aria-label="Next image">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </>
                )}
              </div>

              {/* Dot navigation */}
              {images.length > 1 && (
                <div className="pd-dots">
                  {imageIndices.map(i => (
                    <button
                      key={i}
                      className={`pd-dot ${i === activeImageIndex ? 'active' : ''}`}
                      onClick={() => goTo(i)}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Colour image thumbnail row — for image browsing only, does NOT select colour for order */}
              {colorEntries.length > 0 && (
                <div className="pd-color-thumbs">
                  <div className="pd-color-label">BROWSE BY COLOUR</div>
                  <div className="pd-color-thumb-row">
                    {colorEntries.map(({ color, idx }) => {
                      const isActive = activeImageIndex === idx;
                      const src = images[idx];
                      return (
                        <button
                          key={color}
                          className={`pd-color-thumb-btn ${isActive ? 'active' : ''}`}
                          onClick={() => handleThumbClick(color)}
                          title={`View ${color} image`}
                        >
                          <div className="pd-color-thumb-img">
                            {src && (
                              <Image
                                src={src}
                                alt={color}
                                fill
                                sizes="72px"
                                style={{ objectFit: 'cover' }}
                                draggable={false}
                              />
                            )}
                          </div>
                          <span className="pd-color-thumb-label">{shortName(color)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── Info column ────────────────────────────────────────────── */}
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
                  <span style={{ color: 'var(--color-gray-300)', textDecoration: 'line-through', fontSize: '1.1rem', marginLeft: '12px' }}>
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <span style={{ color: '#27AE60', fontSize: '0.9rem', marginLeft: '12px', fontFamily: 'var(--font-body)' }}>
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

              {/* Colour selector — customer must explicitly pick a colour for the order */}
              {colors.length > 0 && (
                <div className="product-sizes" style={{ marginTop: '0' }}>
                  <label>SELECT COLOUR{selectedColor ? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '8px', color: 'var(--color-charcoal)', fontSize: '0.8rem' }}>— {selectedColor}</span> : null}</label>
                  <div className="size-options pd-color-swatch-row">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`pd-color-swatch ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        aria-label={`Select colour ${color}`}
                      >
                        <span
                          className="pd-color-swatch-dot"
                          style={{ background: getColorCss(color) }}
                        />
                        <span className="pd-color-swatch-name">{color}</span>
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
                href={`https://wa.me/918074548419?text=Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString()})${selectedColor ? ` in ${selectedColor}` : ''}${selectedSize ? `, Size ${selectedSize}` : ''}`}
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
