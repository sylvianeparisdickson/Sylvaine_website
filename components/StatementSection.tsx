import Image from "next/image";

export default function StatementSection() {
  return (
    <section className="flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-20 items-center px-6 md:px-14 py-12 sm:py-16 md:py-24 border-b border-black/10 reveal">
      {/* Text */}
      <div>
        <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-6">Artist statement</span>
        <p className="font-serif italic font-light text-[#1a1816] leading-[1.5] mb-7"
          style={{ fontSize: "clamp(20px, 3.5vw, 32px)" }}>
          I paint spaces shaped by human hands, exploring the quiet presence and memory they hold.
        </p>
        <div className="space-y-4 text-[14px] md:text-[14.5px] text-[#6a6560] leading-[1.9] max-w-lg">
          <p>I am drawn to spaces shaped by human hands — parks, architectural structures, sculptures, and constructed environments that carry intention, care, and time.</p>
          <p>In my paintings, I explore these places not only for their visual presence, but for what they hold beyond it: the quiet imprint of those who created them and those who have passed through them.</p>
          <p>Alongside these public spaces, I am also drawn to more intimate scenes — still lifes that reflect a quieter, personal dimension of experience. A gentle celebration of life.</p>
        </div>
      </div>

      {/* Image */}
      <div>
        <div className="relative overflow-hidden group w-full" style={{ aspectRatio: "3/4" }}>
          <Image
            src="/morning-visit.jpg"
            alt="Morning Visit — Sylviane Paris-Dickson"
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex justify-between items-baseline mt-3">
          <span className="font-serif italic text-[13px] md:text-[14px] text-[#1a1816]">Morning Visit</span>
          <span className="text-[9px] tracking-[.16em] uppercase text-[#9a9188]">Divine Presence</span>
        </div>
      </div>
    </section>
  );
}
