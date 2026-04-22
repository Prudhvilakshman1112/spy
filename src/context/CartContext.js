'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { computeCartTotals } from '@/lib/discounts';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, size, color) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { ...product, size, color, quantity: 1, cartId: Date.now() }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartId) => {
    setItems(prev => prev.filter(item => item.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.cartId !== cartId));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  }, []);

  // Compute all totals (with category discounts) whenever items change
  const cartTotals = useMemo(() => computeCartTotals(items), [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Keep `subtotal` as the original (pre-discount) total for backward compat
  const subtotal = cartTotals.originalTotal;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        totalItems,
        subtotal,
        // Discount-aware totals
        originalTotal: cartTotals.originalTotal,
        savingsByCategory: cartTotals.savingsByCategory,
        totalSavings: cartTotals.totalSavings,
        finalTotal: cartTotals.finalTotal,
        itemBreakdown: cartTotals.itemBreakdown,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
