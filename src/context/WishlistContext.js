'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'spy-wishlist';

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setWishlistIds(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  const addToWishlist = useCallback((id) => {
    setWishlistIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlistIds(prev => prev.filter(x => x !== id));
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlistIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const isWishlisted = useCallback((id) => {
    return wishlistIds.includes(id);
  }, [wishlistIds]);

  return (
    <WishlistContext.Provider value={{
      wishlistIds, isOpen, setIsOpen,
      addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
