import { NextRequest, NextResponse } from "next/server";
import { getShippingRates } from "@/lib/shipping";
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
      shippingMethod,
      paymentPlan = "full",
      taxExempt = false,
      exemptionOrganization,
      exemptionReference,
      exemptionReason,
    } = body;

    // Validate required fields
    if (!paintingId || !paintingTitle || !edition || !price || !customerEmail || !customerName || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (country && country !== "US") {
      return NextResponse.json(
        { error: "International shipping is arranged on a case-by-case basis. Please contact us for a quotation before completing your order." },
        { status: 400 }
      );
    }

    const isStudioPickup = shippingMethod === "Studio Pickup (Minneapolis)" || shippingAddress.toLowerCase().includes("studio pickup");

    // Calculate shipping cost
    const shippingQuote = await getShippingRates(
      { country, state: parseShippingAddress(shippingAddress).state },
      "website",
      price
    );
    
    const selectedShipping = isStudioPickup 
      ? { method: "Studio Pickup (Minneapolis)", cost: 0, estimatedDays: "Ready for pickup in 7–10 days" }
      : (shippingMethod ? shippingQuote.rates.find(r => r.method === shippingMethod) : shippingQuote.rates[0]);
    
    const shippingCost = selectedShipping?.cost || 0;

    // Calculate price based on payment plan
    let finalPrice = price;
    if (paymentPlan === "3month") {
      finalPrice = price;
    }

    // ========================================================
    // Real-Time Destination Sales Tax Calculation (Stripe Tax Engine)
    // ========================================================
    let taxAmount = 0;
    if (!taxExempt && country === "US" && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: "2026-06-24.dahlia" as any,
        });

        const taxAddress = isStudioPickup
          ? {
              line1: "1500 Jackson St NE",
              line2: "Studio 439",
              city: "Minneapolis",
              state: "MN",
              postal_code: "55413",
              country: "US",
            }
          : parseShippingAddress(shippingAddress);

        const calculation = await stripe.tax.calculations.create({
          currency: "usd",
          line_items: [
            {
              amount: Math.round(finalPrice * 100),
              reference: paintingId,
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
        console.error("Stripe Tax calculation for PayPal checkout failed:", taxErr);
      }
    }

    const totalAmount = finalPrice + shippingCost + taxAmount;
    const accessToken = await getPayPalAccessToken();
    const origin = req.headers.get("origin") || req.nextUrl.origin || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sylvianeparisart.com';

    // Create PayPal order with exact destination tax breakdown
    const paypalOrder = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: paintingId,
          description: `${paintingTitle} - ${sizeLabel}`,
          custom_id: JSON.stringify({
            taxExempt: !!taxExempt,
            taxAmount,
            shippingCost,
            price: finalPrice,
            exemptionRef: taxExempt ? (exemptionReference || "").slice(0, 30) : undefined,
          }).slice(0, 127),
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: finalPrice.toFixed(2),
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
              name: `${paintingTitle} - ${sizeLabel}`,
              description: `${edition} - ${dimensions}`,
              unit_amount: {
                currency_code: "USD",
                value: finalPrice.toFixed(2),
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
            return_url: `${origin}/checkout/success?payment_method=paypal`,
            cancel_url: `${origin}/checkout/cancel`,
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

    console.log("PayPal order created with tax:", {
      id: paypalOrderData.id,
      price: finalPrice,
      shippingCost,
      taxAmount,
      totalAmount,
    });

    const approvalUrl = paypalOrderData.links?.find((link: any) => link.rel === "approve")?.href ||
                       paypalOrderData.links?.find((link: any) => link.rel === "payer-action")?.href;

    if (!approvalUrl) {
      console.error("No approval URL found in links array");
      return NextResponse.json({ error: "No redirect URL returned" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: paypalOrderData.id,
      approvalUrl,
      shippingCost,
      taxAmount,
      totalAmount,
    });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
