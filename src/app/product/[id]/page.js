import { getProductById, getRelatedProducts } from '@/lib/queries';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import { DUMMY_PRODUCTS } from '@/lib/dummyData';

export const revalidate = 7200;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Use dummy products for static generation when Supabase is not configured
  return DUMMY_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found | Cult Clothing',
      description: 'The product you are looking for does not exist.',
    };
  }

  const title = `${product.name} | Cult Clothing`;
  const description = product.description
    || `Shop ${product.name} at ₹${product.price.toLocaleString()}. Premium men's fashion at Cult Clothing, Vizag.`;

  return {
    title,
    description,
    keywords: `${product.name}, Cult Clothing, Vizag fashion, men's fashion`,
    openGraph: {
      title: `${product.name} — Cult Clothing`,
      description,
      type: 'website',
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
