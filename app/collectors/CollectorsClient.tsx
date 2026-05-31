"use client";
import Image from "next/image";
import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const testimonials = [
    {
        id: "ss",
        label: "Collector",
        title: "A Quiet Joy",
        by: "SS",
        en: "This painting fills our home with a sense of calm and peace — it truly brings us joy. We will cherish its beauty and artistry for years to come.",
        fr: "Ce tableau remplit notre maison d'un sentiment de calme et de paix — il nous apporte une véritable joie. Nous chérirons sa beauté et son travail artistique pendant de nombreuses années.",
    },
    {
        id: "dm",
        label: "Collector",
        title: "A Moment Forever",
        by: "DM",
        en: "I gifted my husband a drawing by Sylviane Paris. She beautifully captured our marsh and the most divine sunset we had ever seen. Thanks to her talent, we are able to relive that magical moment forever.",
        fr: "J'ai offert à mon mari un dessin réalisé par Sylviane Paris. Elle a magnifiquement capturé notre marais et le plus beau coucher de soleil que nous ayons jamais vu. Grâce à son talent, nous pouvons revivre ce moment magique pour toujours.",
    },
    {
        id: "js",
        label: "Collector",
        title: "A Home Remembered",
        by: "JS",
        en: "Sylviane Paris beautifully captured the essence of our home. Looking at the painting brings back all the special moments shared with family and friends, and the love we felt there. It is a treasured keepsake to be enjoyed now and passed on to our children and grandchildren.",
        fr: "Sylviane Paris a magnifiquement capté l'essence de notre maison. En regardant ce tableau, tous les moments précieux partagés en famille et entre amis reviennent à la mémoire, ainsi que l'amour que nous avons vécu en ces lieux. C'est un souvenir précieux, à apprécier aujourd'hui et à transmettre à nos enfants et petits-enfants.",
    },
];

export default function CollectorsClient() {
    const [openFr, setOpenFr] = useState<Record<string, boolean>>({});
    const [bmFr, setBmFr] = useState(false);

    const toggleFr = (id: string) =>
        setOpenFr((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <main>
            <Nav />

            {/* HERO */}
            <section className="relative w-full min-h-[55dvh] sm:min-h-[65dvh] md:min-h-[72vh] overflow-hidden">
                <Image
                    src="/natures-guardians.jpg"
                    alt="Nature's Guardians — Sylviane Paris"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.7) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-12 md:pb-16">
                    <p className="flex items-center gap-3 text-[9px] tracking-[.28em] uppercase text-white/42 mb-4">
                        <span className="block w-7 h-px bg-white/32" />
                        Collector Stories
                    </p>
                    <h1 className="font-serif font-light text-white leading-[.88]"
                        style={{ fontSize: "clamp(40px, 6.5vw, 88px)", fontWeight: 200 }}>
                        Words from those<br />who carry the work.
                    </h1>
                </div>
            </section>

            {/* OPENING TEXT */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border-b border-black/10">
                <div className="px-6 md:px-14 py-10 md:py-16 border-b md:border-b-0 md:border-r border-black/10 flex items-center">
                    <span className="text-[9px] tracking-[.28em] uppercase text-[#9a9188]">About these works</span>
                </div>
                <div className="px-6 md:px-16 py-10 md:py-16">
                    <div className="font-serif italic font-light text-[#1a1816] leading-[1.65] space-y-4"
                        style={{ fontSize: "clamp(17px, 2.2vw, 24px)" }}>
                        <p>Each piece I create holds a presence — of a place, a moment, or a memory quietly lived.</p>
                        <p>Over time, these works become part of the homes and lives of those who receive them.</p>
                        <p className="text-[#6a6560]">Here are a few words from collectors who share that experience.</p>
                    </div>
                </div>
            </div>

            {/* BM — FEATURED */}
            <div className="bg-[#141210] px-6 md:px-14 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div>
                    <span className="block text-[9px] tracking-[.26em] uppercase text-white/28 mb-5">Collector · Private commission</span>
                    <h2 className="font-serif italic font-light text-white leading-[1.1] mb-6"
                        style={{ fontSize: "clamp(24px, 3vw, 38px)" }}>
                        Where Memory Breathes
                    </h2>
                    <p className="text-[14.5px] text-white/50 leading-[1.9] mb-5">
                        We own a painting by Sylviane in our living room — a moment beautifully suspended in time,
                        inspired by our old family bread oven. Every detail feels true. The stone bench, where my
                        grandfather once sat, seems as if it is still waiting for him. The 17th-century stones carry
                        a deep sense of memory, evoking emotions from another era. And on the table, the freshly
                        baked bread seems to still release its warm aroma.
                    </p>
                    <p className="text-[9px] tracking-[.2em] uppercase text-white/28 mb-4">BM</p>
                    <button onClick={() => setBmFr(!bmFr)}
                        className="font-serif italic text-[13px] text-white/35 border-b border-white/15 pb-0.5 bg-none outline-none cursor-pointer hover:text-white/60 transition-colors duration-300">
                        {bmFr ? "Masquer la version française" : "Lire le témoignage en français"}
                    </button>
                    {bmFr && (
                        <div className="mt-5 pt-5 border-t border-white/8">
                            <p className="font-serif italic text-[13.5px] text-white/38 leading-[1.85]">
                                Nous possédons un tableau de Sylviane dans notre séjour, véritable vision figée dans le temps,
                                inspirée de notre ancien four à pain familial. Chaque détail est empreint de justesse.
                                Le banc de pierre, où mon grand-père s'asseyait, semble encore attendre son retour.
                                Les pierres du XVIIe siècle, chargées de mémoire, font naître une émotion profonde,
                                comme venue d&apos;une autre époque. Et sur la table, les pains tout juste sortis du four
                                semblent encore en diffuser le parfum.
                            </p>
                        </div>
                    )}
                </div>
                <div className="border-t md:border-t-0 md:border-l border-white/8 pt-8 md:pt-0 md:pl-20">
                    <p className="font-serif text-[96px] leading-[.6] text-white/5 mb-4">"</p>
                    <p className="font-serif italic font-light text-white/55 leading-[1.6]"
                        style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}>
                        A moment beautifully suspended in time — the stone bench, where my grandfather once sat,
                        seems as if it is still waiting for him.
                    </p>
                </div>
            </div>

            {/* 3-COLUMN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black/10">
                {testimonials.map((t, i) => (
                    <div key={t.id}
                        className={`px-6 md:px-12 py-12 md:py-16 border-b md:border-b-0 ${i < testimonials.length - 1 ? "md:border-r border-black/10" : ""
                            }`}>
                        <span className="block text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-5">{t.label}</span>
                        <h3 className="font-serif italic font-normal text-[#1a1816] leading-[1.15] mb-5"
                            style={{ fontSize: "clamp(18px, 2vw, 24px)" }}>
                            {t.title}
                        </h3>
                        <p className="text-[14px] text-[#6a6560] leading-[1.88] mb-4">{t.en}</p>
                        <p className="text-[8.5px] tracking-[.18em] uppercase text-[#9a9188] mb-3">{t.by}</p>
                        <button onClick={() => toggleFr(t.id)}
                            className="font-serif italic text-[12.5px] text-[#9a9188] border-b border-black/15 pb-0.5 bg-none outline-none cursor-pointer hover:text-[#1a1816] transition-colors duration-300">
                            {openFr[t.id] ? "Masquer" : "Lire en français"}
                        </button>
                        {openFr[t.id] && (
                            <div className="mt-4 pt-4 border-t border-black/8">
                                <p className="font-serif italic text-[13.5px] text-[#9a9188] leading-[1.85]">{t.fr}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* CTA STRIP */}
            <div className="bg-[#f8f5ef] px-6 md:px-14 py-14 md:py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-t border-black/10">
                <div>
                    <h3 className="font-serif italic font-light text-[#1a1816] leading-[1.15] mb-2"
                        style={{ fontSize: "clamp(22px, 2.8vw, 34px)" }}>
                        Commission your own painting.
                    </h3>
                    <p className="text-[13.5px] text-[#6a6560] leading-[1.7]">
                        A place, a memory, a moment — translated into something you will keep forever.
                    </p>
                </div>
                <a href="/commission"
                    className="group inline-flex w-full sm:w-auto justify-center items-center gap-3 bg-[#1a1816] text-white text-[9.5px] tracking-[.24em] uppercase font-light px-10 py-5 hover:bg-[#3a3835] transition-all duration-300 sm:whitespace-nowrap">
                    Begin a conversation
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
            </div>

            <Footer />
        </main>
    );
}
