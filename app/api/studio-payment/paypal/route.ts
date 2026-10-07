import { NextRequest, NextResponse } from "next/server";
import { getShippingRates } from "@/lib/shipping";
import { createClient } from '@supabase/supabase-js';
import Stripe from "stripe";

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

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}-${random}`;
}

// Helper function to extract state and parse address
function parseShippingAddress(addressStr: string) {
  const zipMatch = addressStr.match(/\b\d{5}(?:-\d{4})?\b/);
  const stateMatch = addressStr.match(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|Minnesota|Wisconsin|Iowa|Illinois|North Dakota|South Dakota)\b/i);
  
  const parts = addressStr.split(',').map(p => p.trim());
  const line1 = parts[0] || addressStr;
  const city = parts.length > 2 ? parts[1] : (parts.length === 2 ? parts[0] : undefined);

  return {
    line1,
    city,
    state: stateMatch ? stateMatch[0] : "MN",
    postal_code: zipMatch ? zipMatch[0] : undefined,
    country: "US",
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return NextResponse.json({ error: "Payment not configured - Missing PayPal credentials" }, { status: 503 });
    }

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
      exemptionOrganization,
      exemptionReference,
      exemptionReason,
    } = body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount. Must be greater than 0." }, { status: 400 });
    }

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Insert email into newsletter_subscribers
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });
    
    if (dbError && dbError.code !== '23505') {
      console.error('Database error:', dbError);
    }

    const isStudioPickup = shippingMethod === "Studio Pickup (Minneapolis)" || (address && address.toLowerCase().includes("studio pickup"));

    // Calculate shipping for studio payments
    const shippingQuote = await getShippingRates(
      { country, state: address ? parseShippingAddress(address).state : undefined },
      "studio",
      amount
    );
    const selectedShipping = isStudioPickup
      ? { method: "Studio Pickup (Minneapolis)", cost: 0, estimatedDays: "Ready immediately" }
      : (shippingMethod ? shippingQuote.rates.find(r => r.method === shippingMethod) : shippingQuote.rates[0]);
    
    const shippingCost = selectedShipping?.cost || 0;

    // ========================================================
    // Real-Time Destination Sales Tax Calculation (Stripe Tax Engine)
    // Sourced to Minneapolis Studio (9.025%) for pickup or physical studio sales
    // ========================================================
    let taxAmount = 0;
    if (!taxExempt && country === "US" && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2026-06-24.dahlia" as any,
        });

        const taxAddress = isStudioPickup || !address
          ? {
              line1: "1500 Jackson St NE",
              line2: "Studio 439",
              city: "Minneapolis",
              state: "MN",
              postal_code: "55413",
              country: "US",
            }
          : parseShippingAddress(address);

        const calculation = await stripe.tax.calculations.create({
          currency: "usd",
          line_items: [
            {
              amount: Math.round(amount * 100),
              reference: "studio-payment",
              tax_code: "txcd_99999999", // Tangible goods
              tax_behavior: "exclusive",
            },
          ],
          shipping_cost: {
            amount: Math.round(shippingCost * 100),
            tax_code: "txcd_92010001", // Shipping
            tax_behavior: "exclusive",
          },
          customer_details: {
            address: taxAddress,
            address_source: "shipping",
          },
        });

        taxAmount = (calculation.tax_amount_exclusive || 0) / 100;
      } catch (taxErr) {
        console.error("Stripe Tax calculation for Studio PayPal failed:", taxErr);
      }
    }

    const totalAmount = amount + shippingCost + taxAmount;
    const orderNumber = generateOrderNumber();
    const accessToken = await getPayPalAccessToken();

    const origin = req.headers.get("origin") || req.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sylvianeparisart.com';

    // Create PayPal order with exact destination tax breakdown
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: orderNumber,
          description: description || "Studio Purchase",
          custom_id: JSON.stringify({
            orderNumber,
            taxExempt: !!taxExempt,
            taxAmount,
            shippingCost,
            price: amount,
            exemptionRef: taxExempt ? (exemptionReference || "").slice(0, 30) : undefined,
          }).slice(0, 127),
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: amount.toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: shippingCost.toFixed(2),
              },
              ...(taxAmount > 0 ? {
                tax_total: {
                  currency_code: "USD",
                  value: taxAmount.toFixed(2),
                },
              } : {}),
            },
          },
          items: [
            {
              name: description || "Studio Purchase",
              description: description || "Custom studio purchase",
              unit_amount: {
                currency_code: "USD",
                value: amount.toFixed(2),
              },
              ...(taxAmount > 0 ? {
                tax: {
                  currency_code: "USD",
                  value: taxAmount.toFixed(2),
                },
              } : {}),
              quantity: "1",
            },
          ],
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
            return_url: `${origin}/studio-payment/success?payment_method=paypal&order_number=${orderNumber}`,
            cancel_url: `${origin}/studio-payment/cancel`,
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
      console.error("PayPal studio payment order creation error:", paypalOrderData);
      return NextResponse.json({ error: "Failed to create PayPal order", details: paypalOrderData }, { status: 500 });
    }

    console.log("PayPal studio order created with tax:", {
      id: paypalOrderData.id,
      amount,
      shippingCost,
      taxAmount,
      totalAmount,
    });

    const approvalUrl = paypalOrderData.links?.find((link: any) => link.rel === "approve")?.href ||
                       paypalOrderData.links?.find((link: any) => link.rel === "payer-action")?.href;

    if (!approvalUrl) {
      return NextResponse.json({ error: "No redirect URL returned from PayPal" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: paypalOrderData.id,
      url: approvalUrl,
      orderNumber,
      shippingCost,
      taxAmount,
      totalAmount,
    });
  } catch (error) {
    console.error("PayPal studio payment error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Failed to create checkout session", details: errorMessage }, { status: 500 });
  }
}
