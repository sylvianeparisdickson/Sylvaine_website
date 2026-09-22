import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching Supabase tables
export type Painting = {
  id: string;
  title: string;
  series: string;
  medium: string;
  year: string;
  dimensions: string;
  framed_dimensions: string;
  hint: string;
  image: string;
  no_reproduction: boolean;
  order: number;
  status?: string;
  availability_label?: string;
  limited_editions?: {
    sizeLabel: string;
    edition: string;
    dimensions: string;
    price: string;
  }[];
  created_at?: string;
  updated_at?: string;
};

export type Series = {
  id: string;
  name: string;
  slug: string;
  numeral: string;
  subtitle: string;
  description: string;
  order: number;
  cover_image: string;
  created_at?: string;
  updated_at?: string;
};

export type Order = {
  id: string;
  customer_email: string;
  customer_name: string;
  painting_id: string;
  painting_title: string;
  edition: string;
  size_label: string;
  dimensions: string;
  price: number;
  payment_method: "stripe" | "paypal";
  payment_id: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered";
  payment_plan?: "full" | "3month";
  tracking_number?: string;
  shipping_address: string;
  created_at?: string;
  updated_at?: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  created_at?: string;
};

export type ContactSubmission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject?: string;
  message?: string;
  size?: string;
  timeline?: string;
  how_did_you_find_us?: string;
  reference_image?: string;
  created_at?: string;
};

// Get image URL from Supabase storage
export function supabaseImageUrl(path: string): string {
  if (!path) return "";
  return `${supabaseUrl}/storage/v1/object/public/${path}`;
}

// Get public URL for a file in storage
function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// Fetch all series ordered
export async function fetchAllSeries(): Promise<Series[]> {
  try {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    
    // Transform to add public URLs for images
    return (data || []).map(s => ({
      ...s,
      cover_image: s.cover_image ? getPublicUrl('series', s.cover_image) : ''
    }));
  } catch (error) {
    console.error("fetchAllSeries error:", error);
    return [];
  }
}

// Fetch paintings by series slug
export async function fetchPaintingsBySeries(seriesSlug: string): Promise<Painting[]> {
  try {
    const { data, error } = await supabase
      .from('paintings')
      .select('*')
      .eq('series', seriesSlug)
      .order('order', { ascending: true });
    
    if (error) throw error;
    
    // Transform to add public URLs for images
    return (data || []).map(p => ({
      ...p,
      image: p.image ? getPublicUrl('paintings', p.image) : ''
    }));
  } catch (error) {
    console.error("fetchPaintingsBySeries error:", error);
    return [];
  }
}

// Fetch all paintings
export async function fetchAllPaintings(): Promise<Painting[]> {
  try {
    const { data, error } = await supabase
      .from('paintings')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    
    // Transform to add public URLs for images
    return (data || []).map(p => ({
      ...p,
      image: p.image ? getPublicUrl('paintings', p.image) : ''
    }));
  } catch (error) {
    console.error("fetchAllPaintings error:", error);
    return [];
  }
}

// Fetch single series by slug
export async function fetchSeriesBySlug(slug: string): Promise<Series | null> {
  try {
    const { data, error } = await supabase
      .from('series')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Transform to add public URL for cover image
    return {
      ...data,
      cover_image: data.cover_image ? getPublicUrl('series', data.cover_image) : ''
    };
  } catch (error) {
    console.error("fetchSeriesBySlug error:", error);
    return null;
  }
}

// Subscribe to newsletter
export async function subscribeToNewsletter(email: string): Promise<boolean> {
  try {
    // Call the API route which handles both DB insertion and email notification
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    return res.ok;
  } catch (error) {
    console.error("subscribeToNewsletter error:", error);
    return false;
  }
}

// Create order
export async function createOrder(
  orderData: Omit<Order, "id" | "created_at" | "updated_at">
): Promise<Order | null> {
  try {
    console.log("Sending order to Supabase:");
    console.log(orderData);

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    console.log("Supabase Response:", data, error);

    if (error) throw error;
    
    // Send email notification
    try {
      await fetch('/api/order-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
    }
    
    return data;
  } catch (error) {
    console.error("createOrder error:", error);
    return null;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order["status"], trackingNumber?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status, 
        ...(trackingNumber && { tracking_number: trackingNumber }) 
      })
      .eq('id', orderId);
    
    return !error;
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return false;
  }
}

// Get order by payment ID
export async function getOrderByPaymentId(paymentId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_id', paymentId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("getOrderByPaymentId error:", error);
    return null;
  }
}

// Create contact submission
export async function createContactSubmission(
  submissionData: Omit<ContactSubmission, "id" | "created_at">
): Promise<ContactSubmission | null> {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert(submissionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("createContactSubmission error:", error);
    return null;
  }
}
