import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { getLimitedEditionWorks } from "@/lib/data";

export const metadata = {
  title: "Limited Editions — Sylviane Paris",
  description:
    "Selected paintings available as museum-quality archival Giclée Limited Editions, signed, numbered, and accompanied by a Certificate of Authenticity.",
};

export default function LimitedEditionsPage() {
  const works = getLimitedEditionWorks();

  return (
    <main>
      <Nav />

      <div className="pt-28 md:pt-40 pb-10 md:pb-12 px-6 md:px-14 border-b border-black/10">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-4">
          Limited Editions
        </span>
        <h1
          className="font-serif italic font-light text-[#1a1816] leading-[.9]"
          style={{ fontSize: "clamp(40px, 8vw, 88px)" }}
        >
          Selected paintings available as archival Giclée.
        </h1>
        <p className="text-[14px] md:text-[14.5px] text-[#6a6560] leading-[1.9] max-w-3xl mt-6">
          Limited editions are produced using museum-quality archival Giclée materials, signed and numbered by the artist, and accompanied by a Certificate of Authenticity. Editions are offered in carefully controlled quantities for a select group of works.
        </p>
        <div className="mt-8 max-w-3xl mx-auto text-center">
          <ul className="inline-grid grid-cols-1 gap-3 text-[11px] uppercase tracking-[.22em] text-[#9a9188] sm:grid-cols-2">
            <li className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f8f5ef] px-4 py-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#1a1816]" />
              Museum-quality archival Giclée
            </li>
            <li className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f8f5ef] px-4 py-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#1a1816]" />
              Signed, numbered, authenticated
            </li>
            <li className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f8f5ef] px-4 py-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#1a1816]" />
              Sold unframed, shipped carefully
            </li>
            <li className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f8f5ef] px-4 py-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#1a1816]" />
              Once sold out, editions are final
            </li>
          </ul>
        </div>
      </div>

      <section className="px-6 md:px-14 py-16 md:py-24 space-y-24">
        {works.map((work) => (
          <article key={work.id} className="grid gap-10 lg:grid-cols-[1fr_320px] items-start">
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
                <Link href={work.seriesHref} className="hover:text-[#1a1816] transition-colors duration-300">
                  {work.seriesName}
                </Link>
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
                    <div key={edition.sizeLabel} className="grid grid-cols-[1fr_auto] gap-4 items-center border-t border-black/10 pt-4">
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
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-[#f8f5ef] min-h-[320px]">
              <img
                src={work.img}
                alt={work.alt}
                className="object-cover w-full h-full"
              />
            </div>
          </article>
        ))}
      </section>

      <div className="px-6 md:px-14 pb-20 text-[10px] tracking-[.18em] uppercase text-[#9a9188]">
        Please contact the artist for inquiries about additional limited editions or custom presentation options.
      </div>

      <Footer />
    </main>
  );
}
