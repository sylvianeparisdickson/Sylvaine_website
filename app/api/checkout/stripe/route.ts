import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "@/lib/pocketbase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  try {
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

    // Create order record in PocketBase
    await createOrder({
      customerEmail,
      customerName,
      paintingId,
      paintingTitle,
      edition,
      sizeLabel,
      dimensions,
      price,
      paymentMethod: "stripe",
      paymentId: session.id,
      status: "pending",
      paymentPlan: paymentPlan as "full" | "3month",
      shippingAddress,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
