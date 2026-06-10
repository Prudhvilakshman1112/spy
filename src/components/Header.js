'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import HamburgerDrawer from '@/components/HamburgerDrawer';

export default function Header({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { wishlistIds, setIsOpen: setWishlistOpen } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="header-inner">
          {/* Left: Hamburger */}
          <div className="header-left">
            <button className="hamburger-btn" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="header-logo" id="brand-logo">
            <Image src="/images/spy-logo.png" alt="SPY Multibrand Stores" width={140} height={50}
              style={{ objectFit: 'contain' }} priority />
          </Link>

          {/* Right: Search, Wishlist, Cart */}
          <div className="header-actions">
            <button className="header-action-btn" onClick={onSearchOpen} aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button className="header-action-btn" onClick={() => setWishlistOpen(true)} aria-label="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistIds.length > 0 && <span className="header-badge">{wishlistIds.length}</span>}
            </button>
            <button className="header-action-btn" onClick={() => setCartOpen(true)} aria-label="Cart" id="cart-button">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && <span className="header-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      <HamburgerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
