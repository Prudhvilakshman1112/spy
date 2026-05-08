/**
 * Full cleanup — lists and deletes ALL files in the product-images bucket.
 */
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = 'product-images';

async function listAllFiles(folder = '') {
  const allFiles = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(folder, { limit, offset });

    if (error) { console.error(`Error listing "${folder}":`, error.message); break; }
    if (!data || data.length === 0) break;

    for (const item of data) {
      const fullPath = folder ? `${folder}/${item.name}` : item.name;
      if (!item.id) {
        // folder — recurse
        const sub = await listAllFiles(fullPath);
        allFiles.push(...sub);
      } else {
        allFiles.push(fullPath);
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return allFiles;
}

async function main() {
  console.log('🔍 Deep scanning entire bucket "product-images"...\n');

  // List root level first
  const rootItems = await supabase.storage.from(BUCKET).list('', { limit: 1000 });
  console.log('Root level items:', (rootItems.data || []).map(i => `${i.name} (${i.id ? 'file' : 'folder'})`));
  console.log('');

  const files = await listAllFiles('');
  console.log(`\n📊 Total files found: ${files.length}\n`);
  files.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));

  if (files.length === 0) {
    console.log('\n📭 Bucket is empty! If you still see images in Supabase dashboard, try refreshing the page.');
    return;
  }

  // Delete all
  console.log(`\n🗑️  Deleting all ${files.length} files...`);
  const batchSize = 100;
  let deleted = 0;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const { error } = await supabase.storage.from(BUCKET).remove(batch);
    if (error) {
      console.error('Delete error:', error.message);
    } else {
      deleted += batch.length;
      console.log(`   ✅ Deleted ${batch.length} files (batch ${Math.floor(i/batchSize)+1})`);
    }
  }

  console.log(`\n✅ Done! Deleted ${deleted}/${files.length} files from Supabase Storage.`);
}

main().catch(console.error);
