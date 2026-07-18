import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    console.log("Environment check:", {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasPayPalId: !!process.env.PAYPAL_CLIENT_ID,
      hasPayPalSecret: !!process.env.PAYPAL_CLIENT_SECRET,
    });
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Payment not configured - Missing STRIPE_SECRET_KEY" }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });

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

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${paintingTitle} - ${sizeLabel}`,
              description: `${edition} - ${dimensions}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        paintingId,
        paintingTitle,
        edition,
        sizeLabel,
        dimensions,
        customerName,
        shippingAddress,
        paymentPlan,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Stripe checkout session created:", session.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
