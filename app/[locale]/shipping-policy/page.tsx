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
  const t = await getTranslations({ locale, namespace: "ShippingPolicy" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ShippingPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ShippingPolicy" });

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
        {/* International Shipping - Featured Section */}
        <section className="bg-white rounded-3xl border border-black/10 p-8 md:p-14 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#1a1816]" />
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[9px] tracking-[.24em] uppercase text-[#9a9188]">
              Worldwide Collectors
            </span>
            <span className="text-[9px] text-[#9a9188]">·</span>
            <span className="text-[9px] tracking-[.2em] uppercase text-[#8c4b22] font-medium">
              Case-by-Case Quotation
            </span>
          </div>

          <h2 className="font-serif italic text-[28px] md:text-[38px] text-[#1a1816] leading-[1.1] mb-8">
            {t("internationalTitle")}
          </h2>

          <div className="space-y-6 text-[14.5px] md:text-[16px] text-[#3a3734] leading-[1.85]">
            <p className="font-serif italic text-[18px] md:text-[20px] text-[#1a1816]">
              {t("internationalP1")}
            </p>
            <p>
              {t("internationalP2")}
            </p>
            <p className="bg-[#fcf9f5] border-l-2 border-[#8c4b22] px-5 py-4 rounded-r-xl text-[#2a2724]">
              {t("internationalP3")}
            </p>
            <p>
              {t("internationalP4")}
            </p>
            <p className="text-[#1a1816] font-medium">
              {t("internationalP5")}
            </p>
            <p className="text-[13px] md:text-[13.5px] text-[#7a7269] italic pt-2 border-t border-black/8">
              {t("internationalP6")}
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="text-[12px] text-[#6a6560]">
              Planning an international order? Contact the artist with your chosen work and destination.
            </p>
            <Link
              href="/contact?subject=International%20Shipping%20Quotation"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#1a1816] text-white text-[10px] tracking-[.2em] uppercase hover:bg-[#3a3836] transition-colors whitespace-nowrap rounded-sm"
            >
              {t("contactCta")} →
            </Link>
          </div>
        </section>

        {/* Domestic Shipping & Pickup */}
        <section className="bg-white rounded-3xl border border-black/10 p-8 md:p-14 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[9px] tracking-[.24em] uppercase text-[#9a9188]">
              United States Orders
            </span>
          </div>

          <h2 className="font-serif italic text-[24px] md:text-[32px] text-[#1a1816] leading-[1.15] mb-6">
            {t("domesticTitle")}
          </h2>

          <div className="space-y-5 text-[14px] md:text-[15px] text-[#5a5550] leading-[1.85]">
            <p>{t("domesticText1")}</p>
            <p>{t("domesticText2")}</p>
            <p className="pt-2">{t("domesticText3")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-black/10 text-[12px]">
            <div className="space-y-1.5">
              <p className="text-[10px] tracking-[.18em] uppercase text-[#1a1816] font-medium">Timeline</p>
              <p className="text-[#6a6560]">7–10 business days for archival printing & hand-signing.</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] tracking-[.18em] uppercase text-[#1a1816] font-medium">Authenticity</p>
              <p className="text-[#6a6560]">Hand-signed, numbered, Certificate of Authenticity included.</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] tracking-[.18em] uppercase text-[#1a1816] font-medium">Tracking</p>
              <p className="text-[#6a6560]">Confirmation with full carrier tracking sent upon dispatch.</p>
            </div>
          </div>
        </section>

        {/* Questions strip */}
        <div className="bg-[#141210] text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="font-serif italic text-[22px] md:text-[26px] text-white/90 mb-2">
              {t("inquiriesTitle")}
            </h3>
            <p className="text-[13px] text-white/60 max-w-xl leading-relaxed">
              {t("inquiriesText")}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/25 text-white text-[9.5px] tracking-[.2em] uppercase hover:bg-white hover:text-[#141210] transition-colors whitespace-nowrap"
          >
            Contact Studio →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
