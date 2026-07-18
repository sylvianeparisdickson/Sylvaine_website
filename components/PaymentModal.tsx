"use client";
import { useState } from "react";
import { Painting } from "@/lib/data";

interface PaymentModalProps {
  painting: Painting;
  onClose: () => void;
}

export default function PaymentModal({ painting, onClose }: PaymentModalProps) {
  const [selectedEdition, setSelectedEdition] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const edition = painting.limitedEditions?.[selectedEdition];
  if (!edition) return null;

  const price = parseFloat(edition.price.replace("$", "").replace(",", ""));

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
    const shippingAddress = formData.get("address") as string;

    if (!customerEmail || !customerName || !shippingAddress) {
      alert("Please fill in all fields");
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
      shippingAddress,
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
          <p className="font-serif italic text-[24px] text-[#1a1816]">{edition.price}</p>
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
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[.14em] uppercase text-[#9a9188] mb-2">Shipping Address</label>
              <textarea
                name="address"
                required
                rows={3}
                className="w-full px-4 py-2 bg-transparent border border-black/20 text-[13px] text-[#1a1816] outline-none focus:border-[#1a1816] resize-none"
              />
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
          {loading ? "Processing..." : showForm ? "Complete Purchase" : "Continue to Checkout"}
        </button>
      </div>
    </div>
  );
}
