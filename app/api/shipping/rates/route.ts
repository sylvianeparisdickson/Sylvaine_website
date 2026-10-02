import { NextRequest, NextResponse } from "next/server";

const SHIPENGINE_API_KEY = process.env.SHIPENGINE_API_KEY;
const SHIPENGINE_API_URL = "https://api.shipengine.com/v1/rates";

// Studio origin address
const ORIGIN_ADDRESS = {
  name: "Sylviane Dickson",
  phone: "",
  addressLine1: "1321 W 82ND ST APT C",
  cityLocality: "Bloomington",
  stateProvince: "MN",
  postalCode: "55420-2188",
  countryCode: "US",
};

// Placeholder package dimensions
const PACKAGE_WEIGHT = 5; // pounds
const PACKAGE_DIMENSIONS = {
  length: 20,
  width: 16,
  height: 2,
}; // inches

export async function POST(req: NextRequest) {
  try {
    if (!SHIPENGINE_API_KEY) {
      return NextResponse.json({ error: "ShipEngine API key not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { country, state, postalCode, city, orderType = "website", orderTotal = 0 } = body;

    console.log("Shipping rates request:", { country, state, postalCode, city, orderType, orderTotal });

    // International orders require case-by-case personalized quotation
    if (country && country !== "US") {
      return NextResponse.json({
        rates: [],
        international: true,
        message: "International shipments are handled on a case-by-case basis rather than through automatic checkout rates. Please contact us for a personalized quotation."
      });
    }

    // Studio pickup option
    const studioPickup = [
      { method: "Studio Pickup (Minneapolis)", cost: 0, estimatedDays: "Immediate" },
    ];

    // Check if local address for studio pickup
    const isLocal = country === "US" && (state === "MN" || state === "Minnesota");
    const rates: any[] = [];

    if (orderType === "studio" || isLocal) {
      rates.push(...studioPickup);
    }

    // Call ShipEngine API
    const requestBody = {
      rate_options: {
        carrier_ids: [],
      },
      shipment: {
        shipFrom: ORIGIN_ADDRESS,
        shipTo: {
          name: "Customer",
          addressLine1: city || "",
          cityLocality: city || "",
          stateProvince: state || "",
          postalCode: postalCode || "",
          countryCode: country,
        },
        packages: [
          {
            weight: {
              value: PACKAGE_WEIGHT,
              unit: "ounce",
            },
            dimensions: {
              length: PACKAGE_DIMENSIONS.length,
              width: PACKAGE_DIMENSIONS.width,
              height: PACKAGE_DIMENSIONS.height,
              unit: "inch",
            },
          },
        ],
      },
    };

    console.log("ShipEngine request:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(SHIPENGINE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": SHIPENGINE_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("ShipEngine response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ShipEngine API error:", errorText);
      return NextResponse.json({ error: "Failed to get shipping rates from ShipEngine", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log("ShipEngine response:", JSON.stringify(data, null, 2));

    if (!data.rate_response || !data.rate_response.rates || data.rate_response.rates.length === 0) {
      console.error("No rates in ShipEngine response");
      return NextResponse.json({ error: "No shipping rates available" }, { status: 404 });
    }

    // Convert ShipEngine response
    const liveRates = data.rate_response.rates.map((rate: any) => ({
      method: rate.service_type,
      cost: rate.shipping_amount.amount,
      estimatedDays: rate.delivery_days 
        ? `${rate.delivery_days} business days` 
        : rate.estimated_delivery_date 
          ? `Est. ${new Date(rate.estimated_delivery_date).toLocaleDateString()}` 
          : "Delivery estimate unavailable",
      serviceCode: rate.service_code,
      carrierCode: rate.carrier_code,
      rateId: rate.rate_id,
    }));

    rates.push(...liveRates);

    console.log("Final rates:", rates);

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Shipping rates error:", error);
    return NextResponse.json({ error: "Failed to get shipping rates" }, { status: 500 });
  }
}
