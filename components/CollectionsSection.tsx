import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CollectionsSection() {
  const t = useTranslations("CollectionsSection");
  const tc = useTranslations("common");

  const series = [
    { num: "I",   name: t("archOfLight"), sub: t("archOfLightSub"),    count: 1,  img: "/artisans.jpg",      href: "/study/architecture-of-light" },
    { num: "II",  name: t("divinePresence"), sub: t("divinePresenceSub"), count: 2, img: "/morning-visit.jpg",  href: "/study/divine-presence" },
    { num: "III", name: t("livingMoments"),  sub: t("livingMomentsSub"),  count: 3, img: "/art-of-indulgence.jpg", href: "/study/living-moments" },
    { num: "IV",  name: t("enchantedPath"),  sub: t("enchantedPathSub"),  count: 2, img: "/whispering-passage.jpg", href: "/study/enchanted-path" },
    { num: "V",   name: t("studies"),       sub: t("studiesSub"),       count: 3, img: "/natures-guardians.jpg",  href: "/study/studies" },
  ];

  return (
    <section className="px-6 md:px-14 section-space bg-[#f8f5ef]" id="study">
      <div className="flex justify-between items-baseline border-b border-black/10 pb-5 mb-2">
        <span className="text-[9px] tracking-[.22em] uppercase text-[#9a9188]">{t("heading")}</span>
      </div>
      <ul className="list-none">
        {series.map((s) => (
          <li key={s.name} className="border-b border-black/10 reveal">
            <Link href={s.href} className="group flex items-center gap-4 sm:gap-5 md:gap-8 py-6 md:py-8">
              <span className="font-serif italic text-[11px] sm:text-[12px] md:text-[13px] text-[#9a9188] w-6 sm:w-7 md:w-10 shrink-0">{s.num}</span>
              <div className="relative w-11 sm:w-[44px] aspect-[4/5] overflow-hidden shrink-0 bg-[#ede9e1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.name} className="w-full h-full object-cover object-center" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif italic text-[16px] sm:text-[18px] md:text-[22px] font-normal text-[#3a3835] group-hover:text-[#1a1816] mb-1.5 leading-tight">{s.name}</p>
                <p className="text-[8px] sm:text-[8.5px] md:text-[9.5px] tracking-[.12em] sm:tracking-[.14em] md:tracking-[.16em] uppercase text-[#9a9188] line-clamp-2 sm:truncate">{s.sub}</p>
              </div>
              <span className="text-[9px] sm:text-[9.5px] md:text-[10px] tracking-[.1em] text-[#9a9188] shrink-0">{s.count === 1 ? tc("work_one") : tc("work_other", { count: s.count })}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
