import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#1a1816]">
      <div className="absolute inset-0 hero-zoom">
        <Image
          src="/artisans.jpg"
          alt="Inner Illumination, The Artisans of God — Sylviane Paris-Dickson"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Veil */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,.22) 0%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.15) 55%, rgba(0,0,0,.75) 100%)"
      }} />

      {/* Centred tagline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-24 md:pb-20 pointer-events-none hero-rise" style={{ animationDelay: "0.7s" }}>
        <p className="font-serif italic font-light text-white/78 text-center leading-[1.7] max-w-xs md:max-w-xl"
          style={{ fontSize: "clamp(15px, 3.5vw, 22px)", textShadow: "0 2px 24px rgba(0,0,0,.5)" }}>
          I paint spaces shaped by human hands,<br />
          exploring the quiet presence and memory they hold.
        </p>
        <div className="w-7 h-px bg-white/28 mt-4" />
      </div>

      {/* Name — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-10 md:pb-16 hero-rise" style={{ animationDelay: "0.4s" }}>
        <p className="flex items-center gap-3 text-[8px] md:text-[9px] tracking-[.24em] md:tracking-[.28em] uppercase text-white/38 mb-3 md:mb-4">
          <span className="block w-6 h-px bg-white/28" />
          Painter · Minneapolis, Minnesota
        </p>
        <h1 className="font-serif text-white/82 leading-[.88] tracking-[.03em] md:tracking-[.04em]"
          style={{ fontSize: "clamp(38px, 10vw, 96px)", fontWeight: 200 }}>
          Sylviane<br />Paris-Dickson
        </h1>
      </div>

      {/* Scroll — hidden on small screens */}
      <div className="hidden md:flex absolute right-14 bottom-16 flex-col items-center gap-2.5 hero-rise-delay">
        <span className="text-[8px] tracking-[.24em] uppercase text-white/30 [writing-mode:vertical-rl]">Scroll</span>
        <div className="w-px h-11 bg-white/25 scroll-pulse" />
      </div>
    </section>
  );
}
