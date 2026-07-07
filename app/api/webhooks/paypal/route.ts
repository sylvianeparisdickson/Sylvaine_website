import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, getOrderByPaymentId } from "@/lib/pocketbase";
import crypto from "crypto";

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;
const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";

async function verifyPayPalWebhook(headers: Headers, body: string): Promise<boolean> {
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
        
        // Get order from PocketBase
        const order = await getOrderByPaymentId(paymentId);
        
        if (order) {
          // Update order status to paid
          await updateOrderStatus(order.id, "paid");
          console.log(`Order ${order.id} paid via PayPal`);
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
