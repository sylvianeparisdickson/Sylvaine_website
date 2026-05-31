import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Exhibitions — Sylviane Paris",
  description: "Exhibitions and selected recognitions by Sylviane Paris.",
};

export default function ExhibitionsPage() {
  return (
    <main>
      <Nav />
      <div className="min-h-screen px-6 md:px-14 page-top pb-16 md:pb-20">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-6 md:mb-8">Exhibitions</span>
        <h1 className="font-serif italic font-light text-[#1a1816] leading-[.9] mb-12 md:mb-20" style={{ fontSize: "clamp(36px, 7vw, 88px)" }}>
          Exhibitions &amp;<br />Recognitions
        </h1>
        {/* Content from original exhibition.tsx (kept unchanged) */}
        {[
          { date: "Dec 2025", org: "Light Space & Time Online Art Gallery — 15th Nature Art Exhibition", honour: "Special Merit Award" },
          { date: "Dec 2025", org: "Teravarna International Art Competition — 10th Figurative Exhibition", honour: "Honorable Mention" },
          { date: "Oct 2025", org: "Teravarna International Art Competition — 13th Open Exhibition", honour: "Honorable Mention" },
        ].map((item) => (
          <div key={item.honour + item.date} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-6 border-b border-black/10 first:border-t">
            <span className="text-[10px] tracking-[.12em] uppercase text-[#9a9188] shrink-0 sm:w-24">{item.date}</span>
            <div>
              <p className="text-[14px] text-[#6a6560] leading-[1.7] mb-1">{item.org}</p>
              <p className="font-serif italic text-[15px] text-[#1a1816]">{item.honour}</p>
            </div>
          </div>
        ))}
        <div className="mt-16 border-t border-black/10 pt-10">
          <p className="font-serif italic text-[16px] text-[#9a9188] leading-[1.8]">Further exhibition history and upcoming shows<br />will be added shortly.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
