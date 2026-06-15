import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <main>
      <Nav />

      <section className="relative overflow-hidden border-b border-black/10 bg-[linear-gradient(180deg,#f7f2eb_0%,#fbfaf7_55%,#ffffff_100%)]">
        <div className="px-6 md:px-14 pt-24 md:pt-32 pb-[4.5rem] md:pb-24">
          <div className="max-w-6xl mx-auto">
            <p className="flex items-center gap-3 text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-8">
              <span className="block w-7 h-px bg-[#b8afa4]" />
              {t("theArtist").split(" ")[0]}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,360px)] gap-12 lg:gap-16 items-end">
              <div>
                <h1
                  className="font-serif italic font-light text-[#1a1816] leading-[.92] mb-6 whitespace-pre-line"
                  style={{ fontSize: "clamp(42px, 7.2vw, 92px)" }}
                >
                  {t("heading")}
                </h1>
                <p className="max-w-2xl text-[15px] md:text-[16px] text-[#6a6560] leading-[1.95]">
                  {t("text1")}
                </p>
              </div>
              <div className="border border-black/10 bg-white/70 backdrop-blur-sm px-6 py-7 md:px-8 md:py-8">
                <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-4">
                  {t("studioLabel")}
                </p>
                <div className="space-y-3">
                  <p
                    className="font-serif italic font-light text-[#1a1816] leading-[1.5] whitespace-pre-line"
                    style={{ fontSize: "clamp(18px, 2.2vw, 24px)" }}
                  >
                    {t("studioTitle")}
                  </p>
                  <p className="text-[13.5px] text-[#6a6560] leading-[1.8] whitespace-pre-line">
                    {t("studioSub")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-16 md:py-24 border-b border-black/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-12">
          <div>
            <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188]">
              {t("theArtist")}
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,.8fr)] gap-10 md:gap-14">
            <div>
              <p
                className="font-serif italic font-light text-[#1a1816] leading-[1.5] mb-8"
                style={{ fontSize: "clamp(22px, 2.7vw, 34px)" }}
              >
                {t("quote")}
              </p>
              <div className="space-y-6 text-[15px] text-[#6a6560] leading-[1.95] max-w-2xl">
                <p>{t("bio1")}</p>
                <p>{t("bio2")}</p>
                <p>{t("bio3")}</p>
              </div>
            </div>
            <div className="bg-[#f8f5ef] border border-black/8 px-6 py-7 md:px-8 md:py-9 self-start">
              <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-5">
                {t("practiceLabel")}
              </p>
              <div className="space-y-5 text-[14px] text-[#6a6560] leading-[1.85]">
                <p>{t("practiceThemes")}</p>
                <p>{t("practiceFocus")}</p>
                <p className="font-serif italic text-[13.5px] text-[#8d847a]">
                  {t("practiceNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-16 md:py-20 border-b border-black/10 bg-[#fcfaf6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            {[
              {
                label: t("foundation"),
                title: t("foundationTitle"),
                text: t("foundationText"),
              },
              {
                label: t("perspective"),
                title: t("perspectiveTitle"),
                text: t("perspectiveText"),
              },
              {
                label: t("studioLife"),
                title: t("studioLifeTitle"),
                text: t("studioLifeText"),
              },
            ].map((item) => (
              <div key={item.label} className="bg-[#fcfaf6] px-6 py-8 md:px-8 md:py-10">
                <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-5">
                  {item.label}
                </p>
                <h2
                  className="font-serif italic font-light text-[#1a1816] leading-[1.2] mb-4 whitespace-pre-line"
                  style={{ fontSize: "clamp(20px, 2.3vw, 30px)" }}
                >
                  {item.title}
                </h2>
                <p className="text-[14px] text-[#6a6560] leading-[1.85]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-[4.5rem] md:py-24 border-b border-black/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-10 md:gap-14">
          <div>
            <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-8">
              {t("statementLabel")}
            </span>
            <h2
              className="font-serif italic font-light text-[#1a1816] leading-[1.08] whitespace-pre-line"
              style={{ fontSize: "clamp(28px, 3.4vw, 46px)" }}
            >
              {t("statementHeading")}
            </h2>
          </div>
          <div>
            <div className="border-t border-black/10 pt-8 md:pt-10">
              <p
                className="font-serif italic font-light text-[#1a1816] leading-[1.55] mb-10 max-w-3xl"
                style={{ fontSize: "clamp(20px, 2.4vw, 30px)" }}
              >
                {t("statementQuote")}
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10 text-[15px] text-[#6a6560] leading-[1.95]">
                <div className="space-y-6">
                  <p>{t("statementCol1Para1")}</p>
                  <p>{t("statementCol1Para2")}</p>
                  <p>{t("statementCol1Para3")}</p>
                </div>
                <div className="space-y-6">
                  <p>{t("statementCol2Para1")}</p>
                  <p>{t("statementCol2Para2")}</p>
                  <p>{t("statementCol2Para3")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-16 md:py-20 bg-[#f7f2eb] border-b border-black/10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-14">
          <div className="max-w-2xl">
            <p className="text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-5">
              {t("connectLabel")}
            </p>
            <h2
              className="font-serif italic font-light text-[#1a1816] leading-[1.05] mb-4 whitespace-pre-line"
              style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
            >
              {t("connectTitle")}
            </h2>
            <p className="text-[14.5px] text-[#6a6560] leading-[1.85]">
              {t("connectText")}
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-[#1a1816] text-white text-[9.5px] tracking-[.24em] uppercase font-light px-10 py-5 transition-all duration-300 hover:bg-[#3a3835]"
          >
            {t("connectButton")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
