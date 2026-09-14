"use client";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function CVPage() {
  return (
    <main>
      <Nav />
      
      <div className="min-h-screen bg-white px-6 md:px-14 py-16 md:py-24 max-w-4xl mx-auto">
        {/* Print/Download Button */}
        <div className="no-print mb-8 flex justify-end">
          <button
            onClick={() => window.print()}
            className="text-[9px] tracking-[.18em] uppercase text-[#6a6560] hover:text-[#1a1816] transition-colors duration-300 border border-black/20 px-4 py-2 hover:border-[#1a1816]"
          >
            Download / Print CV
          </button>
        </div>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-black/10">
          <h1 className="font-serif text-[32px] md:text-[40px] text-[#1a1816] leading-[.9] mb-4">
            Sylviane Paris
          </h1>
          <p className="text-[14px] md:text-[15px] text-[#6a6560] mb-6">
            Painter | Theatre & Scenic Design
          </p>
          
          <div className="space-y-2 text-[13px] md:text-[14px] text-[#6a6560]">
            <p>Minneapolis, Minnesota</p>
            <p>Northrup King Building · Studio 439</p>
            <p>Email: sylviane.paris_dickson@yahoo.com</p>
            <p>Phone: (612) 750-0998</p>
            <p>
              Website: <a href="https://www.sylvianeparisart.com" target="_blank" rel="noopener noreferrer" className="text-[#1a1816] hover:underline">www.sylvianeparisart.com</a>
            </p>
            <p>Studio visits by appointment</p>
          </div>
        </header>

        {/* Current Artistic Practice */}
        <section className="mb-12">
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#1a1816] mb-4 pb-2 border-b border-black/10">
            Current Artistic Practice
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#6a6560] leading-[1.8]">
            Sylviane Paris is a Minneapolis-based painter whose work explores spaces shaped by human hands—architecture, parks, public gardens, sculpture, constructed environments, interiors and intimate still lifes. Through light, perspective, composition and atmosphere, she explores the presence and memory held within places, and the quiet relationship between people and the environments they create.
          </p>
          <p className="text-[14px] md:text-[15px] text-[#6a6560] leading-[1.8] mt-4">
            Her earlier professional practice in theatre and scenic design continues to inform her understanding of space, structure, material and visual storytelling.
          </p>
        </section>

        {/* Selected Awards & Honors */}
        <section className="mb-12">
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#1a1816] mb-4 pb-2 border-b border-black/10">
            Selected Awards & Honors
          </h2>
          <div className="space-y-4 text-[14px] md:text-[15px] text-[#6a6560]">
            <div>
              <p className="font-medium text-[#1a1816]">2026 — TERAVARNA, 10th Color International Juried Art Competition</p>
              <p>Honorable Mention Award</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2026 — FAME FRAME Gallery, Modern Brushstrokes</p>
              <p>Honorable Mention — Light Renewed</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2026 — Blue Koi Gallery, Pretty in Pink Art Exhibition</p>
              <p>2nd Place — Whispering Passage</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2026 — AweSnapp Art Awards, 1st Edition</p>
              <p>Finalist — The Souls of the Park</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2025 — TERAVARNA, 10th Figurative International Juried Art Competition</p>
              <p>Honorable Mention Award</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2025 — Light Space & Time, 15th Annual Nature Online Art Exhibition</p>
              <p>Special Merit Award</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2025 — TERAVARNA, 13th Open Art Exhibition</p>
              <p>Honorable Mention</p>
            </div>
            <p className="text-[13px] italic text-[#9a9188] mt-4">
              The two TERAVARNA certificates are now documented in the Master CV archive; the 13th Open award remains identified there as part of the historical record.
            </p>
          </div>
        </section>

        {/* Selected Exhibitions */}
        <section className="mb-12">
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#1a1816] mb-4 pb-2 border-b border-black/10">
            Selected Exhibitions
          </h2>
          <div className="space-y-4 text-[14px] md:text-[15px] text-[#6a6560]">
            <div>
              <p className="font-medium text-[#1a1816]">2026 — Minnesota State Fair Fine Arts Exhibition, St. Paul, Minnesota</p>
              <p>Inner Illumination — Juried selection</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2026 — Modern Brushstrokes, FAME FRAME Gallery</p>
              <p>Online international exhibition — Light Renewed</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2026 — Pretty in Pink Art Exhibition, Blue Koi Gallery</p>
              <p>Online exhibition — Whispering Passage</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2026 — AweSnapp Art Awards, 1st Edition</p>
              <p>Online award exhibition — The Souls of the Park</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">2025 — 15th Annual Nature Art Exhibition, Light Space & Time</p>
              <p>Online juried exhibition</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">Ongoing — Permanent Studio Exhibition</p>
              <p>Northrup King Building, Studio 439, Minneapolis, Minnesota</p>
            </div>
          </div>
        </section>

        {/* Selected Professional Artistic Experience */}
        <section className="mb-12">
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#1a1816] mb-4 pb-2 border-b border-black/10">
            Selected Professional Artistic Experience
          </h2>
          <div className="space-y-4 text-[14px] md:text-[15px] text-[#6a6560]">
            <div>
              <p className="font-medium text-[#1a1816]">Théâtre Job — 1789, Bordeaux, France</p>
              <p>Marionettes and Masks — Sylviane Paris</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">Théâtre Alizé — La Gardienne des Rêves, France</p>
              <p>Set Design — Sylviane Paris</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">Théâtre Alizé — En attendant… Maman !, France</p>
              <p>Mask Work — Sylviane Paris</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">L'Histoire du Soldat — Bordeaux–Lomé</p>
              <p>Scenic Painting — Sylviane Paris</p>
              <p className="text-[13px] italic text-[#9a9188]">Five large-scale painted scenic canvases, approximately 3 × 4 meters each.</p>
            </div>
            <div>
              <p className="font-medium text-[#1a1816]">La Fête de la Fleur — Domaine de Chevalier</p>
              <p>Theatre / Scenic Collaboration — Sylviane Paris</p>
            </div>
            <p className="text-[13px] italic text-[#9a9188] mt-4">
              These selected examples represent a broader professional theatre practice involving masks, marionettes, scenery, scenic painting, props and constructed stage elements.
            </p>
          </div>
        </section>

        {/* Teaching Experience */}
        <section className="mb-12">
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#1a1816] mb-4 pb-2 border-b border-black/10">
            Teaching Experience
          </h2>
          <div className="text-[14px] md:text-[15px] text-[#6a6560]">
            <p className="font-medium text-[#1a1816]">Amager International School (AIS), Denmark</p>
            <p className="mb-2">Teacher & Art Teacher | 1997–2009</p>
            <p className="leading-[1.8]">
              Taught students in Grades 1–5, integrating visual arts and theatre through scenery, creative projects, drawing, painting and craft techniques. Developed student projects and presentations for annual Christmas performances and end-of-year exhibitions.
            </p>
          </div>
        </section>

        {/* Selected Skills */}
        <section className="mb-12">
          <h2 className="font-serif text-[18px] md:text-[20px] text-[#1a1816] mb-4 pb-2 border-b border-black/10">
            Selected Skills
          </h2>
          <ul className="space-y-2 text-[14px] md:text-[15px] text-[#6a6560] list-none">
            <li>• Painting and large-scale scenic painting</li>
            <li>• Spatial composition and perspective</li>
            <li>• Scenery and constructed environments</li>
            <li>• Sculpture and sculptural fabrication</li>
            <li>• Masks and marionettes</li>
            <li>• Props and stage elements</li>
            <li>• Visual storytelling</li>
            <li>• Light and atmospheric composition</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-black/10">
          <p className="text-[14px] md:text-[15px] text-[#6a6560]">
            Website: <a href="https://www.sylvianeparisart.com" target="_blank" rel="noopener noreferrer" className="text-[#1a1816] hover:underline">www.sylvianeparisart.com</a>
          </p>
        </footer>
      </div>

      <Footer />

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}
