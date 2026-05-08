'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import SearchOverlay from '@/components/SearchOverlay';

export default function LayoutClient() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <Header onSearchOpen={openSearch} />
      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}
