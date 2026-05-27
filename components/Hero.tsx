import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen-safe overflow-hidden bg-[#1a1816]">
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
        background: "linear-gradient(to bottom, rgba(0,0,0,.4) 0%, rgba(0,0,0,.2) 25%, rgba(0,0,0,.4) 55%, rgba(0,0,0,.85) 100%)"
      }} />

      {/* Centred tagline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-10 pb-28 sm:pb-24 md:pb-20 pointer-events-none hero-rise" style={{ animationDelay: "0.7s" }}>
        <p className="font-serif italic font-medium text-white text-center leading-[1.7] max-w-[min(100%,20rem)] sm:max-w-md md:max-w-xl px-2"
          style={{ fontSize: "clamp(15px, 3.5vw, 22px)", textShadow: "0 2px 32px rgba(0,0,0,.8)" }}>
          I paint spaces shaped by human hands, exploring the quiet presence and memory they hold.
        </p>
        <div className="w-7 h-px bg-white/28 mt-4" />
      </div>

      {/* Name — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 md:px-14 pb-8 sm:pb-10 md:pb-16 hero-rise" style={{ animationDelay: "0.4s" }}>
        <p className="flex items-center gap-3 text-[8px] md:text-[9px] tracking-[.24em] md:tracking-[.28em] uppercase text-white/80 mb-3 md:mb-4 drop-shadow-md">
          <span className="block w-6 h-px bg-white/28" />
          Painter · Minneapolis, Minnesota
        </p>
        <h1 className="font-serif text-white leading-[.88] tracking-[.03em] md:tracking-[.04em] drop-shadow-lg"
          style={{ fontSize: "clamp(38px, 10vw, 96px)", fontWeight: 400 }}>
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
