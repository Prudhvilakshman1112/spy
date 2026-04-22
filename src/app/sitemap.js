import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://brand2brands.vercel.app';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/clothing`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/footwear`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/accessories`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/footwear/men`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/footwear/women`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Dynamic product pages
  let productPages = [];
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from('products')
      .select('id, created_at')
      .eq('is_active', true);

    productPages = (products || []).map((product) => ({
      url: `${BASE_URL}/product/${product.id}`,
      lastModified: product.created_at ? new Date(product.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (e) {
    // If DB is unreachable, still return static pages
  }

  return [...staticPages, ...productPages];
}
