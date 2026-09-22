// Upload images from public folder to Supabase storage
// Run with: npx tsx scripts/upload-images-to-supabase.ts

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mapping of painting titles to image filenames
const paintingImageMap: Record<string, string> = {
  'Inner Illumination': 'artisans.jpg',
  'Morning Visit': 'morning-visit.jpg',
  'The Souls of the Park': 'souls-of-the-park.jpg',
  'The Art of Indulgence': 'art-of-indulgence.jpg',
  'Timeless Craft': 'timeless-craft.jpg',
  'Balcony Refreshment': 'balcony-refreshment.jpg',
  'Whispering Passage': 'whispering-passage.jpg',
  'Poseidon, The Magnificent': 'poseidon.jpg',
  'Nature\'s Guardians': 'natures-guardians.jpg',
  'The Beauty of Venus': 'beauty-of-venus.jpg',
  'The Path of Wonder': 'path.jpg',
  'Light Renewed': 'Light Renewed.jpg',
};

// Upload file to Supabase storage
async function uploadFile(filePath: string, bucket: string, filename: string): Promise<string | null> {
  try {
    const fileBuffer = readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, fileBuffer, { upsert: true });
    
    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error(`Failed to upload file ${filename}:`, error);
    return null;
  }
}

// Upload painting images
async function uploadPaintingImages() {
  console.log('Uploading painting images to Supabase...');
  const publicDir = join(process.cwd(), 'public');
  
  for (const [title, filename] of Object.entries(paintingImageMap)) {
    const imagePath = join(publicDir, filename);
    
    try {
      // Upload to paintings bucket
      const path = await uploadFile(imagePath, 'paintings', filename);
      
      if (path) {
        // Update painting record with image path
        const { error } = await supabase
          .from('paintings')
          .update({ image: path })
          .eq('title', title);
        
        if (error) {
          console.error(`Failed to update painting ${title}:`, error);
        } else {
          console.log(`✓ Uploaded and updated: ${title} -> ${filename}`);
        }
      }
    } catch (error) {
      console.error(`Failed to process ${title}:`, error);
    }
  }
}

// Main function
async function main() {
  try {
    await uploadPaintingImages();
    console.log('\n✅ Image upload completed successfully!');
  } catch (error) {
    console.error('\n❌ Image upload failed:', error);
    process.exit(1);
  }
}

main();
