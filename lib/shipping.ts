// Shipping cost calculation system using ShipEngine API
// Live rate shopping for USPS and UPS shipping

export interface ShippingAddress {
  country: string;
  state?: string;
  postalCode?: string;
  city?: string;
}

export interface ShippingRate {
  method: string;
  cost: number;
  estimatedDays: string;
  serviceCode?: string;
  carrierCode?: string;
  rateId?: string;
}

export interface ShippingQuote {
  rates: ShippingRate[];
  selectedRate?: ShippingRate;
}

// API route for shipping rates
const SHIPPING_API_URL = "/api/shipping/rates";

// Studio pickup option
const STUDIO_PICKUP = [
  { method: "Studio Pickup (Minneapolis)", cost: 0, estimatedDays: "Immediate" },
];

// Call internal API route to get shipping rates from ShipEngine
async function getShipEngineRates(
  destinationAddress: ShippingAddress,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): Promise<ShippingRate[]> {
  try {
    const response = await fetch(SHIPPING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: destinationAddress.country,
        state: destinationAddress.state,
        postalCode: destinationAddress.postalCode,
        city: destinationAddress.city,
        orderType,
        orderTotal,
      }),
    });

    if (!response.ok) {
      console.error("Shipping API error:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.rates || [];
  } catch (error) {
    console.error("Error calling shipping API:", error);
    return [];
  }
}

export const DOMESTIC_REPRODUCTION_SHIPPING_RATE: ShippingRate = {
  method: "Shipping & Packaging",
  cost: 14.99,
  estimatedDays: "7–10 business days",
};

// Get shipping rates based on address and order type
export async function getShippingRates(
  address: ShippingAddress,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): Promise<ShippingQuote> {
  // International orders require case-by-case personalized quotation
  if (address.country && address.country !== "US") {
    return { rates: [] };
  }

  // Domestic U.S. Limited Editions:
  // Flat $14.99 shipping & packaging per reproduction across all sizes (16×22", 24×32", 26×34")
  // Direct shipment from printer after artist inspection and hand-signed COA
  if (orderType === "website") {
    return {
      rates: [DOMESTIC_REPRODUCTION_SHIPPING_RATE],
      selectedRate: DOMESTIC_REPRODUCTION_SHIPPING_RATE,
    };
  }

  // Studio custom payments: check ShipEngine rates or default to studio pickup
  const rates = await getShipEngineRates(address, orderType, orderTotal);
  if (rates.length === 0) {
    return {
      rates: [
        { method: "Studio Pickup (Minneapolis)", cost: 0, estimatedDays: "Immediate" },
      ],
    };
  }

  return { rates };
}

// Check if address is local (Minneapolis area)
function isLocalAddress(address: ShippingAddress): boolean {
  return address.country === "US" && 
         (address.state === "MN" || address.state === "Minnesota");
}

// Get default shipping rate (cheapest option)
export async function getDefaultShippingRate(
  address: ShippingAddress,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): Promise<ShippingRate | null> {
  const quote = await getShippingRates(address, orderType, orderTotal);
  if (quote.rates.length === 0) return null;
  
  // Return the cheapest available rate
  return quote.rates.reduce((cheapest, current) => 
    current.cost < cheapest.cost ? current : cheapest
  );
}

// Calculate shipping cost
export async function calculateShippingCost(
  address: ShippingAddress,
  method: string,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): Promise<number> {
  const quote = await getShippingRates(address, orderType, orderTotal);
  const rate = quote.rates.find(r => r.method === method);
  return rate?.cost || 0;
}

// Validate shipping address
export function validateShippingAddress(address: Partial<ShippingAddress>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!address.country) {
    errors.push("Country is required");
  }

  if (address.country === "US" && !address.state) {
    errors.push("State is required for US addresses");
  }

  if (!address.postalCode) {
    errors.push("Postal code is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
