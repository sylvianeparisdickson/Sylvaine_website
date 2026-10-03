import { getTranslations } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ReturnsPolicy" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ReturnsPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ReturnsPolicy" });

  return (
    <main className="bg-[#f8f5ef] min-h-screen text-[#1a1816]">
      <Nav />

      {/* Header */}
      <div className="pt-28 md:pt-40 pb-12 md:pb-16 px-6 md:px-14 border-b border-black/10">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-4">
          {t("badge")}
        </span>
        <h1
          className="font-serif italic font-light text-[#1a1816] leading-[.92] mb-6"
          style={{ fontSize: "clamp(38px, 7vw, 84px)" }}
        >
          {t("heading")}
        </h1>
        <p className="text-[14px] md:text-[15px] text-[#6a6560] leading-[1.8] max-w-2xl font-light">
          {t("subheading")}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-14 py-16 md:py-24 space-y-16">
        {/* All Sales Are Final */}
        <section className="bg-white rounded-3xl border border-black/10 p-8 md:p-14 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[9px] tracking-[.24em] uppercase text-[#9a9188]">
              Limited-Edition Reproductions
            </span>
          </div>

          <h2 className="font-serif italic text-[26px] md:text-[36px] text-[#1a1816] leading-[1.1] mb-6">
            {t("allSalesTitle")}
          </h2>

          <div className="space-y-4 text-[14.5px] md:text-[15.5px] text-[#3a3734] leading-[1.85]">
            <p className="font-serif italic text-[17px] md:text-[19px] text-[#1a1816]">
              {t("allSalesP1")}
            </p>
            <p className="text-[#5a5550]">
              {t("allSalesP2")}
            </p>
          </div>
        </section>

        {/* Artwork Damaged During Shipping */}
        <section className="bg-white rounded-3xl border border-black/10 p-8 md:p-14 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#1a1816]" />

          <div className="flex items-center gap-3 mb-6">
            <span className="text-[9px] tracking-[.24em] uppercase text-[#9a9188]">
              Transit Protection & Claims
            </span>
          </div>

          <h2 className="font-serif italic text-[26px] md:text-[36px] text-[#1a1816] leading-[1.1] mb-6">
            {t("damagedTitle")}
          </h2>

          <p className="text-[14.5px] md:text-[15.5px] text-[#3a3734] leading-[1.85] mb-8">
            {t("damagedP1")}
          </p>

          {/* Photo requirements box */}
          <div className="bg-[#fcf9f5] border border-black/10 rounded-2xl p-6 md:p-8 mb-8 space-y-4">
            <p className="text-[12px] tracking-[.18em] uppercase text-[#1a1816] font-semibold">
              {t("damagedPhotosIntro")}
            </p>
            <ul className="space-y-2.5 text-[14px] text-[#4a4540] list-none">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c4b22] shrink-0" />
                <span>{t("damagedPhoto1")}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c4b22] shrink-0" />
                <span>{t("damagedPhoto2")}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8c4b22] shrink-0" />
                <span>{t("damagedPhoto3")}</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-black/8">
              <p className="text-[13px] md:text-[13.5px] text-[#8c4b22] font-medium leading-relaxed">
                {t("damagedPackagingNotice")}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-[14.5px] text-[#4a4540] leading-[1.85] mb-8">
            <p>{t("damagedResolution")}</p>
            <p>{t("defectiveItem")}</p>
          </div>

          <p className="text-[12px] text-[#7a7269] italic pt-4 border-t border-black/8">
            {t("consumerProtection")}
          </p>

          <div className="mt-8 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-[12px] text-[#6a6560]">
              Need assistance with an order or damaged package? Contact us right away.
            </p>
            <Link
              href="/contact?subject=Damaged%20Artwork%20Report"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#1a1816] text-white text-[10px] tracking-[.2em] uppercase hover:bg-[#3a3836] transition-colors whitespace-nowrap rounded-sm"
            >
              {t("contactCta")} →
            </Link>
          </div>
        </section>

        {/* Cross-navigation strip */}
        <div className="bg-[#141210] text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="font-serif italic text-[22px] md:text-[26px] text-white/90 mb-2">
              Shipping & Delivery Policy
            </h3>
            <p className="text-[13px] text-white/60 max-w-xl leading-relaxed">
              Read about domestic fulfillment timelines, careful archival packaging, and international quotation requirements.
            </p>
          </div>
          <Link
            href="/shipping-policy"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-white text-[9.5px] tracking-[.2em] uppercase hover:bg-white hover:text-[#141210] transition-colors whitespace-nowrap"
          >
            View Shipping Policy →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
