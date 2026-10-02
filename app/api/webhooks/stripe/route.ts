import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';
import { createOrder } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Stripe payment completed:", {
          paymentId: session.id,
          customerEmail: session.customer_email,
          metadata: session.metadata,
          amount: session.amount_total,
        });

        const metadata = session.metadata || {};
        const isStudioPayment = metadata.type === "studio_payment";
        const paintingId = metadata.paintingId;

        // Fetch painting customs information for international orders
        let hsCode = "";
        let countryOfOrigin = "US";
        let customsNotes = "";
        
        if (!isStudioPayment && paintingId) {
          try {
            const { data: painting } = await supabase
              .from('paintings')
              .select('hs_code, country_of_origin, international_shipping_notes')
              .eq('id', paintingId)
              .single();
            
            if (painting) {
              hsCode = painting.hs_code || "";
              countryOfOrigin = painting.country_of_origin || "US";
              customsNotes = painting.international_shipping_notes || "";
            }
          } catch (paintingError) {
            console.error("Failed to fetch painting customs info:", paintingError);
          }
        }

        // Extract tax information from Stripe Tax calculation
        const taxAmount = session.total_details?.amount_tax 
          ? session.total_details.amount_tax / 100 
          : 0;
        const taxRate = taxAmount > 0 && session.amount_subtotal 
          ? taxAmount / (session.amount_subtotal / 100) 
          : undefined;
        const shippingCost = session.total_details?.amount_shipping 
          ? session.total_details.amount_shipping / 100 
          : parseFloat(metadata.shippingCost || "0");
        const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
        const price = session.amount_subtotal ? session.amount_subtotal / 100 : parseFloat(metadata.price || metadata.totalAmount || "0");

        // Create order in Supabase with all new fields
        const orderNumber = metadata.order_number || generateOrderNumber();

        const orderData = {
          order_number: orderNumber,
          customer_email: session.customer_email || session.customer_details?.email || "",
          customer_name: metadata.customerName || session.customer_details?.name || "Customer",
          customer_phone: metadata.customerPhone || session.customer_details?.phone || "",
          billing_address: "",
          shipping_address: metadata.shippingAddress || (metadata.shippingMethod === "Studio Pickup (Minneapolis)" ? "Studio Pickup" : "Direct Studio Order"),
          country: metadata.country || session.customer_details?.address?.country || "US",
          
          // Product information - provide non-null defaults to satisfy database constraints
          painting_id: isStudioPayment ? "studio-payment" : (metadata.paintingId || "custom"),
          painting_title: isStudioPayment ? (metadata.description || "Studio Purchase") : (metadata.paintingTitle || "Untitled"),
          edition: isStudioPayment ? "Original / Custom" : (metadata.edition || "Original"),
          size_label: isStudioPayment ? "Custom" : (metadata.sizeLabel || "Custom"),
          dimensions: isStudioPayment ? "N/A" : (metadata.dimensions || "N/A"),
          product_type: (isStudioPayment ? "studio" : "reproduction") as "studio" | "reproduction" | "original",
          description: metadata.description || (isStudioPayment ? "Studio Purchase" : ""),
          
          // Pricing - extracted from Stripe session
          price,
          tax_amount: taxAmount,
          tax_rate: taxRate,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          
          // Tax exemption
          tax_exempt: metadata.taxExempt === "true",
          exemption_reason: metadata.exemptionReason || "",
          exemption_reference: "",
          exemption_date: undefined,
          
          // Payment
          payment_method: "stripe" as const,
          payment_id: session.payment_intent as string,
          payment_status: "paid" as const,
          payment_plan: (metadata.paymentPlan as "full" | "3month") || "full",
          
          // Shipping
          shipping_method: metadata.shippingMethod || "",
          shipping_service_code: metadata.shippingServiceCode || "",
          shipping_carrier_code: metadata.shippingCarrierCode || "",
          shipping_rate_id: metadata.shippingRateId || "",
          tracking_number: "",
          date_shipped: undefined,
          delivery_status: "",
          delivery_date: undefined,
          
          // Order source
          order_source: (isStudioPayment ? "studio" : "website") as "studio" | "website",
          
          // International customs
          hs_code: hsCode,
          country_of_origin: countryOfOrigin,
          declared_value: undefined,
          customs_notes: customsNotes,
          
          // Metadata
          stripe_session_id: session.id,
          notes: isStudioPayment ? "Studio payment" : "",
        };

        try {
          const order = await createOrder(orderData);
          if (order) {
            console.log("Order created successfully:", order.order_number);
          } else {
            console.error("createOrder returned null for session:", session.id);
          }
        } catch (orderError) {
          console.error("Failed to create order:", orderError);
          // Don't fail the webhook - log the error but continue
        }

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Invoice paid: ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.error(`Payment failed for invoice ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
