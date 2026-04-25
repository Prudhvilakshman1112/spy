import { getProductsByCategory, getSubcategories } from '@/lib/queries';
import ClothingClient from './ClothingClient';

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function ClothingPage() {
  const [allProducts, subcategories] = await Promise.all([
    getProductsByCategory('clothing'),
    getSubcategories('clothing'),
  ]);

  const tabs = [
    { key: 'all', label: 'All' },
    ...subcategories.map(s => ({ key: s.slug, label: s.name })),
  ];

  return <ClothingClient allProducts={allProducts} tabs={tabs} />;
}
