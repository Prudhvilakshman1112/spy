import { cache } from 'react';
import {
  DUMMY_PRODUCTS,
  getDummyProductById,
  getDummyFeaturedProducts,
  getDummyNewArrivals,
  getDummyProductsByCollection,
  getAllDummyProducts,
} from '@/lib/dummyData';

/**
 * Check if Supabase is properly configured.
 * Returns false when env vars are missing or placeholder.
 */
function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url && !url.includes('YOUR_NEW_PROJECT') && url.startsWith('https://');
}

/**
 * Optimize image URLs with Cloudinary transforms.
 */
function optimizeImageUrl(url, width = 800) {
  if (!url) return url;
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/c_limit,w_${width},q_auto,f_auto/`);
  }
  return url;
}

/**
 * Shape a raw Supabase product row into the flat object shape components expect.
 */
function shapeProduct(row) {
  const sortedImages = (row.product_images || []).sort((a, b) => a.display_order - b.display_order);
  const images = sortedImages.map((img) => optimizeImageUrl(img.image_url, 800));
  const colorImages = {};
  sortedImages.forEach((img, idx) => {
    if (img.color_tag && colorImages[img.color_tag] === undefined) {
      colorImages[img.color_tag] = idx;
    }
  });

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.subcategories?.categories?.slug || '',
    subcategory: row.subcategories?.slug || row.subcategories?.name?.toLowerCase() || '',
    price: row.price,
    originalPrice: row.original_price,
    description: row.description,
    sizes: row.sizes || [],
    colors: row.colors || [],
    badge: row.badge,
    fit: row.fit || null,
    stock: row.stock ?? null,
    collection: row.collection || null,
    images,
    colorImages,
  };
}

const LISTING_SELECT = `
  id, name, brand, price, original_price,
  sizes, colors, badge, fit, stock, collection,
  subcategories ( id, name, slug, categories ( id, name, slug ) ),
  product_images ( id, image_url, display_order, color_tag )
`;

const PRODUCT_SELECT = `
  id, name, brand, price, original_price, description,
  sizes, colors, badge, fit, stock, collection, is_active, created_at,
  subcategories ( id, name, slug, categories ( id, name, slug ) ),
  product_images ( id, image_url, display_order, color_tag )
`;

// ─── Dummy subcategories ───
const DUMMY_SUBCATEGORIES = [
  { id: 1, name: 'T-Shirts', slug: 't-shirts' },
  { id: 2, name: 'Shirts', slug: 'shirts' },
  { id: 3, name: 'Polos', slug: 'polos' },
  { id: 4, name: 'Jeans', slug: 'jeans' },
  { id: 5, name: 'Pants', slug: 'pants' },
  { id: 6, name: 'Joggers', slug: 'joggers' },
  { id: 7, name: 'Shorts', slug: 'shorts' },
  { id: 8, name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
];

// ─── Query Functions ───

export const getProductsByCategory = cache(async (categorySlug) => {
  if (!isSupabaseConfigured()) {
    return DUMMY_PRODUCTS.filter(p => p.category === categorySlug);
  }
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(LISTING_SELECT).eq('is_active', true)
    .eq('subcategories.categories.slug', categorySlug);
  return (data || [])
    .filter((p) => p.subcategories?.categories?.slug === categorySlug)
    .map(shapeProduct);
});

export const getProductsBySubcategory = cache(async (categorySlug, subcategorySlug) => {
  if (!isSupabaseConfigured()) {
    return DUMMY_PRODUCTS.filter(p => p.category === categorySlug && p.subcategory === subcategorySlug);
  }
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(LISTING_SELECT).eq('is_active', true);
  return (data || [])
    .filter(p => p.subcategories?.categories?.slug === categorySlug && p.subcategories?.slug === subcategorySlug)
    .map(shapeProduct);
});

export const getProductById = cache(async (id) => {
  if (!isSupabaseConfigured()) {
    return getDummyProductById(id);
  }
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(PRODUCT_SELECT).eq('id', id).single();
  if (!data) return null;
  return shapeProduct(data);
});

export const getFeaturedProducts = cache(async () => {
  if (!isSupabaseConfigured()) return getDummyFeaturedProducts();
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(LISTING_SELECT).eq('is_active', true)
    .in('badge', ['BESTSELLER', 'TRENDING']);
  return (data || []).map(shapeProduct);
});

export const getNewArrivals = cache(async () => {
  if (!isSupabaseConfigured()) return getDummyNewArrivals();
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(LISTING_SELECT).eq('is_active', true)
    .in('badge', ['NEW', 'EXCLUSIVE']);
  return (data || []).map(shapeProduct);
});

export const getRelatedProducts = cache(async (productId, categorySlug, limit = 4) => {
  if (!isSupabaseConfigured()) {
    return DUMMY_PRODUCTS.filter(p => p.id !== productId).slice(0, limit);
  }
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(LISTING_SELECT).eq('is_active', true)
    .neq('id', productId).limit(20);
  return (data || [])
    .filter((p) => p.subcategories?.categories?.slug === categorySlug)
    .slice(0, limit).map(shapeProduct);
});

export const getCategories = cache(async () => {
  if (!isSupabaseConfigured()) return [];
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories').select('*, subcategories(*)').order('name');
  return data || [];
});

export const getSubcategories = cache(async (categorySlug) => {
  if (!isSupabaseConfigured()) return DUMMY_SUBCATEGORIES;
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data: cat } = await supabase
    .from('categories').select('id').eq('slug', categorySlug).single();
  if (!cat) return [];
  const { data } = await supabase
    .from('subcategories').select('*').eq('category_id', cat.id).order('name');
  return data || [];
});

export const getAllProducts = cache(async () => {
  if (!isSupabaseConfigured()) return getAllDummyProducts();
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(LISTING_SELECT).eq('is_active', true);
  return (data || []).map(shapeProduct);
});

export const getProductsByCollection = cache(async (collectionSlug) => {
  if (!isSupabaseConfigured()) return getDummyProductsByCollection(collectionSlug);
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data } = await supabase
    .from('products').select(LISTING_SELECT).eq('is_active', true)
    .eq('collection', collectionSlug);
  return (data || []).map(shapeProduct);
});
