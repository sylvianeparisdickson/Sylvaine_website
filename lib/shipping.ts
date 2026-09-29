// Shipping cost calculation system
// This is a simple, extensible system for calculating shipping costs
// Can be extended with carrier integrations in the future

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
}

export interface ShippingQuote {
  rates: ShippingRate[];
  selectedRate?: ShippingRate;
}

// Simple shipping rate configuration
// This can be moved to a database table for dynamic management
const SHIPPING_RATES = {
  // Domestic US shipping
  US: {
    domestic: [
      { method: "UPS Ground", cost: 15, estimatedDays: "3-5 business days" },
      { method: "UPS 2nd Day Air", cost: 35, estimatedDays: "2 business days" },
      { method: "UPS Next Day Air", cost: 55, estimatedDays: "1 business day" },
    ],
    studio_pickup: [
      { method: "Studio Pickup (Minneapolis)", cost: 0, estimatedDays: "Immediate" },
    ],
  },
  // International shipping (base rates - can be refined by country)
  international: {
    Canada: [
      { method: "UPS Standard to Canada", cost: 45, estimatedDays: "5-7 business days" },
      { method: "UPS Express to Canada", cost: 75, estimatedDays: "2-3 business days" },
    ],
    other: [
      { method: "UPS Worldwide Express", cost: 85, estimatedDays: "3-5 business days" },
      { method: "UPS Worldwide Saver", cost: 65, estimatedDays: "5-7 business days" },
    ],
  },
};

// Get shipping rates based on address and order type
export function getShippingRates(
  address: ShippingAddress,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): ShippingQuote {
  const rates: ShippingRate[] = [];

  // Studio pickup option for studio orders or local customers
  if (orderType === "studio" || isLocalAddress(address)) {
    rates.push(...SHIPPING_RATES.US.studio_pickup);
  }

  // Domestic US shipping
  if (address.country === "US") {
    // Free shipping for orders over $500 (can be configured)
    if (orderTotal >= 500) {
      rates.push({
        method: "Free Shipping (UPS Ground)",
        cost: 0,
        estimatedDays: "3-5 business days",
      });
    } else {
      rates.push(...SHIPPING_RATES.US.domestic);
    }
  }
  // Canada
  else if (address.country === "CA") {
    rates.push(...SHIPPING_RATES.international.Canada);
  }
  // Other international
  else {
    rates.push(...SHIPPING_RATES.international.other);
  }

  return { rates };
}

// Check if address is local (Minneapolis area)
function isLocalAddress(address: ShippingAddress): boolean {
  return address.country === "US" && 
         (address.state === "MN" || address.state === "Minnesota");
}

// Get default shipping rate (cheapest option)
export function getDefaultShippingRate(
  address: ShippingAddress,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): ShippingRate | null {
  const quote = getShippingRates(address, orderType, orderTotal);
  if (quote.rates.length === 0) return null;
  
  // Return the cheapest rate (excluding free shipping if order is under threshold)
  return quote.rates.reduce((cheapest, current) => 
    current.cost < cheapest.cost ? current : cheapest
  );
}

// Calculate shipping cost
export function calculateShippingCost(
  address: ShippingAddress,
  method: string,
  orderType: "website" | "studio" = "website",
  orderTotal: number = 0
): number {
  const quote = getShippingRates(address, orderType, orderTotal);
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
