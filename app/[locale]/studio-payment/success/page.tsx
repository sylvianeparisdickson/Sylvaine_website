"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderSummary {
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  total_amount?: number;
  price?: number;
  shipping_cost?: number;
  shipping_method?: string;
  payment_method?: string;
  payment_status?: string;
  description?: string;
  painting_title?: string;
}

export default function StudioPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const confirmOrder = async () => {
      try {
        const res = await fetch(`/api/studio-payment/confirm?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (res.ok && data.success && data.order) {
          setOrder(data.order);
        } else if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        console.error("Failed to load order confirmation:", err);
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-4 py-12 md:py-16">
      <div className="max-w-lg mx-auto">
        <div className="bg-white p-6 md:p-10 shadow-sm border border-[#ede8df]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif italic text-[28px] md:text-[34px] text-[#1a1816] mb-1">
              Payment Complete
            </h1>
            <p className="text-[11px] tracking-[.18em] uppercase text-[#9a9188]">
              Receipt & Confirmation
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#9a9188] text-[13px] tracking-wider animate-pulse">
              Confirming order details...
            </div>
          ) : (
            <>
              {order ? (
                <div className="space-y-6">
                  {/* Order Number Banner */}
                  <div className="bg-[#fbf9f5] border border-[#f0ece1] p-4 text-center">
                    <span className="text-[10px] tracking-[.16em] uppercase text-[#9a9188] block mb-1">
                      Order Reference
                    </span>
                    <span className="font-mono text-[16px] font-semibold text-[#1a1816] tracking-wider">
                      {order.order_number || "CONFIRMED"}
                    </span>
                  </div>

                  {/* Summary Details */}
                  <div className="divide-y divide-[#f0ede6] text-[13px]">
                    <div className="py-3 flex justify-between">
                      <span className="text-[#9a9188] uppercase text-[11px] tracking-wider">Customer</span>
                      <span className="text-[#1a1816] font-medium text-right">{order.customer_name || "Valued Client"}</span>
                    </div>

                    {order.customer_email && (
                      <div className="py-3 flex justify-between">
                        <span className="text-[#9a9188] uppercase text-[11px] tracking-wider">Email</span>
                        <span className="text-[#1a1816] font-mono text-[12px]">{order.customer_email}</span>
                      </div>
                    )}

                    <div className="py-3 flex justify-between">
                      <span className="text-[#9a9188] uppercase text-[11px] tracking-wider">Payment Status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                        Paid via {order.payment_method || "Stripe"}
                      </span>
                    </div>

                    <div className="py-3 flex justify-between">
                      <span className="text-[#9a9188] uppercase text-[11px] tracking-wider">Item / Note</span>
                      <span className="text-[#1a1816] text-right font-serif italic max-w-[60%]">
                        {order.description || order.painting_title || "Studio Purchase"}
                      </span>
                    </div>

                    {order.shipping_method && (
                      <div className="py-3 flex justify-between">
                        <span className="text-[#9a9188] uppercase text-[11px] tracking-wider">Delivery</span>
                        <span className="text-[#1a1816] text-right">{order.shipping_method}</span>
                      </div>
                    )}

                    <div className="py-3 flex justify-between font-medium text-[15px] pt-4">
                      <span className="text-[#1a1816] uppercase text-[12px] tracking-wider">Total Paid</span>
                      <span className="text-[#1a1816] font-mono">
                        ${order.total_amount !== undefined ? Number(order.total_amount).toFixed(2) : "0.00"} USD
                      </span>
                    </div>
                  </div>

                  <p className="text-[12px] text-[#8a847d] text-center pt-2 leading-relaxed">
                    A confirmation email has been dispatched with your receipt. You can save or screenshot this page for your records.
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[14px] text-[#6a6560] mb-4 leading-relaxed">
                    Your payment was successfully charged and authenticated. Your order has been recorded.
                  </p>
                  {error && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 border border-amber-200 rounded">
                      Session ID: {sessionId}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-[#f0ece1] flex flex-col sm:flex-row gap-3">
                <Link
                  href="/studio-payment"
                  className="flex-1 py-3 px-4 bg-[#1a1816] text-white text-center text-[11px] tracking-[.18em] uppercase hover:bg-[#33302c] transition-colors"
                >
                  New Payment
                </Link>
                <Link
                  href="/"
                  className="flex-1 py-3 px-4 bg-transparent border border-[#d6cfc5] text-[#1a1816] text-center text-[11px] tracking-[.18em] uppercase hover:bg-[#f3efe8] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
