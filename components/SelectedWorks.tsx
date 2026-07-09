import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const featuredConfig = [
  {
    img: "/souls-of-the-park.jpg",
    seriesId: "divine-presence",
    paintingId: "souls-of-the-park",
    href: "/study/divine-presence",
  },
  {
    img: "/timeless-craft.jpg",
    seriesId: "living-moments",
    paintingId: "timeless-craft",
    href: "/study/living-moments",
  },
  {
    img: "/whispering-passage.jpg",
    seriesId: "enchanted-path",
    paintingId: "whispering-passage",
    href: "/study/enchanted-path",
  },
];

export default function SelectedWorks() {
  const t = useTranslations("SelectedWorks");
  const td = useTranslations("data");

  return (
    <section className="px-6 md:px-14 section-space border-t border-black/10">
      <div className="flex justify-between items-baseline border-b border-black/10 pb-5 mb-12 md:mb-14 reveal">
        <span className="text-[9px] tracking-[.22em] uppercase text-[#9a9188]">
          {t("heading")}
        </span>
        <Link
          href="/study"
          className="text-[9px] md:text-[9.5px] tracking-[.16em] md:tracking-[.18em] uppercase text-[#9a9188] hover:text-[#1a1816] transition-colors duration-300"
        >
          {t("viewAll")}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
        {featuredConfig.map((p) => {
          const title = td(`${p.seriesId}.paintings.${p.paintingId}.title`);
          const series = td(`${p.seriesId}.name`);
          const medium = td(`${p.seriesId}.paintings.${p.paintingId}.medium`);
          return (
            <Link key={title} href={p.href} className="group reveal">
              <div className="artwork-frame w-full mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={title} className="w-full h-auto" />
              </div>
              <p className="font-serif italic text-[16px] md:text-[17px] text-[#1a1816] mb-1.5">
                {title}
              </p>
              <p className="text-[9px] md:text-[9.5px] tracking-[.12em] uppercase text-[#9a9188]">
                {series} · {medium}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
