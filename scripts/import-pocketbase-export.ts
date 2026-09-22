// Import PocketBase export to Supabase
// Run with: npx tsx scripts/import-pocketbase-export.ts <path-to-export-folder>

import { createClient } from '@supabase/supabase-js';
import { readFileSync, statSync } from 'fs';
import { join } from 'path';
import csv from 'csv-parser';
import { createReadStream } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Parse CSV to JSON using csv-parser
function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Check if file exists
function fileExists(filePath: string): boolean {
  try {
    statSync(filePath);
    return true;
  } catch {
    return false;
  }
}

// Upload file to Supabase storage
async function uploadFile(filePath: string, bucket: string, filename: string): Promise<string | null> {
  try {
    const fileBuffer = readFileSync(filePath);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, fileBuffer);
    
    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error(`Failed to upload file ${filename}:`, error);
    return null;
  }
}

// Import series
async function importSeries(exportDir: string, data: any[]) {
  console.log('Importing series...');
  
  for (const record of data) {
    let coverImagePath = '';
    
    // Upload cover image if exists
    if (record.cover_image) {
      const imagePath = join(exportDir, 'storage', 'series', record.id, record.cover_image);
      try {
        if (statSync(imagePath).isFile()) {
          coverImagePath = await uploadFile(imagePath, 'series', record.cover_image) || '';
        }
      } catch {
        console.log(`Cover image not found for ${record.name}`);
      }
    }
    
    const { error } = await supabase.from('series').insert({
      name: record.name,
      slug: record.slug,
      numeral: record.numeral,
      subtitle: record.subtitle,
      description: record.description,
      order_num: record.order,
      cover_image: coverImagePath,
    });
    
    if (error) {
      console.error(`Failed to insert series ${record.id}:`, error);
    } else {
      console.log(`✓ Imported series: ${record.name}`);
    }
  }
}

// Import paintings
async function importPaintings(exportDir: string, data: any[]) {
  console.log('Importing paintings...');
  
  for (const record of data) {
    let imagePath = '';
    
    // Upload image if exists
    if (record.image) {
      const imagePathFull = join(exportDir, 'storage', 'paintings', record.id, record.image);
      try {
        if (statSync(imagePathFull).isFile()) {
          imagePath = await uploadFile(imagePathFull, 'paintings', record.image) || '';
        }
      } catch {
        console.log(`Image not found for ${record.title}`);
      }
    }
    
    const { error } = await supabase.from('paintings').insert({
      title: record.title,
      series: record.series,
      medium: record.medium,
      year: record.year,
      dimensions: record.dimensions,
      framed_dimensions: record.framedDimensions,
      hint: record.hint,
      image: imagePath,
      no_reproduction: record.noReproduction || false,
      order_num: record.order,
      status: record.status,
      availability_label: record.availabilityLabel,
      limited_editions: record.limitedEditions,
    });
    
    if (error) {
      console.error(`Failed to insert painting ${record.id}:`, error);
    } else {
      console.log(`✓ Imported painting: ${record.title}`);
    }
  }
}

// Import newsletter subscribers
async function importNewsletterSubscribers(data: any[]) {
  console.log('Importing newsletter subscribers...');
  
  for (const record of data) {
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: record.email,
    });
    
    if (error) {
      if (error.code === '23505') {
        console.log(`✓ Skipped duplicate subscriber: ${record.email}`);
      } else {
        console.error(`Failed to insert subscriber ${record.id}:`, error);
      }
    } else {
      console.log(`✓ Imported subscriber: ${record.email}`);
    }
  }
}

// Import orders
async function importOrders(data: any[]) {
  console.log('Importing orders...');
  
  for (const record of data) {
    const { error } = await supabase.from('orders').insert({
      customer_email: record.customerEmail,
      customer_name: record.customerName,
      painting_id: record.paintingId,
      painting_title: record.paintingTitle,
      edition: record.edition,
      size_label: record.sizeLabel,
      dimensions: record.dimensions,
      price: record.price,
      payment_method: record.paymentMethod,
      payment_id: record.paymentId,
      status: record.status,
      payment_plan: record.paymentPlan,
      tracking_number: record.trackingNumber,
      shipping_address: record.shippingAddress,
    });
    
    if (error) {
      console.error(`Failed to insert order ${record.id}:`, error);
    } else {
      console.log(`✓ Imported order: ${record.id}`);
    }
  }
}

// Import contact submissions
async function importContactSubmissions(exportDir: string, data: any[]) {
  console.log('Importing contact submissions...');
  
  for (const record of data) {
    let referenceImagePath = '';
    
    // Upload reference image if exists
    if (record.reference_image) {
      const imagePath = join(exportDir, 'storage', 'contact_submissions', record.id, record.reference_image);
      try {
        if (statSync(imagePath).isFile()) {
          referenceImagePath = await uploadFile(imagePath, 'submissions', record.reference_image) || '';
        }
      } catch {
        console.log(`Reference image not found for ${record.email}`);
      }
    }
    
    const { error } = await supabase.from('contact_submissions').insert({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      subject: record.subject,
      message: record.message,
      size: record.size,
      timeline: record.timeline,
      how_did_you_find_us: record.how_did_you_find_us,
      reference_image: referenceImagePath,
    });
    
    if (error) {
      console.error(`Failed to insert contact submission ${record.id}:`, error);
    } else {
      console.log(`✓ Imported contact submission: ${record.email}`);
    }
  }
}

// Main import function
async function importPocketBaseExport() {
  const exportDir = process.argv[2];
  
  if (!exportDir) {
    console.error('Please provide the path to the PocketBase export folder');
    console.log('Usage: npx tsx scripts/import-pocketbase-export.ts <path-to-export-folder>');
    process.exit(1);
  }
  
  console.log(`Importing from: ${exportDir}\n`);
  
  try {
    // Import each collection from CSV
    const collections = ['series', 'paintings', 'newsletter_subscribers', 'orders', 'contact_submissions'];
    
    for (const collection of collections) {
      const csvPath = join(exportDir, `${collection}.csv`);
      
      // Check if file exists before trying to parse
      if (!fileExists(csvPath)) {
        console.log(`Skipping ${collection}: file not found`);
        continue;
      }
      
      try {
        const data = await parseCSV(csvPath);
        
        if (data.length === 0) {
          console.log(`Skipping ${collection}: empty file`);
          continue;
        }
        
        switch (collection) {
          case 'series':
            await importSeries(exportDir, data);
            break;
          case 'paintings':
            await importPaintings(exportDir, data);
            break;
          case 'newsletter_subscribers':
            await importNewsletterSubscribers(data);
            break;
          case 'orders':
            await importOrders(data);
            break;
          case 'contact_submissions':
            await importContactSubmissions(exportDir, data);
            break;
        }
      } catch (error: any) {
        console.log(`Skipping ${collection}: error - ${error.message}`);
      }
    }
    
    console.log('\n✅ Import completed successfully!');
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

importPocketBaseExport();
