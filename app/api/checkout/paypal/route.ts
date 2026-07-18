import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  try {
    console.log("PayPal Environment check:", {
      hasPayPalId: !!process.env.PAYPAL_CLIENT_ID,
      hasPayPalSecret: !!process.env.PAYPAL_CLIENT_SECRET,
      hasPayPalMode: !!process.env.PAYPAL_MODE,
      paypalMode: process.env.PAYPAL_MODE,
    });
    
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ error: "Payment not configured - Missing PayPal credentials" }, { status: 503 });
    }

    const body = await req.json();
    const {
      paintingId,
      paintingTitle,
      edition,
      sizeLabel,
      dimensions,
      price,
      customerEmail,
      customerName,
      shippingAddress,
      paymentPlan = "full",
    } = body;

    // Validate required fields
    if (!paintingId || !paintingTitle || !edition || !price || !customerEmail || !customerName || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    // Calculate price based on payment plan
    let finalPrice = price;
    if (paymentPlan === "3month") {
      // PayPal doesn't support native 3-month plans like Stripe, so we charge full amount
      finalPrice = price;
    }

    // Create PayPal order
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: paintingId,
          description: `${paintingTitle} - ${sizeLabel}`,
          amount: {
            currency_code: "USD",
            value: finalPrice.toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            brand_name: "Sylviane Paris",
            locale: "en-US",
            landing_page: "NO_PREFERENCE",
            shipping_preference: "SET_PROVIDED_ADDRESS",
            user_action: "PAY_NOW",
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/cancel`,
          },
        },
      },
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paypalOrder),
    });

    const paypalOrderData = await response.json();

    if (!response.ok) {
      console.error("PayPal order creation error:", paypalOrderData);
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
    }

    console.log("PayPal order created:", paypalOrderData.id);

    return NextResponse.json({
      orderId: paypalOrderData.id,
      approvalUrl: paypalOrderData.links?.find((link: any) => link.rel === "approve")?.href
    });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
