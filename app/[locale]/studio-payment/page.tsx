"use client";
import { useState, useEffect } from "react";
import { getShippingRates } from "@/lib/shipping";
import { useRouter } from "@/i18n/routing";

export default function StudioPaymentPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState<"US" | "CA" | "other">("US");
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [shippingQuote, setShippingQuote] = useState<{ method: string; cost: number; estimatedDays: string }[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Tax Exemption documentation state
  const [taxExempt, setTaxExempt] = useState(false);
  const [exemptionOrganization, setExemptionOrganization] = useState("");
  const [exemptionReference, setExemptionReference] = useState("");
  const [exemptionReason, setExemptionReason] = useState("Resale");

  // Calculate shipping when amount or address changes
  useEffect(() => {
    const fetchShippingRates = async () => {
      if (amount) {
        const amountNum = parseFloat(amount);
        const shippingRates = await getShippingRates({ country, state: address ? extractState(address) : undefined }, "studio", amountNum);
        setShippingQuote(shippingRates.rates);
        
        if (!selectedShippingMethod && shippingRates.rates.length > 0) {
          setSelectedShippingMethod(shippingRates.rates[0].method);
        }
        
        const shippingCost = selectedShippingMethod 
          ? shippingRates.rates.find(r => r.method === selectedShippingMethod)?.cost || 0
          : shippingRates.rates[0]?.cost || 0;
        
        setTotalAmount(amountNum + shippingCost);
      }
    };

    fetchShippingRates();
  }, [amount, address, country, selectedShippingMethod, paymentMethod]);

  const handleCreatePayment = async () => {
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (!customerName || customerName.trim() === "") {
      alert("Please enter your name");
      return;
    }

    if (!phone || phone.trim() === "") {
      alert("Please enter your phone number");
      return;
    }

    if (!address || address.trim() === "") {
      alert("Please enter your shipping address");
      return;
    }

    // Require valid documentation if claiming tax exemption
    if (taxExempt) {
      if (!exemptionOrganization.trim() || !exemptionReference.trim() || !exemptionReason.trim()) {
        alert("Tax exemption documentation is required by law. Please provide the organization name, certificate/permit number (e.g. Form ST3 / Resale ID), and exemption category.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = paymentMethod === "stripe" ? "/api/studio-payment" : "/api/studio-payment/paypal";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          description: description || undefined,
          email,
          customerName,
          phone,
          address,
          country,
          shippingMethod: selectedShippingMethod,
          taxExempt,
          exemptionOrganization: taxExempt ? exemptionOrganization.trim() : undefined,
          exemptionReference: taxExempt ? exemptionReference.trim() : undefined,
          exemptionReason: taxExempt ? exemptionReason.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error:", data);
        alert(`Payment creation failed: ${data.error || "Unknown error"}`);
        setLoading(false);
        return;
      }

      if (data.url) {
        setCheckoutUrl(data.url);
        setPaymentReady(true);
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

  const handlePay = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const handleReset = () => {
    setAmount("");
    setDescription("");
    setEmail("");
    setCustomerName("");
    setPhone("");
    setAddress("");
    setCountry("US");
    setSelectedShippingMethod("");
    setTaxExempt(false);
    setExemptionOrganization("");
    setExemptionReference("");
    setExemptionReason("Resale");
    setPaymentReady(false);
    setCheckoutUrl("");
    setShippingQuote([]);
    setTotalAmount(0);
  };

  const selectedShippingCost = selectedShippingMethod 
    ? shippingQuote.find(r => r.method === selectedShippingMethod)?.cost || 0
    : 0;

  if (paymentReady) {
    const amountNum = parseFloat(amount);
    return (
      <main className="min-h-screen bg-[#f8f5ef] p-4">
        <div className="max-w-md mx-auto pt-12">
          <div className="bg-white p-6 md:p-8">
            <h1 className="font-serif italic text-[28px] md:text-[32px] text-[#1a1816] mb-6 text-center">
              Payment Ready
            </h1>

            <div className="mb-8 text-center">
              <p className="font-serif italic text-[48px] md:text-[56px] text-[#1a1816] mb-2">
                ${amountNum.toFixed(2)}
              </p>
              {description && (
                <p className="text-[14px] text-[#6a6560]">{description}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-black/10 pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a6560]">Product</span>
                <span className="text-[#1a1816]">${amountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a6560]">Shipping</span>
                <span className="text-[#1a1816]">${selectedShippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold pt-2 border-t border-black/10">
                <span className="text-[#1a1816]">Subtotal</span>
                <span className="text-[#1a1816]">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="w-full px-6 py-4 bg-[#1a1816] text-white text-[12px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors mb-4"
            >
              Pay ${totalAmount.toFixed(2)} with {paymentMethod === "stripe" ? "Stripe" : "PayPal"}
            </button>

            <button
              onClick={handleReset}
              className="w-full px-6 py-4 bg-transparent text-[#1a1816] text-[12px] tracking-[.18em] uppercase border border-black/20 hover:border-[#1a1816] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="bg-white p-6 md:p-8">
          <h1 className="font-serif italic text-[28px] md:text-[32px] text-[#1a1816] mb-2 text-center">
            Studio Payment
          </h1>
          <p className="text-[11px] tracking-[.14em] uppercase text-[#9a9188] mb-8 text-center">
            Enter payment details
          </p>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif italic text-[20px] text-[#1a1816]">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-black/20 text-[20px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@email.com"
              required
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              required
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Shipping Address *
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Minneapolis, MN 55401"
              rows={2}
              required
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816] resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as "US" | "CA" | "other")}
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Card + reproduction 12 × 16"
              className="w-full px-4 py-3 bg-transparent border border-black/20 text-[14px] text-[#1a1816] outline-none focus:border-[#1a1816]"
            />
          </div>

          {/* Shipping Method Selection */}
          {shippingQuote.length > 0 && (
            <div className="mb-6">
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
                Shipping Method
              </label>
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

          {/* Tax Exemption Option with strict documentation validation */}
          <div className="mb-6 pt-4 border-t border-black/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={taxExempt}
                onChange={(e) => setTaxExempt(e.target.checked)}
                className="w-4 h-4 text-[#1a1816] rounded border-black/20 focus:ring-0"
              />
              <span className="text-[12px] text-[#1a1816] font-medium">This order is tax-exempt</span>
            </label>

            {taxExempt && (
              <div className="mt-3 p-4 bg-[#fcf9f5] border border-black/15 rounded space-y-3">
                <p className="text-[11px] text-[#8c4b22] font-medium leading-relaxed">
                  Exemption documentation is required by law and is subject to verification.
                </p>
                <div>
                  <label className="block text-[10px] tracking-[.14em] uppercase text-[#7a7269] mb-1">
                    Organization / Entity Name *
                  </label>
                  <input
                    type="text"
                    value={exemptionOrganization}
                    onChange={(e) => setExemptionOrganization(e.target.value)}
                    placeholder="Organization or Entity Legal Name"
                    required={taxExempt}
                    className="w-full px-3 py-2 bg-white border border-black/20 text-[13px] text-[#1a1816] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[.14em] uppercase text-[#7a7269] mb-1">
                    Exemption Documentation / Certificate / Tax ID *
                  </label>
                  <input
                    type="text"
                    value={exemptionReference}
                    onChange={(e) => setExemptionReference(e.target.value)}
                    placeholder="e.g. Exemption Certificate #, Resale Permit, or Tax ID"
                    required={taxExempt}
                    className="w-full px-3 py-2 bg-white border border-black/20 text-[13px] text-[#1a1816] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[.14em] uppercase text-[#7a7269] mb-1">
                    Reason for Exemption *
                  </label>
                  <select
                    value={exemptionReason}
                    onChange={(e) => setExemptionReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-black/20 text-[13px] text-[#1a1816] outline-none"
                  >
                    <option value="Purchased for Resale">Purchased for Resale</option>
                    <option value="Qualifying Non-profit Entity">Qualifying Non-profit Entity</option>
                    <option value="Government / Educational Entity">Government / Educational Entity</option>
                    <option value="Other Legally Qualifying Exemption">Other Legally Qualifying Exemption</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          {amount && (
            <div className="border-t border-black/10 pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a6560]">Product</span>
                <span className="text-[#1a1816]">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a6560]">Shipping</span>
                <span className="text-[#1a1816]">${selectedShippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6a6560]">Sales Tax</span>
                <span className="text-[#6a6560] italic text-[11px]">
                  {taxExempt 
                    ? "$0.00 (Documented Tax-Exempt)" 
                    : "Calculated at checkout based on delivery/pickup"}
                </span>
              </div>
              <div className="flex justify-between text-[14px] font-bold pt-2 border-t border-black/10">
                <span className="text-[#1a1816]">Subtotal + Shipping</span>
                <span className="text-[#1a1816]">
                  ${totalAmount.toFixed(2)}
                  {!taxExempt && <span className="text-[10px] font-normal text-[#9a9188] ml-1.5">(+ applicable tax)</span>}
                </span>
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">
              Payment Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="w-4 h-4"
                />
                <span className="text-[12px] text-[#1a1816]">Credit Card (Stripe)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="w-4 h-4"
                />
                <span className="text-[12px] text-[#1a1816]">PayPal</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCreatePayment}
            disabled={loading || !amount || !email || !customerName || !phone || !address}
            className="w-full px-6 py-4 bg-[#1a1816] text-white text-[12px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Payment..." : `Create Payment - $${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </main>
  );
}

// Helper function to extract state from address string
function extractState(address: string): string | undefined {
  const stateMatch = address.match(/(?:MN|Minnesota|WI|Wisconsin|IA|Iowa|ND|North Dakota|SD|South Dakota)/i);
  return stateMatch ? stateMatch[0] : undefined;
}
