import { Link } from "@/i18n/routing";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import LimitedEditionsClient from "@/components/LimitedEditionsClient";
import { getTranslations } from "next-intl/server";
import { getLocalizedSeries } from "@/lib/localizedData";
import { allSeries } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LimitedEditions" });
  return { title: t("title"), description: t("description") };
}

export default async function LimitedEditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LimitedEditions" });

  // Get all localized series and build localized limited edition works
  const localizedSeries = await Promise.all(
    allSeries.map((s) => getLocalizedSeries(locale, s.id))
  );

  const localizedWorks = localizedSeries.flatMap((series) => {
    if (!series) return [];
    return series.paintings
      .filter((p) => Array.isArray(p.limitedEditions) && p.limitedEditions.length > 0)
      .map((p) => ({ ...p, seriesName: series.name, seriesHref: series.href }));
  });

  const bullets = [
    t("bullet1"),
    t("bullet2"),
    t("bullet3"),
    t("bullet4"),
  ];

  return (
    <main>
      <Nav />

      <div className="pt-28 md:pt-40 pb-10 md:pb-12 px-6 md:px-14 border-b border-black/10">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-4">
          {t("badge")}
        </span>
        <h1
          className="font-serif italic font-light text-[#1a1816] leading-[.9]"
          style={{ fontSize: "clamp(40px, 8vw, 88px)" }}
        >
          {t("heading")}
        </h1>
        <p className="text-[14px] md:text-[14.5px] text-[#6a6560] leading-[1.9] max-w-3xl mt-6">
          {t("desc")}
        </p>
        <div className="mt-8 max-w-2xl mx-auto text-center">
          <ul className="inline-grid grid-cols-1 gap-2 text-[10px] uppercase tracking-[.2em] text-[#9a9188] sm:grid-cols-2">
            {bullets.map((b) => (
              <li
                key={b}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-[#f8f5ef] px-3 py-1.5"
              >
                <span className="block w-1.5 h-1.5 rounded-full bg-[#1a1816]" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-6 md:px-14 py-6 md:py-8 text-[10px] tracking-[.18em] uppercase text-[#9a9188] text-center font-bold">
        {t("fulfillmentHeader")}
      </div>

      <section className="px-6 md:px-14 py-16 md:py-24">
        <LimitedEditionsClient works={localizedWorks} />
      </section>

      <div className="px-6 md:px-14 py-12 md:py-16 border-t border-black/10">
        <h3 className="text-[11px] tracking-[.22em] uppercase text-[#1a1816] mb-6">
          {t("fulfillmentTitle")}
        </h3>
        <div className="space-y-4 text-[13px] md:text-[14px] text-[#6a6560] leading-[1.8] font-bold">
          <p>{t("fulfillmentTimeline")}</p>
          <p>{t("fulfillmentSigning")}</p>
          <p>{t("fulfillmentShipping")}</p>
          <p>{t("fulfillmentTracking")}</p>
        </div>
      </div>

      <div className="px-6 md:px-14 pb-20 text-[10px] tracking-[.18em] uppercase text-[#9a9188]">
        {t("bottomText")}
      </div>

      <Footer />
    </main>
  );
}
