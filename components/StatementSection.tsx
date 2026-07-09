import { useTranslations } from "next-intl";

export default function StatementSection() {
  const t = useTranslations("StatementSection");
  const td = useTranslations("data");

  return (
    <section className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-24 items-center px-6 md:px-14 section-space border-b border-black/10 reveal">
      {/* Text */}
      <div>
        <span className="block text-[9px] tracking-[.22em] uppercase text-[#9a9188] mb-8">
          {t("heading")}
        </span>
        <div className="space-y-5 text-[15px] md:text-[14.5px] text-[#6a6560] leading-[1.95] md:leading-[1.9] max-w-lg">
          <p>{t("text1")}</p>
          <p>{t("text2")}</p>
          <p>{t("text3")}</p>
          <p>{t("text4")}</p>
        </div>
      </div>

      {/* Image */}
      <div>
        <div className="artwork-frame w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/morning-visit.jpg"
            alt={`${td("divine-presence.paintings.morning-visit.title")} — Sylviane Paris`}
            className="w-full h-auto object-cover object-center"
          />
        </div>
        <div className="flex justify-between items-baseline mt-4">
          <span className="font-serif italic text-[13px] md:text-[14px] text-[#1a1816]">
            {td("divine-presence.paintings.morning-visit.title")}
          </span>
          <span className="text-[9px] tracking-[.14em] uppercase text-[#9a9188]">
            {td("divine-presence.name")}
          </span>
        </div>
      </div>
    </section>
  );
}
