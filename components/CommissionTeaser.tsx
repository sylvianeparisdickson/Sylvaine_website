import Image from "next/image";
import Link from "next/link";

export default function CommissionTeaser() {
  return (
    <section className="flex flex-col md:grid md:grid-cols-2 bg-[#141210]" id="commission">
      {/* Image — full width on mobile, fixed height */}
      <div className="relative w-full h-64 sm:h-80 md:h-auto md:min-h-[520px] overflow-hidden">
        <Image
          src="/timeless-craft.jpg"
          alt="Timeless Craft — Sylviane Paris-Dickson"
          fill
          className="object-cover object-center opacity-65"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center px-6 md:px-16 py-14 md:py-20 reveal">
        <span className="block text-[9px] tracking-[.28em] uppercase text-white/28 mb-5">Commission</span>
        <h2 className="font-serif italic font-light text-white leading-[1.25] mb-5"
          style={{ fontSize: "clamp(26px, 4vw, 42px)" }}>
          Creating Together
        </h2>
        <p className="text-[13.5px] md:text-[14px] text-white/42 leading-[1.9] mb-8 max-w-sm">
          A commissioned painting begins with a conversation. It is a process of listening — to a place, a feeling, or a memory someone wishes to preserve. Together, we shape an artwork that becomes personal, meaningful, and deeply connected to its story.
        </p>
        <Link href="/commission"
          className="self-start border border-white/25 text-white/75 text-[9.5px] tracking-[.22em] uppercase px-8 py-4 transition-all duration-300 hover:bg-white/8 hover:border-white/5 hover:text-white">
          Begin a conversation
        </Link>
      </div>
    </section>
  );
}
