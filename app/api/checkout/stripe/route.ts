import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getShippingRates } from "@/lib/shipping";

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
      customerPhone,
      billingAddress,
      shippingAddress,
      country = "US",
      taxExempt = false,
      exemptionReason = "",
      shippingMethod,
      paymentPlan = "full",
    } = body;

    // Validate required fields
    if (!paintingId || !paintingTitle || !edition || !price || !customerEmail || !customerName || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate shipping cost
    const shippingQuote = getShippingRates(
      { country, state: extractState(shippingAddress) },
      "website",
      price
    );
    
    const selectedShipping = shippingMethod 
      ? shippingQuote.rates.find(r => r.method === shippingMethod)
      : shippingQuote.rates[0];
    
    const shippingCost = selectedShipping?.cost || 0;

    // Stripe Tax will handle tax calculation automatically
    // We'll get the final tax amount from the session response
    const totalAmount = price + shippingCost; // Tax will be added by Stripe

    // Create Stripe checkout session with automatic tax
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${paintingTitle} - ${sizeLabel}`,
              description: `${edition} - ${dimensions}`,
              tax_code: "txcd_10000000", // Physical goods - general
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
      customer_creation: "always",
      automatic_tax: {
        enabled: !taxExempt, // Disable automatic tax for exempt customers
      },
      shipping_options: shippingQuote.rates.map(rate => ({
        shipping_rate_data: {
          display_name: rate.method,
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.round(rate.cost * 100),
            currency: "usd",
          },
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: parseEstimatedDays(rate.estimatedDays).min,
            },
            maximum: {
              unit: "business_day",
              value: parseEstimatedDays(rate.estimatedDays).max,
            },
          },
        },
      })),
      metadata: {
        paintingId,
        paintingTitle,
        edition,
        sizeLabel,
        dimensions,
        customerName,
        customerPhone: customerPhone || "",
        billingAddress: billingAddress || "",
        shippingAddress,
        country,
        taxExempt: taxExempt.toString(),
        exemptionReason: exemptionReason || "",
        shippingMethod: selectedShipping?.method || "",
        shippingCost: shippingCost.toString(),
        paymentPlan,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Extract tax information from the session
    const taxAmount = session.total_details?.amount_tax 
      ? session.total_details.amount_tax / 100 
      : 0;
    const taxRate = taxAmount > 0 && price > 0 ? taxAmount / price : 0;
    const finalTotal = session.amount_total ? session.amount_total / 100 : totalAmount;

    console.log("Stripe checkout session created:", session.id);

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      shippingQuote,
      taxAmount,
      taxRate,
      totalAmount,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

// Helper function to extract state from address string
function extractState(address: string): string | undefined {
  const stateMatch = address.match(/(?:MN|Minnesota|WI|Wisconsin|IA|Iowa|ND|North Dakota|SD|South Dakota)/i);
  return stateMatch ? stateMatch[0] : undefined;
}

// Parse estimated days string to min/max
function parseEstimatedDays(estimated: string): { min: number; max: number } {
  if (estimated.includes("Immediate")) return { min: 0, max: 0 };
  const match = estimated.match(/(\d+)-(\d+)/);
  if (match) {
    return { min: parseInt(match[1]), max: parseInt(match[2]) };
  }
  return { min: 3, max: 5 }; // Default
}
