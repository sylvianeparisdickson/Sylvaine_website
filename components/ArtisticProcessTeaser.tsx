import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function ArtisticProcessTeaser() {
  const t = useTranslations("ArtisticProcess");

  return (
    <section className="px-6 md:px-14 section-space border-t border-black/10">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Video preview image */}
          <div className="aspect-video bg-[#ede9e1] relative reveal">
            {/* Replace poster with actual video still image */}
            <video 
              className="w-full h-full object-cover"
              poster="/artisans.jpg"
              muted
            >
              <source src="/final.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1a1816] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="reveal">
            <h2 className="font-serif italic text-[24px] md:text-[28px] text-[#1a1816] mb-4">
              {t("title")}
            </h2>
            <p className="text-[9px] md:text-[10px] tracking-[.16em] uppercase text-[#9a9188] mb-6">
              {t("subtitle")}
            </p>
            <p className="font-serif text-[15px] md:text-[16px] text-[#3a3835] leading-relaxed mb-8">
              {t("text")}
            </p>
            <Link
              href="/artistic-process"
              className="inline-block text-[9px] md:text-[10px] tracking-[.16em] uppercase text-[#1a1816] border-b border-[#1a1816] pb-1 hover:text-[#6a6560] hover:border-[#6a6560] transition-colors duration-300"
            >
              Discover the process →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
