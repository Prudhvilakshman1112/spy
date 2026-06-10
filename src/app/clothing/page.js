import { getProductsByCategory, getSubcategories } from '@/lib/queries';
import ClothingClient from './ClothingClient';

export const revalidate = 3600;

export const metadata = {
  title: "Shop Men's Clothing | SPY Multibrand Stores",
  description: "Browse premium men's clothing — T-Shirts, Shirts, Polos, Jeans, Joggers & more at SPY Multibrand Stores.",
  keywords: "men's clothing, t-shirts, shirts, jeans, joggers, SPY Multibrand Stores, Visakhapatnam",
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
