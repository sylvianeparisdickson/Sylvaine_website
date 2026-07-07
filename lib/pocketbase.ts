const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sgzo0nrujpc3b4h.ba7w.pocketbasecloud.com";

export type PBPainting = {
  id: string;
  title: string;
  series: string;
  medium: string;
  year: string;
  dimensions: string;
  framedDimensions: string;
  hint: string;
  image: string;
  no_reproduction: boolean;
  order: number;
  status?: string;
  availabilityLabel?: string;
  limitedEditions?: {
    sizeLabel: string;
    edition: string;
    dimensions: string;
    price: string;
  }[];
  collectionId: string;
  collectionName: string;
};

export type PBSeries = {
  id: string;
  name: string;
  slug: string;
  numeral: string;
  subtitle: string;
  description: string;
  order: number;
  cover_image: string;
  collectionId: string;
  collectionName: string;
};

// Get image URL from Pocketbase
export function pbImageUrl(record: PBPainting | PBSeries, field: string): string {
const filename = (record as unknown as Record<string, string>)[field];  if (!filename) return "";
  return `${PB_URL}/api/files/${record.collectionName}/${record.id}/${filename}`;
}

// Fetch all series ordered
export async function fetchAllSeries(): Promise<PBSeries[]> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/series/records?sort=order&perPage=50`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch series");
    const data = await res.json();
    return data.items as PBSeries[];
  } catch (error) {
    console.error("fetchAllSeries error:", error);
    return [];
  }
}

// Fetch paintings by series slug
export async function fetchPaintingsBySeries(seriesSlug: string): Promise<PBPainting[]> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/paintings/records?filter=(series='${seriesSlug}')&sort=order&perPage=50`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch paintings");
    const data = await res.json();
    return data.items as PBPainting[];
  } catch (error) {
    console.error("fetchPaintingsBySeries error:", error);
    return [];
  }
}

// Fetch all paintings
export async function fetchAllPaintings(): Promise<PBPainting[]> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/paintings/records?sort=order&perPage=100`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch paintings");
    const data = await res.json();
    return data.items as PBPainting[];
  } catch (error) {
    console.error("fetchAllPaintings error:", error);
    return [];
  }
}

// Fetch single series by slug
export async function fetchSeriesBySlug(slug: string): Promise<PBSeries | null> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/series/records?filter=(slug='${slug}')&perPage=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch series");
    const data = await res.json();
    return data.items[0] ?? null;
  } catch (error) {
    console.error("fetchSeriesBySlug error:", error);
    return null;
  }
}

// Subscribe to newsletter
export async function subscribeToNewsletter(email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/newsletter_subscribers/records`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

// Order types
export type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  paintingId: string;
  paintingTitle: string;
  edition: string;
  sizeLabel: string;
  dimensions: string;
  price: number;
  paymentMethod: "stripe" | "paypal";
  paymentId: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered";
  paymentPlan?: "full" | "3month";
  trackingNumber?: string;
  shippingAddress: string;
  created: string;
  collectionId: string;
  collectionName: string;
};

// Create order
export async function createOrder(orderData: Omit<Order, "id" | "collectionId" | "collectionName" | "created">): Promise<Order | null> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/orders/records`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      }
    );
    if (!res.ok) throw new Error("Failed to create order");
    const data = await res.json();
    return data as Order;
  } catch (error) {
    console.error("createOrder error:", error);
    return null;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order["status"], trackingNumber?: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/orders/records/${orderId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(trackingNumber && { trackingNumber }) }),
      }
    );
    return res.ok;
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return false;
  }
}

// Get order by payment ID
export async function getOrderByPaymentId(paymentId: string): Promise<Order | null> {
  try {
    const res = await fetch(
      `${PB_URL}/api/collections/orders/records?filter=(paymentId='${paymentId}')&perPage=1`
    );
    if (!res.ok) throw new Error("Failed to fetch order");
    const data = await res.json();
    return data.items[0] ?? null;
  } catch (error) {
    console.error("getOrderByPaymentId error:", error);
    return null;
  }
}