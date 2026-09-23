"use client";
import { useState } from "react";

export default function StudioPaymentPage() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const handleCreatePayment = async () => {
    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/studio-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountNum,
          description: description || undefined,
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
    setPaymentReady(false);
    setCheckoutUrl("");
  };

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

            <button
              onClick={handlePay}
              className="w-full px-6 py-4 bg-[#1a1816] text-white text-[12px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors mb-4"
            >
              Pay Securely with Stripe
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
            Enter payment amount
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

          <div className="mb-8">
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

          <button
            onClick={handleCreatePayment}
            disabled={loading}
            className="w-full px-6 py-4 bg-[#1a1816] text-white text-[12px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Payment..." : "Create Payment"}
          </button>
        </div>
      </div>
    </main>
  );
}
