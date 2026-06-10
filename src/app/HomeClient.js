'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

/* ── Hero Slides — real store images ── */
const HERO_SLIDES = [
  { image: '/images/banners/hero-1.png', title: 'NEW ARRIVALS', subtitle: 'PREMIUM | CURATED | STYLE', tag: 'BESTSELLER' },
  { image: '/images/banners/hero-2.png', title: 'GRAPHIC TEES', subtitle: 'OVERSIZED | VINTAGE | STREETWEAR', tag: 'NEW DROP' },
  { image: '/images/banners/hero-3.png', title: 'FLORAL SHIRTS', subtitle: 'PASTEL | PRINTED | SUMMER', tag: 'TRENDING' },
  { image: '/images/banners/hero-4.png', title: 'BARREL FIT DENIM', subtitle: 'KOREAN | BAGGY | PREMIUM', tag: "SUMMER'26" },
  { image: '/images/banners/hero-5.png', title: 'STREETWEAR', subtitle: 'KOREAN FIT | OVERSIZED | DROP', tag: 'NEW' },
];

/* ── Category Cards — AI generated product images ── */
const CATEGORIES = [
  { name: 'T-SHIRTS', slug: 't-shirts', image: '/products/instagram/tshirts/1.png' },
  { name: 'FLORAL SHIRTS', slug: 'floral-shirts', image: '/products/instagram/floral-shirts/1.png' },
  { name: 'CHECK SHIRTS', slug: 'check-shirts', image: '/products/instagram/check-shirts/1.png' },
  { name: 'BARREL FIT', slug: 'barrel-fit', image: '/products/instagram/barrel-fit/1.png' },
  { name: 'LINEN SHIRTS', slug: 'linen-shirts', image: '/products/instagram/linen-shirts/1.png' },
  { name: 'SWEATSHIRTS', slug: 'sweatshirts', image: '/products/instagram/sweatshirts/1.png' },
];

/* ── Collection Cards — AI generated product images ── */
const COLLECTIONS = [
  { name: 'ZIPPER SHIRTS', slug: 'zipper-shirts', image: '/products/instagram/zipper-shirts/1.png' },
  { name: 'KOREAN STYLE', slug: 'barrel-fit', image: '/products/instagram/barrel-fit/2.png' },
  { name: 'DENIM BAGGYS', slug: 'denim-baggys', image: '/products/instagram/denim-baggys/1.png' },
  { name: 'SPY PICKS', slug: 't-shirts', image: '/products/instagram/tshirts/2.png' },
  { name: 'BEACH LINEN', slug: 'linen-shirts', image: '/products/instagram/linen-shirts/2.png' },
  { name: 'STREET STYLE', slug: 'sweatshirts', image: '/products/instagram/sweatshirts/2.png' },
];

/* ── Filter tabs for catalog ── */
const FILTER_TABS = [
  { slug: '', label: 'Trending' },
  { slug: 't-shirts', label: 'T-Shirts' },
  { slug: 'floral-shirts', label: 'Floral Shirts' },
  { slug: 'barrel-fit', label: 'Barrel Fit' },
  { slug: 'check-shirts', label: 'Check Shirts' },
];

/* ══════════════════════════════════════════════
   Hero Carousel Component
   ══════════════════════════════════════════════ */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  // Removed auto-sliding per user request

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0
        ? setCurrent(p => (p + 1) % HERO_SLIDES.length)
        : setCurrent(p => (p === 0 ? HERO_SLIDES.length - 1 : p - 1));
    }
    touchStartX.current = null;
  };

  return (
    <div className="hero-carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ touchAction: 'pan-y' }}>
      <div className="hero-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {HERO_SLIDES.map((slide, i) => (
          <div className="hero-carousel-slide" key={i}>
            <div className="hero-carousel-image">
              <Image src={slide.image} alt={slide.title} fill sizes="(max-width: 768px) 100vw, 50vw" priority={i === 0}
                style={{ objectFit: 'cover' }} draggable={false} />
            </div>
            <div className="hero-carousel-overlay">
              <div className="hero-carousel-text">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
              </div>
              {slide.tag && (
                <div className="hero-carousel-tag">{slide.tag}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="hero-carousel-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Feature Bar (Trust Badges)
   ══════════════════════════════════════════════ */
function FeatureBar() {
  return (
    <div className="feature-bar">
      <div className="feature-bar-item">
        <span className="feature-bar-icon">💰</span>
        <div className="feature-bar-text">
          <strong>10% Discount</strong>
          <span>on All Orders</span>
        </div>
      </div>
      <div className="feature-bar-item">
        <span className="feature-bar-icon">🏪</span>
        <div className="feature-bar-text">
          <strong>Visit Our Store</strong>
          <span>Vizag, AP</span>
        </div>
      </div>
      <div className="feature-bar-item">
        <span className="feature-bar-icon">💬</span>
        <div className="feature-bar-text">
          <strong>WhatsApp</strong>
          <span>to Order</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Horizontal Scroll Carousel with Dots
   ══════════════════════════════════════════════ */
function ScrollCarousel({ items, renderItem, itemWidth = 'calc(50% - 6px)' }) {
  const scrollRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const totalPages = Math.ceil(items.length / 2);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const page = Math.round(scrollLeft / (scrollWidth - clientWidth) * (totalPages - 1));
    setActiveDot(Math.min(page, totalPages - 1));
  }, [totalPages]);

  return (
    <div className="scroll-carousel">
      <div className="scroll-carousel-track" ref={scrollRef} onScroll={handleScroll}>
        {items.map((item, i) => (
          <div key={i} className="scroll-carousel-item" style={{ minWidth: itemWidth, maxWidth: itemWidth }}>
            {renderItem(item, i)}
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="scroll-carousel-dots">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`carousel-dot ${i === activeDot ? 'active' : ''}`}
              aria-label={`Page ${i + 1}`}
              onClick={() => {
                if (!scrollRef.current) return;
                const { scrollWidth, clientWidth } = scrollRef.current;
                scrollRef.current.scrollTo({
                  left: (scrollWidth - clientWidth) * (i / (totalPages - 1)),
                  behavior: 'smooth',
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   Trending Product Card (for Trending in Pants)
   ══════════════════════════════════════════════ */
function TrendingCard({ product, labels }) {
  return (
    <Link href={`/product/${product.id}`} className="trending-card">
      <div className="trending-card-header">
        <strong>{labels.title}</strong>
      </div>
      <div className="trending-card-image">
        <Image src={product.images[0]} alt={product.name} fill sizes="50vw"
          style={{ objectFit: 'contain' }} />
        {labels.corners && labels.corners.map((corner, i) => (
          <span key={i} className={`trending-corner trending-corner-${i}`}>{corner}</span>
        ))}
      </div>
      <div className="trending-card-info">
        <div className="trending-card-name">{product.name}</div>
        <div className="trending-card-sub">{labels.subtitle}</div>
        <div className="trending-card-price">₹ {product.price.toLocaleString()}</div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════
   Main Home Client
   ══════════════════════════════════════════════ */
export default function HomeClient({ featured, newArrivals, allProducts }) {
  const [catalogFilter, setCatalogFilter] = useState('');

  const catalogProducts = catalogFilter
    ? allProducts.filter(p => p.subcategory === catalogFilter)
    : featured.length > 0 ? featured : allProducts.slice(0, 8);

  // Get specific products for trending section
  const barrelFitProducts = allProducts.filter(p => p.subcategory === 'barrel-fit');
  const denimBaggyProducts = allProducts.filter(p => p.subcategory === 'denim-baggys');
  const trendingBottoms = [...barrelFitProducts, ...denimBaggyProducts];
  const easyPants = barrelFitProducts[0] || allProducts[0];
  const gurkhaPants = denimBaggyProducts[0] || barrelFitProducts[1] || allProducts[1];

  return (
    <>
      {/* ═══ HERO CAROUSEL ═══ */}
      <HeroCarousel />

      {/* ═══ FEATURE BAR ═══ */}
      <FeatureBar />

      {/* ═══ LATEST DROPS BANNER ═══ */}
      <section className="section-block" id="latest-drops">
        <div className="container">
          <h2 className="section-heading">LATEST DROPS</h2>
          <Link href="/clothing?filter=new" className="latest-drops-banner">
            <Image src="/images/banners/latest-drops.png" alt="Latest Drops"
              fill sizes="100vw" style={{ objectFit: 'cover' }} />
            <div className="latest-drops-overlay">
              <span className="latest-drops-tag">JUST DROPPED</span>
              <h3>NEW COLLECTION 2026</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══ NEW ARRIVALS ═══ */}
      <section className="section-block" id="new-arrivals">
        <div className="container">
          <h2 className="section-heading">NEW ARRIVALS</h2>
          <ScrollCarousel
            items={newArrivals.length > 0 ? newArrivals : allProducts.slice(0, 8)}
            renderItem={(product) => <ProductCard product={product} compact />}
          />
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section-block" id="categories">
        <div className="container">
          <h2 className="section-heading">CATEGORIES</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={`/clothing?subcategory=${cat.slug}`} className="category-card">
                <div className="category-card-img">
                  <Image src={cat.image} alt={cat.name} fill sizes="33vw"
                    style={{ objectFit: 'cover' }} />
                </div>
                <span className="category-card-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRENDING IN BAGGYS ═══ */}
      {easyPants && gurkhaPants && (
        <section className="section-block" id="trending-pants">
          <div className="container">
            <h2 className="section-heading">TRENDING IN BAGGYS</h2>
            <div className="trending-grid">
              <TrendingCard
                product={easyPants}
                labels={{
                  title: 'BARREL FIT BAGGYS',
                  subtitle: 'Barrel Fit',
                  corners: ['KOREAN FIT', 'PREMIUM FABRIC'],
                }}
              />
              <TrendingCard
                product={gurkhaPants}
                labels={{
                  title: 'DENIM BAGGYS',
                  subtitle: 'Denim Baggy',
                  corners: ['BAGGY FIT', 'PREMIUM DENIM'],
                }}
              />
            </div>
            <ScrollCarousel
              items={trendingBottoms.length > 2 ? trendingBottoms : allProducts.filter(p => ['barrel-fit', 'denim-baggys', 'jeans'].includes(p.subcategory))}
              renderItem={(product) => <ProductCard product={product} compact />}
            />
          </div>
        </section>
      )}

      {/* ═══ CURATED FOR YOU ═══ */}
      <section className="section-block" id="curated">
        <div className="container">
          <h2 className="section-heading">CURATED FOR YOU</h2>
        <div className="collections-grid">
            {COLLECTIONS.map(col => (
              <Link key={col.name} href={col.slug ? `/clothing?subcategory=${col.slug}` : '/clothing'} className="collection-card">
                <div className="collection-card-img">
                  <Image src={col.image} alt={col.name} fill sizes="33vw"
                    style={{ objectFit: 'cover' }} />
                  <div className="collection-card-overlay">
                    <span className="collection-card-name">{col.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ALL PRODUCTS CATALOG ═══ */}
      <section className="section-block section-block--grey" id="catalog">
        <div className="container">
          {/* Filter Pills */}
          <div className="filter-chips">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.slug}
                className={`filter-chip ${catalogFilter === tab.slug ? 'active' : ''}`}
                onClick={() => setCatalogFilter(tab.slug)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Product Grid */}
          <div className="products-grid">
            {catalogProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
