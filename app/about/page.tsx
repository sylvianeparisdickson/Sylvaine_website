import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Sylviane Paris",
  description:
    "About Sylviane Paris, painter born in France and based in Minneapolis, Minnesota. Theater designer turned fine artist exploring space, light, and memory.",
};

export default function AboutPage() {
  return (
    <main>
      <Nav />

      <section className="relative overflow-hidden border-b border-black/10 bg-[linear-gradient(180deg,#f7f2eb_0%,#fbfaf7_55%,#ffffff_100%)]">
        <div className="px-6 md:px-14 pt-24 md:pt-32 pb-[4.5rem] md:pb-24">
          <div className="max-w-6xl mx-auto">
            <p className="flex items-center gap-3 text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-8">
              <span className="block w-7 h-px bg-[#b8afa4]" />
              About
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,360px)] gap-12 lg:gap-16 items-end">
              <div>
                <h1
                  className="font-serif italic font-light text-[#1a1816] leading-[.92] mb-6"
                  style={{ fontSize: "clamp(42px, 7.2vw, 92px)" }}
                >
                  A life shaped by
                  <br />
                  space, light,
                  <br />
                  and quiet presence.
                </h1>
                <p className="max-w-2xl text-[15px] md:text-[16px] text-[#6a6560] leading-[1.95]">
                  Born in France and now based in Minneapolis, Sylviane Paris
                  paints places, interiors, and still moments with an
                  attentiveness that comes from years of looking closely at how
                  atmosphere, memory, and form live together.
                </p>
              </div>
              <div className="border border-black/10 bg-white/70 backdrop-blur-sm px-6 py-7 md:px-8 md:py-8">
                <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-4">
                  Studio
                </p>
                <div className="space-y-3">
                  <p
                    className="font-serif italic font-light text-[#1a1816] leading-[1.5]"
                    style={{ fontSize: "clamp(18px, 2.2vw, 24px)" }}
                  >
                    Northrup King Building
                    <br />
                    Studio 439
                  </p>
                  <p className="text-[13.5px] text-[#6a6560] leading-[1.8]">
                    Minneapolis, Minnesota
                    <br />
                    Painter working between architectural space, gardens, still
                    life, and memory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-16 md:py-24 border-b border-black/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 md:gap-12">
          <div>
            <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188]">
              The Artist
            </span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,.8fr)] gap-10 md:gap-14">
            <div>
              <p
                className="font-serif italic font-light text-[#1a1816] leading-[1.5] mb-8"
                style={{ fontSize: "clamp(22px, 2.7vw, 34px)" }}
              >
                Her work begins in observation, but it stays for the emotional
                atmosphere a place leaves behind.
              </p>
              <div className="space-y-6 text-[15px] text-[#6a6560] leading-[1.95] max-w-2xl">
                <p>
                  Sylviane&apos;s artistic path began in France, where she worked
                  as a theater designer. That early practice sharpened her
                  sensitivity to composition, perspective, and the expressive
                  power of light within constructed space.
                </p>
                <p>
                  Today, that same sensibility continues through painting.
                  Whether depicting a park, a sculpture garden, an interior, or
                  a still life, she is drawn to scenes that hold a sense of
                  presence, memory, and quiet reflection.
                </p>
                <p>
                  Her paintings have been exhibited in France, Denmark, and the
                  United States, and are held in private collections.
                </p>
              </div>
            </div>
            <div className="bg-[#f8f5ef] border border-black/8 px-6 py-7 md:px-8 md:py-9 self-start">
              <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-5">
                Practice
              </p>
              <div className="space-y-5 text-[14px] text-[#6a6560] leading-[1.85]">
                <p>
                  Themes: architectural presence, public gardens, interiors,
                  still life, memory.
                </p>
                <p>
                  Focus: atmosphere, perspective, and the quiet relationship
                  between people and place.
                </p>
                <p className="font-serif italic text-[13.5px] text-[#8d847a]">
                  Earlier works may be signed Sylviane Dickson. All works are
                  by the same artist, Sylviane Paris.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-16 md:py-20 border-b border-black/10 bg-[#fcfaf6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            <div className="bg-[#fcfaf6] px-6 py-8 md:px-8 md:py-10">
              <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-5">
                Foundation
              </p>
              <h2
                className="font-serif italic font-light text-[#1a1816] leading-[1.2] mb-4"
                style={{ fontSize: "clamp(20px, 2.3vw, 30px)" }}
              >
                From theater
                <br />
                to painting
              </h2>
              <p className="text-[14px] text-[#6a6560] leading-[1.85]">
                A background in stage design informs the way space is arranged,
                lit, and emotionally felt within each composition.
              </p>
            </div>
            <div className="bg-[#fcfaf6] px-6 py-8 md:px-8 md:py-10">
              <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-5">
                Perspective
              </p>
              <h2
                className="font-serif italic font-light text-[#1a1816] leading-[1.2] mb-4"
                style={{ fontSize: "clamp(20px, 2.3vw, 30px)" }}
              >
                The life
                <br />
                within places
              </h2>
              <p className="text-[14px] text-[#6a6560] leading-[1.85]">
                Gardens, structures, and intimate objects become vessels for
                memory, stillness, and the traces of human presence.
              </p>
            </div>
            <div className="bg-[#fcfaf6] px-6 py-8 md:px-8 md:py-10">
              <p className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-5">
                Studio Life
              </p>
              <h2
                className="font-serif italic font-light text-[#1a1816] leading-[1.2] mb-4"
                style={{ fontSize: "clamp(20px, 2.3vw, 30px)" }}
              >
                Rooted in
                <br />
                Minneapolis
              </h2>
              <p className="text-[14px] text-[#6a6560] leading-[1.85]">
                Her studio at Northrup King Building offers a place where
                visitors can encounter the work closely and in person.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-[4.5rem] md:py-24 border-b border-black/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-10 md:gap-14">
          <div>
            <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-8">
              Artist Statement
            </span>
            <h2
              className="font-serif italic font-light text-[#1a1816] leading-[1.08]"
              style={{ fontSize: "clamp(28px, 3.4vw, 46px)" }}
            >
              On space,
              <br />
              light,
              <br />
              and presence.
            </h2>
          </div>
          <div>
            <div className="border-t border-black/10 pt-8 md:pt-10">
              <p
                className="font-serif italic font-light text-[#1a1816] leading-[1.55] mb-10 max-w-3xl"
                style={{ fontSize: "clamp(20px, 2.4vw, 30px)" }}
              >
                I am drawn to spaces shaped by human hands - parks,
                architectural structures, sculptures, and constructed
                environments that carry intention, care, and time.
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10 text-[15px] text-[#6a6560] leading-[1.95]">
                <div className="space-y-6">
                  <p>
                    In my paintings, I explore these places not only for their
                    visual presence, but for what they hold beyond it: the quiet
                    imprint of those who created them and those who have passed
                    through them.
                  </p>
                  <p>
                    These environments, often familiar and open to all, become
                    sites of contemplation where absence and presence coexist.
                  </p>
                  <p>
                    Alongside these public and shared spaces, I am also drawn to
                    more intimate scenes - still lifes that reflect a quieter,
                    personal dimension of experience. Within these moments, I
                    see a gentle celebration of life, where simple objects and
                    arrangements hold traces of living, time, and attention.
                  </p>
                </div>
                <div className="space-y-6">
                  <p>
                    Light, perspective, and composition guide my process. I am
                    particularly interested in moments where a shift in angle or
                    atmosphere reveals something subtle - when a place or an
                    object begins to feel inhabited, even in stillness.
                  </p>
                  <p>
                    Through painting, I seek to honor these spaces and moments
                    by capturing their atmosphere and allowing their silent
                    presence to emerge.
                  </p>
                  <p>
                    My work invites a slower way of seeing, where the ordinary
                    becomes quietly significant and where memory - and a quiet
                    celebration of life - can be sensed within both the built
                    environment and intimate spaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-14 py-16 md:py-20 bg-[#f7f2eb] border-b border-black/10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-14">
          <div className="max-w-2xl">
            <p className="text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-5">
              Visit or connect
            </p>
            <h2
              className="font-serif italic font-light text-[#1a1816] leading-[1.05] mb-4"
              style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
            >
              See the work in person
              <br />
              or begin a conversation.
            </h2>
            <p className="text-[14.5px] text-[#6a6560] leading-[1.85]">
              The studio gallery is located at Northrup King Building, Studio
              439, in Minneapolis. For commissions, exhibitions, or general
              inquiries, the contact page is the best place to reach out.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-[#1a1816] text-white text-[9.5px] tracking-[.24em] uppercase font-light px-10 py-5 transition-all duration-300 hover:bg-[#3a3835]"
          >
            Contact the studio
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
