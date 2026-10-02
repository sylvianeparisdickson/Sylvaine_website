import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createOrder } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if order already exists in Supabase
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        order: existingOrder,
        alreadyProcessed: true,
      });
    }

    // If session is paid but not yet in Supabase, create it now (fallback for delayed/missed webhook)
    if (session.payment_status === "paid" || session.status === "complete") {
      const metadata = session.metadata || {};
      const isStudioPayment = metadata.type === "studio_payment";

      const taxAmount = session.total_details?.amount_tax 
        ? session.total_details.amount_tax / 100 
        : 0;
      const shippingCost = session.total_details?.amount_shipping 
        ? session.total_details.amount_shipping / 100 
        : parseFloat(metadata.shippingCost || "0");
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
      const price = session.amount_subtotal ? session.amount_subtotal / 100 : totalAmount;

      const orderNumber = metadata.order_number || `ORD-${Date.now()}`;

      const orderData = {
        order_number: orderNumber,
        customer_email: session.customer_email || session.customer_details?.email || "",
        customer_name: metadata.customerName || session.customer_details?.name || "Customer",
        customer_phone: metadata.customerPhone || session.customer_details?.phone || "",
        billing_address: "",
        shipping_address: metadata.shippingAddress || (metadata.shippingMethod === "Studio Pickup (Minneapolis)" ? "Studio Pickup" : "Direct Studio Order"),
        country: metadata.country || session.customer_details?.address?.country || "US",
        
        // Product information
        painting_id: isStudioPayment ? "studio-payment" : (metadata.paintingId || "custom"),
        painting_title: isStudioPayment ? (metadata.description || "Studio Purchase") : (metadata.paintingTitle || "Untitled"),
        edition: isStudioPayment ? "Original / Custom" : (metadata.edition || "Original"),
        size_label: isStudioPayment ? "Custom" : (metadata.sizeLabel || "Custom"),
        dimensions: isStudioPayment ? "N/A" : (metadata.dimensions || "N/A"),
        product_type: (isStudioPayment ? "studio" : "reproduction") as "studio" | "reproduction" | "original",
        description: metadata.description || (isStudioPayment ? "Studio Purchase" : ""),
        
        // Pricing
        price,
        tax_amount: taxAmount,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        
        // Tax exemption
        tax_exempt: metadata.taxExempt === "true",
        exemption_reason: metadata.exemptionReason || "",
        
        // Payment
        payment_method: "stripe" as const,
        payment_id: (session.payment_intent as string) || session.id,
        payment_status: "paid" as const,
        payment_plan: (metadata.paymentPlan as "full" | "3month") || "full",
        
        // Shipping
        shipping_method: metadata.shippingMethod || "Studio Pickup",
        
        // Order source
        order_source: (isStudioPayment ? "studio" : "website") as "studio" | "website",
        
        // Metadata
        stripe_session_id: session.id,
        notes: isStudioPayment ? "Studio payment (reconciled on success page)" : "",
      };

      const created = await createOrder(orderData);
      return NextResponse.json({
        success: true,
        order: created || orderData,
        newlyCreated: true,
      });
    }

    return NextResponse.json({
      success: false,
      status: session.payment_status,
      message: "Payment not completed yet",
    });
  } catch (error) {
    console.error("Confirm studio payment error:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
