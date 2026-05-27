import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Press & Recognition — Sylviane Paris-Dickson",
  description: "Press and recognition for Sylviane Paris-Dickson.",
};

export default function PressPage() {
  return (
    <main>
      <Nav />
      <div className="min-h-screen px-6 md:px-14 page-top pb-16 md:pb-20">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-6 md:mb-8">Press &amp; Recognition</span>
        <h1 className="font-serif italic font-light text-[#1a1816] leading-[.9] mb-12 md:mb-20" style={{ fontSize: "clamp(36px, 7vw, 88px)" }}>
          Press &amp;<br />Recognition
        </h1>
        <div className="max-w-2xl border-t border-black/10 pt-10">
          <p className="font-serif italic text-[16px] text-[#9a9188] leading-[1.8]">
            Press features and further recognitions<br />will be added here as they become available.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
