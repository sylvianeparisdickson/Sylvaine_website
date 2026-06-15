import { useTranslations } from "next-intl";

export default function CollectorQuote() {
  const t = useTranslations("CollectorQuote");

  return (
    <section className="px-6 md:px-14 section-space max-w-3xl mx-auto text-center border-t border-black/10 reveal">
      <blockquote
        className="font-serif italic font-normal text-[#1a1816] leading-[1.75] mb-8"
        style={{ fontSize: "clamp(16px, 3vw, 22px)" }}
      >
        <span
          aria-hidden="true"
          className="block font-serif not-italic text-[28px] sm:text-[36px] leading-none text-black/12 mb-4"
        >
          &ldquo;
        </span>
        {t("quote")}
      </blockquote>
      <p className="text-[9px] tracking-[.18em] uppercase text-[#9a9188]">
        {t("subtext")}
      </p>
    </section>
  );
}
