import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';
import { getShippingRates } from "@/lib/shipping";

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
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Payment not configured - Missing STRIPE_SECRET_KEY" }, { status: 503 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const body = await req.json();
    const { 
      amount, 
      description, 
      email, 
      customerName, 
      phone, 
      address, 
      country = "US",
      shippingMethod,
      taxExempt = false,
      exemptionReference,
      exemptionReason,
      exemptionOrganization,
    } = body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount. Must be greater than 0." }, { status: 400 });
    }

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Validate tax exemption documentation if claimed
    if (taxExempt && (!exemptionReference || !exemptionReason)) {
      return NextResponse.json(
        { error: "Tax exemption documentation required. Please provide a valid certificate or permit number and exemption category." },
        { status: 400 }
      );
    }

    // Insert email into newsletter_subscribers
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });
    
    if (dbError && dbError.code !== '23505') {
      // 23505 is duplicate key error, which is fine
      console.error('Database error:', dbError);
    }

    // Calculate shipping for studio payments
    const shippingQuote = await getShippingRates({ country, state: address ? extractState(address) : undefined }, "studio", amount);
    const selectedShipping = shippingMethod 
      ? shippingQuote.rates.find(r => r.method === shippingMethod)
      : shippingQuote.rates[0];
    const shippingCost = selectedShipping?.cost || 0;

    const totalAmount = amount + shippingCost; 

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Convert to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const origin = req.headers.get("origin") || req.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sylvianeparisart.com';

    // Studio Pickup check
    const isStudioPickup = !selectedShipping?.method || selectedShipping?.method.includes("Studio Pickup");

    // For Studio Pickup in Minneapolis, tax is sourced to the studio location (1500 Jackson St NE, Minneapolis, MN 55413)
    let customerId: string | undefined;
    if (isStudioPickup) {
      const customer = await stripe.customers.create({
        email,
        name: customerName,
        phone: phone || undefined,
        shipping: {
          name: customerName || "Studio Pickup - Minneapolis",
          address: {
            line1: "1500 Jackson St NE, Studio 439",
            city: "Minneapolis",
            state: "MN",
            postal_code: "55413",
            country: "US",
          },
        },
      });
      customerId = customer.id;
    }

    // Create Stripe checkout session with Stripe Tax
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      customer: customerId,
      customer_email: customerId ? undefined : email,
      customer_creation: customerId ? undefined : "always",
      line_items: [
        {
          price_data: {
            currency: "usd",
            tax_behavior: "exclusive",
            product_data: {
              name: description || "Studio Purchase",
              description: description || "Custom studio purchase",
              tax_code: "txcd_99999999", // Physical Goods (Tangible Personal Property)
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      automatic_tax: {
        enabled: !taxExempt,
      },
      success_url: `${origin}/studio-payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/studio-payment/cancel`,
      shipping_options: shippingQuote.rates.map(rate => ({
        shipping_rate_data: {
          display_name: rate.method,
          type: "fixed_amount",
          fixed_amount: {
            amount: Math.round(rate.cost * 100),
            currency: "usd",
          },
          tax_behavior: "exclusive",
          tax_code: "txcd_92010001", // Shipping/Delivery charges
        },
      })),
      metadata: {
        type: "studio_payment",
        order_number: orderNumber,
        description: description || "",
        customerName: customerName || "",
        customerPhone: phone || "",
        shippingAddress: isStudioPickup ? "Studio Pickup (1500 Jackson St NE, Studio 439, Minneapolis, MN 55413)" : (address || ""),
        country,
        shippingMethod: selectedShipping?.method || "Studio Pickup (Minneapolis)",
        shippingCost: shippingCost.toString(),
        shippingServiceCode: selectedShipping?.serviceCode || "",
        shippingCarrierCode: selectedShipping?.carrierCode || "",
        shippingRateId: selectedShipping?.rateId || "",
        taxExempt: taxExempt ? "true" : "false",
        exemptionReference: exemptionReference || "",
        exemptionReason: exemptionReason || "",
        exemptionOrganization: exemptionOrganization || "",
        exemptionDate: taxExempt ? new Date().toISOString() : "",
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Studio payment checkout session created:", session.id);

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      orderNumber,
      shippingQuote,
      totalAmount,
    });
  } catch (error) {
    console.error("Studio payment checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to create checkout session", details: errorMessage }, { status: 500 });
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
