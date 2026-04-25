import { getFootwearByGender, getSubcategories } from '@/lib/queries';
import FootwearGenderClient from './FootwearGenderClient';

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function FootwearGenderPage({ params }) {
  const { gender } = await params;

  const [products, subcategories] = await Promise.all([
    getFootwearByGender(gender),
    getSubcategories('footwear'),
  ]);

  // Build tabs from subcategories relevant to this gender
  const relevantSubs = [...new Set(products.map(p => p.subcategory))];
  const tabs = [
    { key: 'all', label: 'All' },
    ...subcategories
      .filter(s => relevantSubs.includes(s.slug))
      .map(s => ({ key: s.slug, label: s.name })),
  ];

  return <FootwearGenderClient products={products} tabs={tabs} gender={gender} />;
}
