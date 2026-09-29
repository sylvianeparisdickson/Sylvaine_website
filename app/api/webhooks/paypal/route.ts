import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createOrder } from "@/lib/supabase";

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}-${random}`;
}

// Format PayPal address to string
function formatPayPalAddress(address: any): string {
  if (!address) return "";
  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.admin_area_2,
    address.admin_area_1,
    address.postal_code,
  ].filter(Boolean);
  return parts.join(", ");
}

async function verifyPayPalWebhook(headers: Headers, body: string): Promise<boolean> {
  const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";
  const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
  
  if (!PAYPAL_WEBHOOK_ID) {
    return false;
  }

  const paypalApiUrl = PAYPAL_MODE === "live" 
    ? "https://api-m.paypal.com" 
    : "https://api-m.sandbox.paypal.com";

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${paypalApiUrl}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getPayPalAccessToken()}`,
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_id: headers.get("paypal-cert-id"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
  });

  const data = await response.json();
  return data.verification_status === "SUCCESS";
}

async function getPayPalAccessToken() {
  const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";
  const paypalApiUrl = PAYPAL_MODE === "live" 
    ? "https://api-m.paypal.com" 
    : "https://api-m.sandbox.paypal.com";

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
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

export async function POST(req: NextRequest) {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET || !process.env.PAYPAL_WEBHOOK_ID) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    const body = await req.text();
    const headers = req.headers;

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(headers, body);
    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const paymentId = event.resource.id;
        const purchaseUnit = event.resource.purchase_units?.[0];
        const amount = purchaseUnit?.amount;
        const item = purchaseUnit?.items?.[0];
        
        console.log("PayPal payment completed:", {
          paymentId,
          amount: amount?.value,
          currency: amount?.currency_code,
          breakdown: amount?.breakdown,
        });

        // Extract tax and shipping from PayPal breakdown
        const taxAmount = amount?.breakdown?.tax_total?.value 
          ? parseFloat(amount.breakdown.tax_total.value) 
          : 0;
        const shippingCost = amount?.breakdown?.shipping?.value 
          ? parseFloat(amount.breakdown.shipping.value) 
          : 0;
        const totalAmount = amount?.value ? parseFloat(amount.value) : 0;
        const price = amount?.breakdown?.item_total?.value 
          ? parseFloat(amount.breakdown.item_total.value) 
          : (item?.unit_amount?.value ? parseFloat(item.unit_amount.value) : 0);
        
        const taxRate = taxAmount > 0 && price > 0 ? taxAmount / price : undefined;

        // Create order in Supabase
        const orderData = {
          order_number: generateOrderNumber(),
          customer_email: purchaseUnit?.shipping?.address?.email_address || "",
          customer_name: purchaseUnit?.shipping?.name?.full_name || "",
          customer_phone: "",
          billing_address: "",
          shipping_address: formatPayPalAddress(purchaseUnit?.shipping?.address),
          country: purchaseUnit?.shipping?.address?.country_code || "US",
          
          // Product information from item description
          painting_id: purchaseUnit?.reference_id,
          painting_title: item?.name || "",
          edition: item?.description?.split(" - ")[0] || "",
          size_label: item?.name?.split(" - ")[1] || "",
          dimensions: item?.description?.split(" - ")[1] || "",
          product_type: "reproduction" as const,
          description: item?.description || "",
          
          // Pricing from PayPal
          price,
          tax_amount: taxAmount,
          tax_rate: taxRate,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          
          // Tax exemption
          tax_exempt: false,
          exemption_reason: "",
          exemption_reference: "",
          exemption_date: undefined,
          
          // Payment
          payment_method: "paypal" as const,
          payment_id: paymentId,
          payment_status: "paid" as const,
          payment_plan: "full" as const,
          
          // Shipping
          shipping_method: "standard",
          date_shipped: undefined,
          delivery_status: "",
          delivery_date: undefined,
          
          // Order source
          order_source: "website" as const,
          
          // Customs
          hs_code: "",
          country_of_origin: "US",
          declared_value: price,
          customs_notes: "",
          
          // Stripe session ID (not applicable for PayPal)
          stripe_session_id: "",
          
          // Notes
          notes: "",
        };

        try {
          const order = await createOrder(orderData);
          console.log("PayPal order created successfully:", order?.order_number);
        } catch (orderError) {
          console.error("Failed to create PayPal order:", orderError);
        }
        break;
      }

      case "PAYMENT.CAPTURE.DENIED": {
        const paymentId = event.resource.id;
        console.error(`Payment denied for PayPal order ${paymentId}`);
        break;
      }

      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
