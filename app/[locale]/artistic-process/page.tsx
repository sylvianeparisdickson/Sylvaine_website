import { useTranslations } from "next-intl";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";

export default function ArtisticProcess() {
  const t = useTranslations("ArtisticProcess");

  return (
    <main>
      <RevealObserver />
      <Nav />
      
      <section className="px-6 md:px-14 section-space">
        <div className="max-w-4xl mx-auto">
          <div className="border-b border-black/10 pb-5 mb-12 reveal">
            <h1 className="font-serif italic text-[32px] md:text-[40px] text-[#1a1816] mb-3">
              {t("title")}
            </h1>
            <p className="text-[9px] md:text-[10px] tracking-[.16em] uppercase text-[#9a9188]">
              {t("subtitle")}
            </p>
          </div>

          <div className="mb-12 reveal">
            <div className="aspect-video bg-[#ede9e1] relative">
              <video 
                controls
                className="w-full h-full"
                poster="/artisans.jpg"
              >
                <source src="/final.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="prose prose-lg max-w-none reveal">
            <p className="font-serif text-[16px] md:text-[18px] text-[#3a3835] leading-relaxed">
              {t("text")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
