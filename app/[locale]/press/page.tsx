import { getTranslations } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Press" });
  return { title: t("title"), description: t("description") };
}

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Press" });

  return (
    <main>
      <Nav />
      <div className="min-h-screen px-6 md:px-14 page-top pb-16 md:pb-20">
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-6 md:mb-8">
          {t("badge")}
        </span>
        <h1
          className="font-serif italic font-light text-[#1a1816] leading-[.9] mb-12 md:mb-20"
          style={{ fontSize: "clamp(36px, 7vw, 88px)" }}
        >
          {t("heading").split("\n").map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </h1>
        <div className="max-w-2xl border-t border-black/10 pt-10">
          <p className="font-serif italic text-[16px] text-[#9a9188] leading-[1.8] whitespace-pre-line">
            {t("text")}
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
