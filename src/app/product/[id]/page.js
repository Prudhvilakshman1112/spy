import { getProductById, getRelatedProducts } from '@/lib/queries';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Brand Two Brand's",
      description: 'The product you are looking for does not exist.',
    };
  }

  const title = `${product.name} by ${product.brand} | Brand Two Brand's`;
  const description = product.description
    || `Shop ${product.name} by ${product.brand} at ₹${product.price.toLocaleString()}. Premium ${product.category} available at Brand Two Brand's, Vizag's finest fashion store.`;
  const image = product.images?.[0] || '/products/logo/B2blogo.jpg';

  return {
    title,
    description,
    keywords: `${product.name}, ${product.brand}, ${product.category}, Brand Two Brand, Vizag fashion`,
    openGraph: {
      title: `${product.name} — ${product.brand}`,
      description,
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ${product.brand}`,
      description,
      images: [image],
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
