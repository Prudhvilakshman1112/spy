/**
 * Cult Clothing — Flat 10% Discount on All Items
 */

export const DISCOUNT_RATE = 0.10;
export const DISCOUNT_LABEL = '10% OFF';

/** Returns the discounted price for a single item. */
export function applyDiscount(price) {
  return price * (1 - DISCOUNT_RATE);
}

/**
 * Computes full cart totals with flat 10% discount.
 */
export function computeCartTotals(items) {
  let originalTotal = 0;

  const itemBreakdown = items.map((item) => {
    const originalLineTotal = item.price * item.quantity;
    const discountedLineTotal = originalLineTotal * (1 - DISCOUNT_RATE);
    const saving = originalLineTotal - discountedLineTotal;
    originalTotal += originalLineTotal;

    return { ...item, rate: DISCOUNT_RATE, originalLineTotal, discountedLineTotal, saving };
  });

  const totalSavings = originalTotal * DISCOUNT_RATE;
  const finalTotal = originalTotal - totalSavings;

  return { originalTotal, totalSavings, finalTotal, itemBreakdown, savingsByCategory: {} };
}

/**
 * Builds the WhatsApp message body.
 */
export function buildWhatsAppMessage(itemBreakdown, totals) {
  const fmt = (n) => n.toLocaleString('en-IN');
  const lines = ['🛍️ *NEW ORDER — Cult Clothing*', ''];

  itemBreakdown.forEach((item, idx) => {
    const discount = item.rate > 0
      ? ` → After ${Math.round(item.rate * 100)}% OFF: ₹${fmt(Math.round(item.discountedLineTotal))}`
      : '';
    lines.push(
      `${idx + 1}. *${item.name}*`,
      `   Size: ${item.size || 'N/A'} | Colour: ${item.color || 'N/A'} | Qty: ${item.quantity}`,
      `   Price: ₹${fmt(item.price)} × ${item.quantity} = ₹${fmt(item.originalLineTotal)}${discount}`,
      '',
    );
  });

  lines.push(
    '━━━━━━━━━━━━━━━━━━━━',
    `Original Total : ₹${fmt(Math.round(totals.originalTotal))}`,
    `Flat 10% OFF   : −₹${fmt(Math.round(totals.totalSavings))}`,
    `*FINAL TOTAL   : ₹${fmt(Math.round(totals.finalTotal))}*`,
    '━━━━━━━━━━━━━━━━━━━━',
    'Please confirm availability & shipping details. Thank you! 🙏',
  );

  return lines.join('\n');
}
