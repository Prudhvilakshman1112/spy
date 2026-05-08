import { getProductsByCategory, getSubcategories } from '@/lib/queries';
import ClothingClient from './ClothingClient';

export const revalidate = 3600;

export const metadata = {
  title: "Shop Men's Clothing | Cult Clothing",
  description: "Browse premium men's clothing — T-Shirts, Shirts, Polos, Jeans, Joggers & more at Cult Clothing.",
  keywords: "men's clothing, t-shirts, shirts, jeans, joggers, Cult Clothing, Vizag",
};

export default async function ClothingPage({ searchParams }) {
  const params = await searchParams;
  const [products, subcategories] = await Promise.all([
    getProductsByCategory('clothing'),
    getSubcategories('clothing'),
  ]);

  return (
    <ClothingClient
      products={products}
      subcategories={subcategories}
      initialFilter={params?.subcategory || ''}
      initialCollection={params?.collection || ''}
      initialBadgeFilter={params?.filter || ''}
    />
  );
}
