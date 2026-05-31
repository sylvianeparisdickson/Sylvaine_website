import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Studio strip */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-3 px-6 md:px-14 py-8 md:py-10 bg-[#f8f5ef] border-t border-b border-black/10 text-center sm:text-left">
        <div className="space-y-2 max-w-md">
          <p className="font-serif italic text-[13px] sm:text-[14px] md:text-[15px] text-[#6a6560]">
            Permanent exhibition open to visitors
          </p>
          <p className="text-[8px] sm:text-[8.5px] tracking-[.14em] uppercase text-[#9a9188] leading-relaxed">
            Visits by appointment — Northrup King Building · Studio 439
          </p>
        </div>
        <p className="text-[8px] sm:text-[8.5px] md:text-[9px] tracking-[.14em] sm:tracking-[.18em] md:tracking-[.2em] uppercase text-[#9a9188] leading-relaxed">
          Northrup King Building · Studio 439 · Minneapolis, MN
        </p>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center gap-6 px-6 md:px-14 py-8 border-t border-black/10">
        <div className="text-[9.5px] md:text-[10px] text-[#9a9188] tracking-[.04em] leading-[1.8] text-center sm:text-left">
          <p>© Sylviane Paris. All rights reserved.</p>
          <p>No image on this site may be reproduced without written permission.</p>
        </div>
        <ul className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 md:gap-7 list-none">
          {[
            { label: "Instagram", href: "https://www.instagram.com/sylvianeparis" },
            { label: "Facebook", href: "https://www.facebook.com/sylvianeparisdickson" },
            { label: "Contact", href: "/contact" },
          ].map(({ label, href }) => (
            <li key={label}>
              {href.startsWith("http") ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] tracking-[.18em] uppercase text-[#9a9188] hover:text-[#1a1816] transition-colors duration-300"
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className="text-[9px] tracking-[.18em] uppercase text-[#9a9188] hover:text-[#1a1816] transition-colors duration-300">
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </footer>
    </>
  );
}
