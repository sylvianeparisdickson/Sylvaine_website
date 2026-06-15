import Image from "next/image";
import { Link } from "@/i18n/routing";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { allSeries } from "@/lib/data";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Series" });
  return { title: t("title"), description: t("description") };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Series" });
  const td = await getTranslations({ locale, namespace: "data" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <main>
      <Nav />
      <div className="pt-28 md:pt-40 pb-8 md:pb-12 px-6 md:px-14 border-b border-black/10">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-4">
          {t("badge")}
        </span>
        <h1
          className="font-serif italic font-light text-[#1a1816] leading-[.9]"
          style={{ fontSize: "clamp(40px, 8vw, 88px)" }}
        >
          {t("heading")}
        </h1>
      </div>

      <section className="px-6 md:px-14 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
          {allSeries.map((series) => {
            const name = td(`${series.id}.name`);
            const subtitle = td(`${series.id}.subtitle`);
            return (
              <Link key={series.id} href={series.href} className="group">
                <div className="artwork-frame w-full mb-5">
                  <Image
                    src={series.coverImg}
                    alt={name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 md:top-5 left-3 md:left-5">
                    <span className="font-serif italic text-[11px] md:text-[13px] text-white/70">
                      {series.numeral}
                    </span>
                  </div>
                  <div className="absolute bottom-3 md:bottom-5 right-3 md:right-5 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[8px] md:text-[9px] tracking-[.14em] uppercase text-white/75 bg-black/30 px-2 md:px-3 py-1 md:py-1.5">
                      {series.paintings.length === 1 ? tc("work_one") : tc("work_other", { count: series.paintings.length })}
                    </span>
                  </div>
                </div>
                <p className="font-serif italic text-[16px] md:text-[21px] font-normal text-[#1a1816] mb-1 leading-tight">
                  {name}
                </p>
                <p className="text-[8px] md:text-[9.5px] tracking-[.12em] md:tracking-[.16em] uppercase text-[#9a9188] leading-relaxed">
                  {subtitle}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
      <Footer />
    </main>
  );
}
