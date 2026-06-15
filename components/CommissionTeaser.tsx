import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function CommissionTeaser() {
  const t = useTranslations("CommissionTeaser");
  const td = useTranslations("data");

  return (
    <section className="flex flex-col md:grid md:grid-cols-2 bg-[#141210]" id="commission">
      <div className="relative w-full h-72 sm:h-96 md:h-auto md:min-h-[520px] overflow-hidden">
        <Image
          src="/timeless-craft.jpg"
          alt={`${td("living-moments.paintings.timeless-craft.title")} — Sylviane Paris`}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="flex flex-col justify-center px-6 md:px-16 py-16 md:py-24 reveal">
        <span className="block text-[9px] tracking-[.22em] uppercase text-white/28 mb-6">
          {t("heading")}
        </span>
        <h2
          className="font-serif italic font-light text-white leading-[1.25] mb-6"
          style={{ fontSize: "clamp(26px, 4vw, 42px)" }}
        >
          {t("title")}
        </h2>
        <p className="text-[14px] md:text-[14px] text-white/42 leading-[1.95] mb-10 max-w-sm">
          {t("text")}
        </p>
        <Link
          href="/commission"
          className="self-start border border-white/25 text-white/75 text-[9.5px] tracking-[.22em] uppercase px-8 py-4 hover:bg-white/8 hover:border-white/5 hover:text-white"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
