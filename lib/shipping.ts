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

// Get shipping rates based on address and order type
export async function getShippingRates(
  address: ShippingAddress,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): Promise<ShippingQuote> {
  // Call the API route which handles ShipEngine integration
  const rates = await getShipEngineRates(address, orderType, orderTotal);
  
  if (rates.length === 0) {
    console.error("No shipping rates available");
    return { rates: [] };
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
