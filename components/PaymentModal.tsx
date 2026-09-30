"use client";
import { useState, useEffect } from "react";
import { Painting } from "@/lib/data";
import { getShippingRates, type ShippingAddress } from "@/lib/shipping";

interface PaymentModalProps {
  painting: Painting;
  onClose: () => void;
}

export default function PaymentModal({ painting, onClose }: PaymentModalProps) {
  const [selectedEdition, setSelectedEdition] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // New state for tax/shipping
  const [country, setCountry] = useState<"US" | "CA" | "other">("US");
  const [taxExempt, setTaxExempt] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("");
  const [shippingQuote, setShippingQuote] = useState<{ method: string; cost: number; estimatedDays: string }[]>([]);
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const edition = painting.limitedEditions?.[selectedEdition];
  if (!edition) return null;

  const price = parseFloat(edition.price.replace("$", "").replace(",", ""));

  // Calculate shipping when form is shown
  useEffect(() => {
    if (showForm) {
      const form = document.getElementById("payment-form") as HTMLFormElement;
      
      const shippingRates = getShippingRates({ country }, "website", price);
      setShippingQuote(shippingRates.rates);
      
      if (!selectedShippingMethod && shippingRates.rates.length > 0) {
        setSelectedShippingMethod(shippingRates.rates[0].method);
      }
      
      const shippingCost = selectedShippingMethod 
        ? shippingRates.rates.find(r => r.method === selectedShippingMethod)?.cost || 0
        : shippingRates.rates[0]?.cost || 0;
      
      // Stripe Tax handles tax at checkout, PayPal needs client-side calculation
      if (paymentMethod === "paypal") {
        // PayPal: Tax will be calculated by Stripe Tax in the future
        // For now, set to 0 and let Stripe handle it when integrated
        setTaxRate(0);
        setTaxAmount(0);
        setTotalAmount(price + shippingCost);
      } else {
        // Stripe - tax calculated at checkout
        setTaxAmount(0);
        setTaxRate(0);
        setTotalAmount(price + shippingCost);
      }
    }
  }, [showForm, country, taxExempt, selectedShippingMethod, price, paymentMethod]);

  const handlePayment = async () => {
    if (!showForm) {
      setShowForm(true);
      return;
    }

    setLoading(true);

    const form = document.getElementById("payment-form") as HTMLFormElement;
    const formData = new FormData(form);
    
    const customerEmail = formData.get("email") as string;
    const customerName = formData.get("name") as string;
    const customerPhone = formData.get("phone") as string;
    const billingAddress = formData.get("billingAddress") as string;
    const shippingAddress = formData.get("address") as string;
    const exemptionReason = formData.get("exemptionReason") as string;

    if (!customerEmail || !customerName || !shippingAddress) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const checkoutData = {
      paintingId: painting.id,
      paintingTitle: painting.title,
      edition: edition.edition,
      sizeLabel: edition.sizeLabel,
      dimensions: edition.dimensions,
      price,
      customerEmail,
      customerName,
      customerPhone,
      billingAddress,
      shippingAddress,
      country,
      taxExempt,
      exemptionReason,
      shippingMethod: selectedShippingMethod,
      paymentPlan: "full",
    };

    try {
      const endpoint = paymentMethod === "stripe" ? "/api/checkout/stripe" : "/api/checkout/paypal";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        alert(`Payment failed: ${data.error || "Unknown error"}`);
        setLoading(false);
        return;
      }

      if (data.url || data.approvalUrl) {
        window.location.href = data.url || data.approvalUrl;
      } else {
        alert("Payment initialization failed: No redirect URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedShippingCost = selectedShippingMethod 
    ? shippingQuote.find(r => r.method === selectedShippingMethod)?.cost || 0
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,9,8,.9)" }}>
      <div className="bg-[#f8f5ef] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-serif italic text-[22px] md:text-[26px] text-[#1a1816] mb-2">{painting.title}</h2>
            <p className="text-[11px] tracking-[.14em] uppercase text-[#9a9188]">{edition.edition} · {edition.sizeLabel}</p>
          </div>
          <button onClick={onClose} className="text-[#9a9188] hover:text-[#1a1816] text-[24px]">×</button>
        </div>

        {painting.limitedEditions && painting.limitedEditions.length > 1 && (
          <div className="mb-6">
            <p className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">Select Edition</p>
            <div className="flex gap-2">
              {painting.limitedEditions.map((ed, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedEdition(idx)}
                  className={`px-4 py-2 text-[10px] tracking-[.12em] uppercase border transition-colors ${selectedEdition === idx ? "bg-[#1a1816] text-white border-[#1a1816]" : "bg-transparent text-[#1a1816] border-black/20 hover:border-[#1a1816]"}`}
                >
                  {ed.sizeLabel}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Price</p>
          <p className="font-serif italic text-[24px] text-[#1a1816]">${price.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <p className="text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-3">Payment Method</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod("stripe")}
              className={`flex-1 px-4 py-3 text-[10px] tracking-[.12em] uppercase border transition-colors ${paymentMethod === "stripe" ? "bg-[#1a1816] text-white border-[#1a1816]" : "bg-transparent text-[#1a1816] border-black/20 hover:border-[#1a1816]"}`}
            >
              Stripe
            </button>
            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`flex-1 px-4 py-3 text-[10px] tracking-[.12em] uppercase border transition-colors ${paymentMethod === "paypal" ? "bg-[#1a1816] text-white border-[#1a1816]" : "bg-transparent text-[#1a1816] border-black/20 hover:border-[#1a1816]"}`}
            >
              PayPal
            </button>
          </div>
        </div>

        {showForm && (
          <form id="payment-form" className="mb-6 space-y-4">
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Billing Address (optional)</label>
              <textarea
                name="billingAddress"
                rows={2}
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816] resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Shipping Address *</label>
              <textarea
                name="address"
                required
                rows={3}
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816] resize-none"
                placeholder="123 Main St, Minneapolis, MN 55401"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Country *</label>
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value as "US" | "CA" | "other")}
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Tax Exemption */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="taxExempt"
                checked={taxExempt}
                onChange={(e) => setTaxExempt(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="taxExempt" className="text-[11px] text-[#6a6560]">Tax Exempt</label>
            </div>
            
            {taxExempt && (
              <div>
                <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Exemption Reason</label>
                <input
                  type="text"
                  name="exemptionReason"
                  placeholder="e.g., Resale certificate #12345"
                  className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
                />
              </div>
            )}

            {/* Shipping Method Selection */}
            {shippingQuote.length > 0 && (
              <div>
                <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Shipping Method</label>
                <div className="space-y-2">
                  {shippingQuote.map((rate) => (
                    <label key={rate.method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={rate.method}
                        checked={selectedShippingMethod === rate.method}
                        onChange={(e) => setSelectedShippingMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="text-[12px] text-[#1a1816]">{rate.method}</p>
                        <p className="text-[10px] text-[#9a9188]">{rate.estimatedDays}</p>
                      </div>
                      <p className="text-[12px] text-[#1a1816]">${rate.cost.toFixed(2)}</p>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-black/10 pt-4 space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a6560]">Product</span>
                <span className="text-[#1a1816]">${price.toFixed(2)}</span>
              </div>
              {paymentMethod === "paypal" && taxAmount > 0 && (
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#6a6560]">Sales Tax ({(taxRate * 100).toFixed(2)}%)</span>
                  <span className="text-[#1a1816]">${taxAmount.toFixed(2)}</span>
                </div>
              )}
              {paymentMethod === "stripe" && (
                <div className="flex justify-between text-[12px] text-[#9a9188] italic">
                  <span>Sales Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              )}
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a6560]">Shipping</span>
                <span className="text-[#1a1816]">${selectedShippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold pt-2 border-t border-black/10">
                <span className="text-[#1a1816]">{paymentMethod === "stripe" ? "Subtotal" : "Total"}</span>
                <span className="text-[#1a1816]">${totalAmount.toFixed(2)}</span>
              </div>
              {paymentMethod === "stripe" && (
                <p className="text-[10px] text-[#9a9188] mt-2">
                  *Sales tax will be calculated based on your location at checkout
                </p>
              )}
            </div>
          </form>
        )}

        <div className="mb-6 text-[11px] text-[#6a6560] leading-relaxed">
          <p className="mb-2">Fulfillment Timeline:</p>
          <p>• 7-10 business days to receive from printer</p>
          <p>• Certificate of authenticity included</p>
          <p>• Signed by the artist</p>
          <p>• Shipped via UPS/FedEx</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full px-6 py-3 bg-[#1a1816] text-white text-[10px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : showForm ? `Pay $${totalAmount.toFixed(2)}` : "Continue to Checkout"}
        </button>
      </div>
    </div>
  );
}
