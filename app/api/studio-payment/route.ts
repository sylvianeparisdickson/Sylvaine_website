import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Payment not configured - Missing STRIPE_SECRET_KEY" }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });

    const body = await req.json();
    const { amount, description } = body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount. Must be greater than 0." }, { status: 400 });
    }

    // Convert to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description || "Studio Purchase",
              description: description || "Custom studio purchase",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/studio-payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/studio-payment/cancel`,
      metadata: {
        type: "studio_payment",
        description: description || "",
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Studio payment checkout session created:", session.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Studio payment checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
