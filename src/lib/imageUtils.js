/**
 * Generate blur placeholder data URLs for images.
 * @param {string} category - Product category (clothing, footwear, accessories)
 * @returns {string} Base64 encoded SVG blur placeholder
 */
export function generatePlaceholder(category) {
  const colors = {
    clothing: '#C41230',
    footwear: '#C41230',
    accessories: '#B8860B',
  };

  const color = colors[category] || colors.clothing;

  const svg = `<svg width="500" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="500" height="600" fill="${color}" opacity="0.08"/></svg>`;

  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(svg).toString('base64')
    : btoa(svg);

  return `data:image/svg+xml;base64,${base64}`;
}
