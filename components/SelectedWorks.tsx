import Image from "next/image";
import Link from "next/link";

const featured = [
  { img: "/souls-of-the-park.jpg",  title: "The Souls of the Park", series: "Divine Presence",  href: "/study/divine-presence" },
  { img: "/art-of-indulgence.jpg",  title: "The Art of Indulgence", series: "Living Moments",   href: "/study/living-moments" },
  { img: "/whispering-passage.jpg", title: "Whispering Passage",    series: "Enchanted Path",   href: "/study/enchanted-path" },
];

export default function SelectedWorks() {
  return (
    <section className="px-6 md:px-14 py-16 md:py-24 border-t border-black/10">
      <div className="flex justify-between items-baseline border-b border-black/10 pb-4 mb-10 md:mb-12 reveal">
        <span className="text-[9px] tracking-[.28em] uppercase text-[#9a9188]">Selected works</span>
        <Link href="/study" className="text-[9px] md:text-[9.5px] tracking-[.16em] md:tracking-[.18em] uppercase text-[#9a9188] hover:text-[#1a1816] transition-colors duration-300">
          View all →
        </Link>
      </div>
      {/* Single col on mobile, 3 col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-7">
        {featured.map((p, i) => (
          <Link key={p.title} href={p.href} className="group reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="relative overflow-hidden mb-4">
              <Image
                src={p.img}
                alt={p.title}
                width={600}
                height={750}
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <p className="font-serif italic text-[17px] text-[#1a1816] mb-1">{p.title}</p>
            <p className="text-[9.5px] tracking-[.12em] uppercase text-[#9a9188]">{p.series} · Acrylics on Bristol paper</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
