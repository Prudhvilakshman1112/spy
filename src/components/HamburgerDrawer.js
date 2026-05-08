'use client';

import Link from 'next/link';
import Image from 'next/image';

const SUBCATEGORIES = [
  { name: 'T-Shirts', slug: 't-shirts' },
  { name: 'Shirts', slug: 'shirts' },
  { name: 'Polos', slug: 'polos' },
  { name: 'Jeans', slug: 'jeans' },
  { name: 'Pants', slug: 'pants' },
  { name: 'Joggers', slug: 'joggers' },
  { name: 'Shorts', slug: 'shorts' },
  { name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
];

export default function HamburgerDrawer({ isOpen, onClose }) {
  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <nav className={`drawer drawer--left ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <Image src="/images/cult-logo.png" alt="Cult Clothing" width={100} height={36}
            style={{ objectFit: 'contain' }} />
          <button className="drawer-close" onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="nav-drawer-links">
          <Link href="/" className="nav-drawer-link" onClick={onClose}>Home</Link>
          <Link href="/clothing" className="nav-drawer-link" onClick={onClose}>Shop All</Link>
          <Link href="/clothing?filter=new" className="nav-drawer-link" onClick={onClose}>New Arrivals</Link>
          <Link href="/clothing?filter=trending" className="nav-drawer-link" onClick={onClose}>Trending</Link>
        </div>

        <div className="nav-drawer-divider" />
        <div className="nav-drawer-section-title">Categories</div>
        <div className="nav-drawer-links">
          {SUBCATEGORIES.map(sub => (
            <Link
              key={sub.slug}
              href={`/clothing?subcategory=${sub.slug}`}
              className="nav-drawer-sub-link"
              onClick={onClose}
            >
              {sub.name}
            </Link>
          ))}
        </div>

        <div className="nav-drawer-footer">
          <a href="/contact" onClick={onClose}>Contact</a>
          <a href="https://instagram.com/cult.vizag" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://wa.me/919951565569" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>
      </nav>
    </>
  );
}
