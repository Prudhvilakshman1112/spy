'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import SearchOverlay from '@/components/SearchOverlay';
import IntroSplash from '@/components/IntroSplash';

export default function LayoutClient() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <IntroSplash />
      <Header onSearchOpen={openSearch} />
      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}
