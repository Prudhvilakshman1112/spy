'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { useAtmosphere } from '@/context/AtmosphereContext';

export default function AccessoriesClient({ menWatches, womenWatches, bags }) {
  const { setCurrentAtmosphere } = useAtmosphere();

  useEffect(() => {
    setCurrentAtmosphere('accessories');
  }, [setCurrentAtmosphere]);

  return (
    <>
      {/* Hero */}
      <section className="category-hero" id="accessories-hero" style={{ background: '#0D0D0D' }}>
        <div className="category-hero-bg" style={{
          background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #B8860B 100%)',
        }} />
        <div className="category-hero-content">
          <h1 style={{ color: '#FAFAFA' }}>ACCESSORIES &amp; WATCHES</h1>
          <p style={{ color: '#B8860B' }}>Precision. Luxury. Statement.</p>
        </div>
      </section>

      {/* Watch Showcase */}
      <section className="accessories-hero" id="watch-showcase">
        <div className="container">
          <div className="watch-showcase">
            <div className="watch-showcase-image" style={{ position: 'relative' }}>
              <Image
                src="/images/watch-showcase.png"
                alt="Luxury timepiece showcase"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="watch-showcase-content">
              <h2>TIMEPIECES OF <span style={{ color: '#B8860B' }}>DISTINCTION</span></h2>
              <p>
                From intricate skeleton dials that reveal the beating heart of mechanical 
                precision to bold chronographs built for the modern man — our curated 
                watch collection speaks volumes without saying a word.
              </p>
              <p style={{ marginTop: '16px' }}>
                Each piece is selected for its craftsmanship, presence, and the unmistakable 
                feeling of wearing something extraordinary on your wrist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Men's Watches Grid */}
      <section style={{ padding: '60px 0', background: '#0D0D0D' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: '#B8860B' }}>MEN&apos;S WATCHES</h2>
          <div className="products-grid" style={{ marginTop: '32px' }}>
            {menWatches.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Women's Watches Grid */}
      {womenWatches.length > 0 && (
        <section style={{ padding: '60px 0', background: '#111' }}>
          <div className="container">
            <h2 className="section-title" style={{ color: '#E84393' }}>WOMEN&apos;S WATCHES</h2>
            <div className="products-grid" style={{ marginTop: '32px' }}>
              {womenWatches.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bags Section */}
      {bags.length > 0 && (
        <section style={{ padding: '80px 0', background: '#0A0A0A' }}>
          <div className="container">
            <h2 className="section-title" style={{ color: '#FAFAFA' }}>PREMIUM BAGS</h2>
            <div className="products-grid" style={{ marginTop: '32px' }}>
              {bags.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
