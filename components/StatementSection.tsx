import Image from "next/image";

export default function StatementSection() {
  return (
    <section className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-24 items-center px-6 md:px-14 section-space border-b border-black/10 reveal">
      {/* Text */}
      <div>
        <span className="block text-[9px] tracking-[.22em] uppercase text-[#9a9188] mb-8">Artist statement</span>
        <div className="space-y-5 text-[15px] md:text-[14.5px] text-[#6a6560] leading-[1.95] md:leading-[1.9] max-w-lg">
          <p>I am drawn to spaces shaped by human hands — parks, architectural structures, sculptures, and constructed environments that carry intention, care, and time.</p>
          <p>My background in theatre design deeply shaped the way I perceive space, light, composition, and atmosphere.</p>
          <p>In my paintings, I explore these places not only for their visual presence, but for what they hold beyond it: the quiet imprint of those who created them and those who have passed through them.</p>
          <p>Alongside these public spaces, I am also drawn to more intimate scenes — still lifes that reflect a quieter, personal dimension of experience. A gentle celebration of life.</p>
        </div>
      </div>

      {/* Image */}
      <div>
        <div className="artwork-frame w-full">
          <Image
            src="/morning-visit.jpg"
            alt="Morning Visit — Sylviane Paris"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex justify-between items-baseline mt-4">
          <span className="font-serif italic text-[13px] md:text-[14px] text-[#1a1816]">Morning Visit</span>
          <span className="text-[9px] tracking-[.14em] uppercase text-[#9a9188]">Divine Presence</span>
        </div>
      </div>
    </section>
  );
}
