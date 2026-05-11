export default function CollectorQuote() {
  return (
    <section className="px-6 md:px-14 py-16 md:py-24 max-w-3xl mx-auto text-center border-t border-black/10 reveal">
      <span className="block font-serif text-[52px] md:text-[64px] leading-[0.6] text-black/10 mb-5">"</span>
      <p className="font-serif italic font-light text-[#1a1816] leading-[1.72] mb-6"
        style={{ fontSize: "clamp(16px, 3vw, 22px)" }}>
        We own a painting by Sylviane in our living room — a moment beautifully suspended in time, inspired by our old family bread oven. Every detail feels true. The stone bench, where my grandfather once sat, seems as if it is still waiting for him.
      </p>
      <p className="text-[9px] tracking-[.22em] uppercase text-[#9a9188]">BM &nbsp;·&nbsp; Private commission</p>
    </section>
  );
}
