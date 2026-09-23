"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function StudioPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="bg-white p-6 md:p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif italic text-[28px] md:text-[32px] text-[#1a1816] mb-2">
              Payment Complete
            </h1>
            <p className="text-[11px] tracking-[.14em] uppercase text-[#9a9188]">
              Thank you
            </p>
          </div>

          <p className="text-[14px] text-[#6a6560] mb-8 leading-relaxed">
            Your payment has been successfully processed. A confirmation email has been sent to you.
          </p>

          <a
            href="/studio-payment"
            className="inline-block w-full px-6 py-4 bg-[#1a1816] text-white text-[12px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors"
          >
            New Payment
          </a>
        </div>
      </div>
    </main>
  );
}
