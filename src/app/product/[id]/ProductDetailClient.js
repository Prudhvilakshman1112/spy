'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState, useRef } from 'react';
import ProductCard from '@/components/ProductCard';

const OWNER_PHONE = '918756799899';

export default function ProductDetailClient({ product, relatedProducts }) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef(null);

  const images = product.images || [];
  const hasImages = images.length > 0;

  const goPrev = () => setActiveImageIndex(p => (p === 0 ? images.length - 1 : p - 1));
  const goNext = () => setActiveImageIndex(p => (p === images.length - 1 ? 0 : p + 1));

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  const handleAddToCart = () => {
    addItem(
      product,
      selectedSize || product.sizes?.[0] || 'One Size',
      selectedColor || product.colors?.[0] || ''
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  const whatsappText = `Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString()})${selectedColor ? ` in ${selectedColor}` : ''}${selectedSize ? `, Size ${selectedSize}` : ''}`;

  return (
    <>
      <section className="product-detail" id="product-detail">
        {/* Back button */}
        <div className="pd-back-bar">
          <Link href="/" className="pd-back-btn" aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
        </div>

        {/* ── Desktop Split Wrapper ── */}
        <div className="pd-desktop-split">
          {/* ── Image Carousel ── */}
          <div
          className="pd-gallery"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="pd-gallery-track" style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}>
            {hasImages ? images.map((src, i) => (
              <div className="pd-gallery-slide" key={i}>
                <Image
                  src={src}
                  alt={`${product.name} - ${i + 1}`}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover' }}
                  priority={i === 0}
                />
              </div>
            )) : (
              <div className="pd-gallery-slide">
                <div className="pd-gallery-placeholder">
                  <span>{product.subcategory}</span>
                </div>
              </div>
            )}
          </div>

          {/* Fit badge on image */}
          {product.fit && (
            <span className="pd-fit-badge">{product.fit.toUpperCase()}</span>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button className="pd-arrow pd-arrow--left" onClick={goPrev} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="pd-arrow pd-arrow--right" onClick={goNext} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="pd-dots">
            {images.map((_, i) => (
              <button key={i}
                className={`pd-dot ${i === activeImageIndex ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* ── Product Info ── */}
        <div className="pd-info">
          <div className="pd-info-header">
            <div>
              <h1 className="pd-name">{product.name}</h1>
              <div className="pd-category">
                {product.subcategory ? product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1).replace(/-/g, ' ') : product.brand}
              </div>
            </div>
            <button className="pd-share" onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              SHARE
            </button>
          </div>

          <div className="pd-price">
            <span className="pd-price-current">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="pd-price-original">₹{product.originalPrice.toLocaleString()}</span>
                <span className="pd-price-off">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {product.description && (
            <p className="pd-desc">{product.description}</p>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes[0] !== 'One Size' && (
            <div className="pd-selector">
              <label className="pd-selector-label">SELECT SIZE</label>
              <div className="pd-selector-options">
                {product.sizes.map(size => (
                  <button key={size}
                    className={`pd-size-btn ${selectedSize === size ? 'selected' : ''}`}
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
            <div className="pd-selector">
              <label className="pd-selector-label">
                SELECT COLOUR
                {selectedColor && <span className="pd-selector-value"> — {selectedColor}</span>}
              </label>
              <div className="pd-selector-options">
                {product.colors.map(color => (
                  <button key={color}
                    className={`pd-color-btn ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Enquiry */}
          <a
            href={`https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(whatsappText)}`}
            target="_blank" rel="noopener noreferrer"
            className="pd-whatsapp-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            ENQUIRE ON WHATSAPP
          </a>

          {/* ── Desktop/Mobile Action Bar ── */}
          <div className="pd-bottom-bar">
            <button
              className={`pd-bottom-wishlist ${wishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24"
                fill={wishlisted ? '#FF6B1A' : 'none'}
                stroke={wishlisted ? '#FF6B1A' : 'currentColor'}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              WISHLIST
            </button>
            <button className="pd-bottom-cart" onClick={handleAddToCart} id="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pd-related">
            <div className="container">
              <h2 className="section-heading">YOU MAY ALSO LIKE</h2>
              <div className="products-grid">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Bottom bar moved inside info for desktop, but still fixed for mobile via CSS */}
    </>
  );
}
