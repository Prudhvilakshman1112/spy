import { getFeaturedProducts, getNewArrivals, getAllProducts } from '@/lib/queries';
import HomeClient from './HomeClient';

export const revalidate = 3600;

export default async function HomePage() {
  const [featured, newArrivals, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getAllProducts(),
  ]);

  return <HomeClient featured={featured} newArrivals={newArrivals} allProducts={allProducts} />;
}
