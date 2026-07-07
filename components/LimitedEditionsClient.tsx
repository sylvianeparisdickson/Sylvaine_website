"use client";
import { useState } from "react";
import { Painting } from "@/lib/data";
import PaymentModal from "@/components/PaymentModal";

interface LimitedEditionsClientProps {
  works: (Painting & { seriesName: string; seriesHref: string })[];
}

export default function LimitedEditionsClient({ works }: LimitedEditionsClientProps) {
  const [paymentPainting, setPaymentPainting] = useState<Painting | null>(null);

  return (
    <>
      {paymentPainting && <PaymentModal painting={paymentPainting} onClose={() => setPaymentPainting(null)} />}
      <div className="space-y-16 md:space-y-24">
        {works.map((work) => (
          <article
            key={work.id}
            className="grid gap-10 lg:grid-cols-[1fr_320px] items-start"
          >
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[9px] tracking-[.22em] uppercase text-[#9a9188]">
                Original Painting
              </span>
              <span className="text-[9px] tracking-[.18em] uppercase text-[#1a1816]">
                Status: {work.status ?? "Available"}
              </span>
            </div>
            <h2 className="font-serif italic text-[32px] md:text-[40px] text-[#1a1816] leading-[1.03] mb-3">
              {work.title}
            </h2>
            <p className="text-[9px] md:text-[9.5px] uppercase tracking-[.18em] text-[#9a9188] mb-7">
              <a
                href={work.seriesHref}
                className="hover:text-[#1a1816] transition-colors duration-300"
              >
                {work.seriesName}
              </a>
            </p>

            <div className="rounded-3xl border border-black/10 bg-[#f8f5ef] p-7">
              <p className="text-[9px] tracking-[.24em] uppercase text-[#9a9188] mb-4">
                Limited Edition Available
              </p>
              <p className="text-[13px] md:text-[14px] leading-[1.9] text-[#1a1816] mb-6">
                Museum-quality archival Giclée, signed and numbered by the artist, and accompanied by a Certificate of Authenticity. Editions are offered in carefully controlled quantities and selected sizes.
              </p>
              <div className="space-y-4">
                {work.limitedEditions?.map((edition) => (
                  <div
                    key={edition.sizeLabel}
                    className="grid grid-cols-[1fr_auto] gap-4 items-center border-t border-black/10 pt-4"
                  >
                    <div>
                      <p className="text-[14px] md:text-[15px] font-semibold text-[#1a1816]">
                        {edition.sizeLabel}
                      </p>
                      <p className="text-[9px] uppercase tracking-[.18em] text-[#9a9188]">
                        {edition.edition} · {edition.dimensions}
                      </p>
                    </div>
                    <p className="text-[14px] md:text-[15px] font-medium text-[#1a1816]">
                      {edition.price}
                    </p>
                  </div>
                ))}
              </div>
              {work.status !== "Sold" && work.limitedEditions && work.limitedEditions.length > 0 && (
                <button 
                  onClick={() => setPaymentPainting(work)}
                  className="mt-6 w-full px-6 py-3 bg-[#1a1816] text-white text-[10px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-[#f8f5ef] min-h-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={work.img}
              alt={work.alt}
              className="object-cover w-full h-full"
            />
          </div>
        </article>
      ))}
      </div>
    </>
  );
}
