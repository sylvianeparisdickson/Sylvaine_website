import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createOrder } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === "live" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    const paymentMethod = searchParams.get("payment_method");
    const token = searchParams.get("token"); // PayPal order ID

    // ==========================================
    // 1. STRIPE CHECKOUT RECONCILIATION
    // ==========================================
    if (sessionId) {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2026-06-24.dahlia",
      });

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

      // If session is paid, create the order if missed by webhook
      if (session.payment_status === "paid" || session.status === "complete") {
        const metadata = session.metadata || {};

        const shippingCost = session.total_details?.amount_shipping 
          ? session.total_details.amount_shipping / 100 
          : parseFloat(metadata.shippingCost || "0");
        const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
        const price = session.amount_subtotal ? session.amount_subtotal / 100 : totalAmount;
        
        const taxAmount = session.total_details?.amount_tax 
          ? session.total_details.amount_tax / 100 
          : 0;
        const taxRate = taxAmount > 0 && price > 0 ? Number((taxAmount / price).toFixed(4)) : 0;
        const isTaxExempt = metadata.taxExempt === "true";

        const orderNumber = metadata.order_number || `ORD-${Date.now()}`;

        const billingAddressStr = session.customer_details?.address ? [
          session.customer_details.address.line1,
          session.customer_details.address.line2,
          session.customer_details.address.city,
          session.customer_details.address.state,
          session.customer_details.address.postal_code,
          session.customer_details.address.country
        ].filter(Boolean).join(", ") : (metadata.billingAddress || "");

        const sessionWithShipping = session as unknown as { shipping_details?: { address?: Stripe.Address } };
        const shippingAddressStr = metadata.shippingAddress || (sessionWithShipping.shipping_details?.address ? [
          sessionWithShipping.shipping_details.address.line1,
          sessionWithShipping.shipping_details.address.line2,
          sessionWithShipping.shipping_details.address.city,
          sessionWithShipping.shipping_details.address.state,
          sessionWithShipping.shipping_details.address.postal_code,
          sessionWithShipping.shipping_details.address.country
        ].filter(Boolean).join(", ") : (metadata.shippingMethod === "Studio Pickup (Minneapolis)" ? "Studio Pickup (1500 Jackson St NE, Studio 439, Minneapolis, MN 55413)" : "Provided during checkout"));

        const orderData = {
          order_number: orderNumber,
          customer_email: session.customer_email || session.customer_details?.email || "",
          customer_name: metadata.customerName || session.customer_details?.name || "Customer",
          customer_phone: metadata.customerPhone || session.customer_details?.phone || "",
          billing_address: billingAddressStr,
          shipping_address: shippingAddressStr,
          country: metadata.country || session.customer_details?.address?.country || "US",
          
          // Product information
          painting_id: metadata.paintingId || "custom",
          painting_title: metadata.paintingTitle || "Limited Edition Reproduction",
          edition: metadata.edition || "Limited Edition",
          size_label: metadata.sizeLabel || "Standard",
          dimensions: metadata.dimensions || "N/A",
          product_type: "reproduction" as const,
          description: `${metadata.paintingTitle || "Artwork"} - ${metadata.edition || "Edition"} (${metadata.sizeLabel || ""})`,
          
          // Pricing
          price,
          tax_amount: taxAmount,
          tax_rate: taxRate,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          
          // Tax exemption
          tax_exempt: isTaxExempt,
          exemption_reason: isTaxExempt ? (metadata.exemptionReason || "") : undefined,
          exemption_reference: isTaxExempt ? (metadata.exemptionReference || "") : undefined,
          exemption_date: isTaxExempt ? (metadata.exemptionDate || new Date().toISOString()) : undefined,
          
          // Payment
          payment_method: "stripe" as const,
          payment_id: (session.payment_intent as string) || session.id,
          payment_status: "paid" as const,
          payment_plan: (metadata.paymentPlan as "full" | "3month") || "full",
          
          // Shipping
          shipping_method: metadata.shippingMethod || "Standard Shipping",
          
          // Order source
          order_source: "website" as const,
          
          // Metadata
          stripe_session_id: session.id,
          notes: "Website checkout (reconciled on success page)",
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
        message: "Payment not completed",
      });
    }

    // ==========================================
    // 2. PAYPAL CHECKOUT RECONCILIATION
    // ==========================================
    if (paymentMethod === "paypal" && token) {
      if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
        return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
      }

      const accessToken = await getPayPalAccessToken();

      // Check order status on PayPal
      const checkRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const orderDetails = await checkRes.json();

      let captureData = orderDetails;

      // If order is APPROVED, capture it now
      if (orderDetails.status === "APPROVED") {
        const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        captureData = await captureRes.json();
      }

      // Check if order already recorded in Supabase
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("payment_id", token)
        .maybeSingle();

      if (existingOrder) {
        return NextResponse.json({
          success: true,
          order: existingOrder,
          alreadyProcessed: true,
        });
      }

      const purchaseUnit = captureData.purchase_units?.[0] || orderDetails.purchase_units?.[0];
      const captureItem = purchaseUnit?.payments?.captures?.[0];
      const isPaid = captureData.status === "COMPLETED" || captureItem?.status === "COMPLETED";

      if (isPaid) {
        const amount = purchaseUnit?.amount;
        const item = purchaseUnit?.items?.[0];
        const shipping = purchaseUnit?.shipping;

        const payerAddress = orderDetails.payer?.address ? [
          orderDetails.payer.address.address_line_1,
          orderDetails.payer.address.admin_area_2,
          orderDetails.payer.address.admin_area_1,
          orderDetails.payer.address.postal_code,
          orderDetails.payer.address.country_code
        ].filter(Boolean).join(", ") : "";

        const paypalPrice = amount?.breakdown?.item_total?.value ? parseFloat(amount.breakdown.item_total.value) : parseFloat(amount?.value || "0");
        const paypalShipping = amount?.breakdown?.shipping?.value ? parseFloat(amount.breakdown.shipping.value) : 0;
        const paypalTax = amount?.breakdown?.tax_total?.value ? parseFloat(amount.breakdown.tax_total.value) : 0;
        const paypalTaxRate = paypalTax > 0 && paypalPrice > 0 ? Number((paypalTax / paypalPrice).toFixed(4)) : 0;

        const orderData = {
          order_number: `ORD-${Date.now()}`,
          customer_email: shipping?.address?.email_address || orderDetails.payer?.email_address || "",
          customer_name: shipping?.name?.full_name || `${orderDetails.payer?.name?.given_name || ""} ${orderDetails.payer?.name?.surname || ""}`.trim() || "Customer",
          customer_phone: orderDetails.payer?.phone?.phone_number?.national_number || "",
          billing_address: payerAddress,
          shipping_address: shipping?.address ? [
            shipping.address.address_line_1,
            shipping.address.address_line_2,
            shipping.address.admin_area_2,
            shipping.address.admin_area_1,
            shipping.address.postal_code,
            shipping.address.country_code
          ].filter(Boolean).join(", ") : "PayPal Address",
          country: shipping?.address?.country_code || "US",
          
          painting_id: purchaseUnit?.reference_id || "limited-edition",
          painting_title: item?.name || purchaseUnit?.description || "Limited Edition Reproduction",
          edition: item?.description?.split(" - ")[0] || "Limited Edition",
          size_label: item?.name?.split(" - ")[1] || "Custom",
          dimensions: item?.description?.split(" - ")[1] || "N/A",
          product_type: "reproduction" as const,
          description: item?.description || purchaseUnit?.description || "Artwork Purchase",
          
          price: paypalPrice,
          tax_amount: paypalTax,
          tax_rate: paypalTaxRate,
          shipping_cost: paypalShipping,
          total_amount: parseFloat(amount?.value || "0"),
          
          payment_method: "paypal" as const,
          payment_id: captureItem?.id || token,
          payment_status: "paid" as const,
          payment_plan: "full" as const,
          shipping_method: "Standard Shipping",
          order_source: "website" as const,
          notes: "PayPal website checkout (captured on success page)",
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
        status: captureData.status,
        message: "PayPal payment could not be captured",
      });
    }

    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  } catch (error) {
    console.error("Confirm checkout error:", error);
    return NextResponse.json(
      { error: "Failed to confirm checkout", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
