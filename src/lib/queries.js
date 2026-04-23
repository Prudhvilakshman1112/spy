import { createClient } from '@/lib/supabase/server';

/**
 * Shape a raw product row (with joined subcategories + images) into the
 * flat object shape the existing components expect.
 */
function shapeProduct(row) {
  const sortedImages = (row.product_images || [])
    .sort((a, b) => a.display_order - b.display_order);

  const images = sortedImages.map((img) => img.image_url);

  // Build colorImages: { 'Black': 1, 'Navy': 2, ... }
  // Maps colour name -> index in the images[] array.
  // Images with no color_tag are cover/generic photos (index 0 by default).
  const colorImages = {};
  sortedImages.forEach((img, idx) => {
    if (img.color_tag) {
      // If a colour appears multiple times, keep the first (lowest display_order)
      if (colorImages[img.color_tag] === undefined) {
        colorImages[img.color_tag] = idx;
      }
    }
  });

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.subcategories?.categories?.slug || row.subcategories?.categories?.name?.toLowerCase() || '',
    subcategory: row.subcategories?.slug || row.subcategories?.name?.toLowerCase() || '',
    gender: row.gender || undefined,
    price: row.price,
    originalPrice: row.original_price,
    description: row.description,
    sizes: row.sizes || [],
    colors: row.colors || [],
    badge: row.badge,
    atmosphere: row.atmosphere_theme || 'default',
    images,
    colorImages,  // { 'Black': 1, 'Navy': 2 } — colour → image index
  };
}

const PRODUCT_SELECT = `
  id, name, brand, gender, price, original_price, description,
  sizes, colors, badge, atmosphere_theme, is_active, created_at,
  subcategories ( id, name, slug, categories ( id, name, slug ) ),
  product_images ( id, image_url, display_order, color_tag )
`;

// ─── Query Functions ───

export async function getProductsByCategory(categorySlug) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('subcategories.categories.slug', categorySlug);

  // Supabase nested filter doesn't eliminate parent rows, so filter client-side
  return (data || [])
    .filter((p) => p.subcategories?.categories?.slug === categorySlug)
    .map(shapeProduct);
}

export async function getProductsBySubcategory(categorySlug, subcategorySlug) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true);

  return (data || [])
    .filter(
      (p) =>
        p.subcategories?.categories?.slug === categorySlug &&
        p.subcategories?.slug === subcategorySlug
    )
    .map(shapeProduct);
}

export async function getProductsByGender(gender) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('gender', gender);

  return (data || []).map(shapeProduct);
}

export async function getFootwearByGender(gender) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('gender', gender);

  return (data || [])
    .filter((p) => p.subcategories?.categories?.slug === 'footwear')
    .map(shapeProduct);
}

export async function getProductById(id) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single();

  if (!data) return null;
  return shapeProduct(data);
}

export async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .in('badge', ['BESTSELLER', 'TRENDING']);

  return (data || []).map(shapeProduct);
}

export async function getNewArrivals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .in('badge', ['NEW', 'EXCLUSIVE']);

  return (data || []).map(shapeProduct);
}

export async function getRelatedProducts(productId, categorySlug, limit = 4) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .neq('id', productId)
    .limit(20);

  return (data || [])
    .filter((p) => p.subcategories?.categories?.slug === categorySlug)
    .slice(0, limit)
    .map(shapeProduct);
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('*, subcategories(*)')
    .order('name');

  return data || [];
}

export async function getSubcategories(categorySlug) {
  const supabase = await createClient();
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!cat) return [];

  const { data } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', cat.id)
    .order('name');

  return data || [];
}

export async function getAccessoriesGrouped() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true);

  const accessories = (data || [])
    .filter((p) => p.subcategories?.categories?.slug === 'accessories')
    .map(shapeProduct);

  return {
    menWatches: accessories.filter(p => p.subcategory === 'watches' && p.gender === 'men'),
    womenWatches: accessories.filter(p => p.subcategory === 'watches' && p.gender === 'women'),
    bags: accessories.filter(p => p.subcategory === 'bags'),
  };
}
