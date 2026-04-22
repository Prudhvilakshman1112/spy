'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { buildWhatsAppMessage } from '@/lib/discounts';

const OWNER_PHONE = '918074548419';

const CATEGORY_DISCOUNT_LABELS = {
  clothing: 'Clothing (10% off)',
  footwear: 'Footwear (20% off)',
  accessories: 'Accessories (30% off)',
};

function fmt(n) {
  return Math.round(n).toLocaleString('en-IN');
}

/** Shows the first product image; falls back to a styled text placeholder. */
function CartItemImage({ item }) {
  const [failed, setFailed] = useState(false);
  const src = item.images?.[0];

  if (src && !failed) {
    return (
      <div className="cart-item-image">
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src={src}
            alt={item.name}
            fill
            sizes="80px"
            style={{ objectFit: 'cover' }}
            onError={() => setFailed(true)}
          />
        </div>
      </div>
    );
  }

  // Fallback — category-coloured tile with initials
  const colours = {
    clothing: '#1a1014',
    footwear: '#0f1320',
    accessories: '#12101a',
  };
  const bg = colours[item.category] || '#1a1a1a';
  const initials = item.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="cart-item-image" style={{ background: bg }}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '4px',
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.4rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.05em',
        }}>{initials}</span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.5rem',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>{item.subcategory || item.category}</span>
      </div>
    </div>
  );
}


export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    itemBreakdown,
    originalTotal,
    savingsByCategory,
    totalSavings,
    finalTotal,
  } = useCart();

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const handleWhatsApp = () => {
    const totals = { originalTotal, savingsByCategory, totalSavings, finalTotal };
    const message = buildWhatsAppMessage(itemBreakdown, totals);
    const url = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} id="cart-drawer">
        <div className="cart-drawer-header">
          <h3>YOUR BAG ({totalQty})</h3>
          <button
            className="cart-drawer-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p>Your bag is empty</p>
          </div>
        ) : (
          <>
            {/* ── Items ── */}
            <div className="cart-drawer-items">
              {itemBreakdown.map(item => (
                <div className="cart-item" key={item.cartId}>
                  <CartItemImage item={item} />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '2px' }}>
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` | ${item.color}`}
                    </div>

                    {/* Price with discount */}
                    <div className="cart-item-price-row">
                      {item.rate > 0 ? (
                        <>
                          <span className="cart-item-price-original">₹{fmt(item.price)}</span>
                          <span className="cart-item-price-discounted">
                            ₹{fmt(item.price * (1 - item.rate))}
                          </span>
                          <span className="cart-item-discount-badge">
                            {Math.round(item.rate * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="cart-item-price">₹{fmt(item.price)}</span>
                      )}
                    </div>

                    {item.quantity > 1 && (
                      <div className="cart-item-line-total">
                        Line total: ₹{fmt(item.discountedLineTotal)}
                        {item.saving > 0 && (
                          <span className="cart-item-line-saving"> (save ₹{fmt(item.saving)})</span>
                        )}
                      </div>
                    )}

                    <div className="cart-item-qty">
                      <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.cartId)}
                      style={{ marginTop: '4px' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Bill Breakdown ── */}
            <div className="cart-drawer-footer">
              <div className="cart-bill">
                <div className="cart-bill-row cart-bill-original">
                  <span>Original Total</span>
                  <span>₹{fmt(originalTotal)}</span>
                </div>

                {/* Per-category savings */}
                {Object.entries(savingsByCategory).map(([cat, saving]) =>
                  saving > 0 ? (
                    <div className="cart-bill-row cart-bill-saving-row" key={cat}>
                      <span>{CATEGORY_DISCOUNT_LABELS[cat]}</span>
                      <span className="cart-bill-saving-amount">−₹{fmt(saving)}</span>
                    </div>
                  ) : null
                )}

                {totalSavings > 0 && (
                  <div className="cart-bill-row cart-bill-you-save">
                    <span>🎉 YOU SAVE</span>
                    <span>₹{fmt(totalSavings)}</span>
                  </div>
                )}

                <div className="cart-bill-divider" />

                <div className="cart-bill-row cart-bill-total">
                  <span>TOTAL</span>
                  <span>₹{fmt(finalTotal)}</span>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button
                className="cart-whatsapp-btn"
                id="cart-whatsapp-btn"
                onClick={handleWhatsApp}
                aria-label="Send order on WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send Order on WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
