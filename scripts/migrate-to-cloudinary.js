/**
 * migrate-to-cloudinary.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Migrates all existing product images from Supabase Storage to Cloudinary.
 *
 * For each product_images row with a Supabase Storage URL:
 *   1. Downloads the image from Supabase
 *   2. Uploads it to Cloudinary (folder: brand2brand/products/{productId}/)
 *   3. Updates the image_url in Supabase DB to the new Cloudinary URL
 *
 * Run: node scripts/migrate-to-cloudinary.js
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CLOUD_NAME   = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY      = process.env.CLOUDINARY_API_KEY;
const API_SECRET   = process.env.CLOUDINARY_API_SECRET;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}
if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('❌ Missing Cloudinary credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// ── SHA-1 for Cloudinary signature ──────────────────────────────────────────
async function sha1Hex(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Upload buffer to Cloudinary ─────────────────────────────────────────────
async function uploadToCloudinary(buffer, mimeType, folder, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = { folder, timestamp };
  if (publicId) paramsToSign.public_id = publicId;

  const signatureString =
    Object.keys(paramsToSign)
      .sort()
      .map(k => `${k}=${paramsToSign[k]}`)
      .join('&') + API_SECRET;

  const signature = await sha1Hex(signatureString);

  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  formData.append('file', blob, `image.${mimeType.split('/')[1] || 'jpg'}`);
  formData.append('folder', folder);
  formData.append('timestamp', timestamp.toString());
  formData.append('api_key', API_KEY);
  formData.append('signature', signature);
  if (publicId) formData.append('public_id', publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || response.statusText);
  }

  const data = await response.json();
  return { url: data.secure_url, publicId: data.public_id, bytes: data.bytes };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function migrate() {
  console.log('🚀 Starting Supabase → Cloudinary image migration...\n');

  // Fetch all product_images with Supabase Storage URLs
  const { data: allImages, error } = await supabase
    .from('product_images')
    .select('id, product_id, image_url, display_order')
    .order('product_id')
    .order('display_order');

  if (error) {
    console.error('❌ Failed to fetch images:', error.message);
    process.exit(1);
  }

  // Filter to only Supabase Storage URLs (skip already-Cloudinary ones)
  const supabaseImages = allImages.filter(img =>
    img.image_url && img.image_url.includes('supabase.co/storage/')
  );

  console.log(`📊 Total images in DB: ${allImages.length}`);
  console.log(`📊 Supabase Storage images to migrate: ${supabaseImages.length}`);
  console.log(`📊 Already on Cloudinary (skipping): ${allImages.length - supabaseImages.length}\n`);

  if (supabaseImages.length === 0) {
    console.log('✅ All images are already on Cloudinary. Nothing to migrate!');
    return;
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < supabaseImages.length; i++) {
    const img = supabaseImages[i];
    const progress = `[${i + 1}/${supabaseImages.length}]`;

    try {
      // 1. Download from Supabase
      const response = await fetch(img.image_url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // 2. Upload to Cloudinary
      const folder = `brand2brand/products/${img.product_id}`;
      const publicId = img.display_order === 0
        ? 'cover'
        : `variant_${img.display_order}`;

      const result = await uploadToCloudinary(
        Buffer.from(buffer),
        contentType,
        folder,
        publicId
      );

      // 3. Update URL in Supabase DB
      const { error: updateErr } = await supabase
        .from('product_images')
        .update({ image_url: result.url })
        .eq('id', img.id);

      if (updateErr) {
        throw new Error(`DB update failed: ${updateErr.message}`);
      }

      console.log(`${progress} ✅ Migrated → ${result.url.split('/').slice(-2).join('/')} (${Math.round(result.bytes / 1024)} KB)`);
      success++;
    } catch (err) {
      console.error(`${progress} ❌ Failed (product: ${img.product_id}): ${err.message}`);
      failed++;
    }

    // Small delay to respect rate limits
    if (i < supabaseImages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('✅ Migration Complete!');
  console.log(`   Migrated: ${success}`);
  console.log(`   Failed:   ${failed}`);
  console.log(`   Total:    ${supabaseImages.length}`);
  console.log('═'.repeat(60));

  if (failed > 0) {
    console.log('\n⚠️  Some images failed. Re-run this script to retry — it skips already-migrated ones.');
  }
}

migrate().catch(console.error);
