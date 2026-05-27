import Image from "next/image";
import Link from "next/link";

const series = [
  { num: "I",   name: "Architecture of Light", sub: "Sacred & contemplative spaces",    count: "1 work",  img: "/artisans.jpg",      href: "/study/architecture-of-light" },
  { num: "II",  name: "Divine Presence",        sub: "Form, sculpture & quiet encounter", count: "2 works", img: "/morning-visit.jpg",  href: "/study/divine-presence" },
  { num: "III", name: "Living Moments",         sub: "Intimate spaces & everyday beauty", count: "3 works", img: "/art-of-indulgence.jpg", href: "/study/living-moments" },
  { num: "IV",  name: "Enchanted Path",         sub: "Nature as passage & transformation", count: "1 work", img: "/whispering-passage.jpg", href: "/study/enchanted-path" },
  { num: "V",   name: "Studies",                sub: "Early works & explorations",        count: "3 works", img: "/natures-guardians.jpg",  href: "/study/studies" },
];

export default function CollectionsSection() {
  return (
    <section className="px-6 md:px-14 py-16 md:py-24 bg-[#f8f5ef]" id="study">
      <div className="flex justify-between items-baseline border-b border-black/10 pb-4 mb-0">
        <span className="text-[9px] tracking-[.28em] uppercase text-[#9a9188]">Collections</span>
      </div>
      <ul className="list-none">
        {series.map((s, i) => (
          <li key={s.name} className="border-b border-black/10 reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
            <Link href={s.href} className="group flex items-center gap-3 sm:gap-4 md:gap-8 py-5 md:py-7 transition-all duration-300 md:hover:px-2">
              <span className="font-serif italic text-[11px] sm:text-[12px] md:text-[13px] text-[#9a9188] w-6 sm:w-7 md:w-10 shrink-0">{s.num}</span>
              <div className="relative w-10 h-12 sm:w-[44px] sm:h-[54px] md:w-[52px] md:h-16 overflow-hidden shrink-0">
                <Image src={s.img} alt={s.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="52px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif italic text-[16px] sm:text-[18px] md:text-[22px] font-normal text-[#3a3835] transition-colors duration-300 group-hover:text-[#1a1816] mb-1 leading-tight">{s.name}</p>
                <p className="text-[8px] sm:text-[8.5px] md:text-[9.5px] tracking-[.12em] sm:tracking-[.14em] md:tracking-[.16em] uppercase text-[#9a9188] line-clamp-2 sm:truncate">{s.sub}</p>
                <p className="text-[8px] tracking-[.1em] text-[#9a9188] mt-1 sm:hidden">{s.count}</p>
              </div>
              <span className="text-[9px] sm:text-[9.5px] md:text-[10px] tracking-[.1em] text-[#9a9188] shrink-0 hidden sm:block">{s.count}</span>
              <span className="text-[14px] md:text-[16px] text-[#9a9188] opacity-100 md:opacity-0 md:-translate-x-1 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-x-0 shrink-0">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
