import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-screen-safe overflow-hidden bg-[#1a1816]">
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <Image
            src="/artisans.jpg"
            alt="Inner Illumination — Sylviane Paris"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Veil */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,.4) 0%, rgba(0,0,0,.2) 25%, rgba(0,0,0,.4) 55%, rgba(0,0,0,.85) 100%)"
      }} />

      {/* Centred tagline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-24 md:pb-20 pointer-events-none hero-rise" style={{ animationDelay: "0.7s" }}>
        <p className="font-serif italic font-normal text-white text-center leading-[1.7] max-w-xs md:max-w-xl"
          style={{ fontSize: "clamp(15px, 3.5vw, 22px)", textShadow: "0 2px 32px rgba(0,0,0,.8)" }}>
          I paint spaces shaped by human hands,<br />
          exploring the quiet presence and memory they hold.
        </p>
        <div className="w-7 h-px bg-white/28 mt-4" />
      </div>

      {/* Name — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-10 md:pb-16 hero-rise" style={{ animationDelay: "0.4s" }}>
        <p className="flex items-center gap-3 text-[8px] md:text-[9px] tracking-[.18em] md:tracking-[.22em] uppercase text-white/80 mb-3 md:mb-4 drop-shadow-md">
          <span className="block w-6 h-px bg-white/28" />
          Painter · Minneapolis, Minnesota
        </p>
        <h1 className="font-serif text-white leading-[.92] tracking-[.01em] md:tracking-[.015em] drop-shadow-lg"
          style={{ fontSize: "clamp(38px, 10vw, 96px)", fontWeight: 400 }}>
          Sylviane<br />Paris
        </h1>
      </div>
    </section>
  );
}
