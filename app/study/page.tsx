import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { allSeries } from "@/lib/data";

export const metadata = {
  title: "Study — Sylviane Paris-Dickson",
  description: "Collections of paintings by Sylviane Paris-Dickson.",
};

export default function StudyPage() {
  return (
    <main>
      <Nav />
      <div className="pt-28 md:pt-40 pb-8 md:pb-12 px-6 md:px-14 border-b border-black/10">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-4">Collections</span>
        <h1 className="font-serif italic font-light text-[#1a1816] leading-[.9]"
          style={{ fontSize: "clamp(40px, 8vw, 88px)" }}>
          Study
        </h1>
      </div>

      <section className="px-6 md:px-14 py-12 md:py-20">
        {/* 2 col on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
          {allSeries.map((series, i) => (
            <Link key={series.id} href={series.href} className="group" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="relative overflow-hidden mb-4 w-full" style={{ aspectRatio: "4/5" }}>
                <Image
                  src={series.coverImg}
                  alt={series.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/8" />
                <div className="absolute top-3 md:top-5 left-3 md:left-5">
                  <span className="font-serif italic text-[11px] md:text-[13px] text-white/70">{series.numeral}</span>
                </div>
                <div className="absolute bottom-3 md:bottom-5 right-3 md:right-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[8px] md:text-[9px] tracking-[.14em] uppercase text-white/75 bg-black/30 px-2 md:px-3 py-1 md:py-1.5 backdrop-blur-sm">
                    {series.paintings.length} {series.paintings.length === 1 ? "work" : "works"}
                  </span>
                </div>
              </div>
              <p className="font-serif italic text-[16px] md:text-[21px] font-normal text-[#1a1816] mb-1 leading-tight">{series.name}</p>
              <p className="text-[8px] md:text-[9.5px] tracking-[.12em] md:tracking-[.16em] uppercase text-[#9a9188] leading-relaxed">{series.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
