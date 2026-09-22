// Migration script from PocketBase to Supabase
// Run with: npx tsx scripts/migrate-pocketbase-to-supabase.ts

import { createClient } from '@supabase/supabase-js';

const POCKETBASE_URL = 'https://sgzo0nrujpc3b4h.ba7w.pocketbasecloud.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch all records from a PocketBase collection
async function fetchFromPocketBase(collection: string) {
  const response = await fetch(`${POCKETBASE_URL}/api/collections/${collection}/records?perPage=100`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${collection}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.items || [];
}

// Download file from PocketBase and upload to Supabase
async function migrateFile(
  pocketbaseUrl: string,
  bucket: string,
  filename: string
): Promise<string | null> {
  try {
    // Download from PocketBase
    const response = await fetch(pocketbaseUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, blob);
    
    if (error) throw error;
    return data.path;
  } catch (error) {
    console.error(`Failed to migrate file ${filename}:`, error);
    return null;
  }
}

// Migrate series collection
async function migrateSeries() {
  console.log('Migrating series...');
  const records = await fetchFromPocketBase('series');
  
  for (const record of records) {
    let coverImagePath = '';
    
    // Migrate cover image if exists
    if (record.cover_image) {
      const pocketbaseUrl = `${POCKETBASE_URL}/api/files/series/${record.id}/${record.cover_image}`;
      coverImagePath = await migrateFile(pocketbaseUrl, 'series', record.cover_image) || '';
    }
    
    // Transform and insert into Supabase
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
      console.log(`✓ Migrated series: ${record.name}`);
    }
  }
}

// Migrate paintings collection
async function migratePaintings() {
  console.log('Migrating paintings...');
  const records = await fetchFromPocketBase('paintings');
  
  for (const record of records) {
    let imagePath = '';
    
    // Migrate image if exists
    if (record.image) {
      const pocketbaseUrl = `${POCKETBASE_URL}/api/files/paintings/${record.id}/${record.image}`;
      imagePath = await migrateFile(pocketbaseUrl, 'paintings', record.image) || '';
    }
    
    // Transform and insert into Supabase
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
      console.log(`✓ Migrated painting: ${record.title}`);
    }
  }
}

// Migrate newsletter_subscribers collection
async function migrateNewsletterSubscribers() {
  console.log('Migrating newsletter subscribers...');
  const records = await fetchFromPocketBase('newsletter_subscribers');
  
  for (const record of records) {
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: record.email,
    });
    
    if (error) {
      console.error(`Failed to insert subscriber ${record.id}:`, error);
    } else {
      console.log(`✓ Migrated subscriber: ${record.email}`);
    }
  }
}

// Migrate orders collection
async function migrateOrders() {
  console.log('Migrating orders...');
  const records = await fetchFromPocketBase('orders');
  
  for (const record of records) {
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
      console.log(`✓ Migrated order: ${record.id}`);
    }
  }
}

// Migrate contact_submissions collection
async function migrateContactSubmissions() {
  console.log('Migrating contact submissions...');
  const records = await fetchFromPocketBase('contact_submissions');
  
  for (const record of records) {
    let referenceImagePath = '';
    
    // Migrate reference image if exists
    if (record.reference_image) {
      const pocketbaseUrl = `${POCKETBASE_URL}/api/files/contact_submissions/${record.id}/${record.reference_image}`;
      referenceImagePath = await migrateFile(pocketbaseUrl, 'submissions', record.reference_image) || '';
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
      console.log(`✓ Migrated contact submission: ${record.email}`);
    }
  }
}

// Main migration function
async function migrate() {
  console.log('Starting PocketBase to Supabase migration...\n');
  
  try {
    await migrateSeries();
    await migratePaintings();
    await migrateNewsletterSubscribers();
    await migrateOrders();
    await migrateContactSubmissions();
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
