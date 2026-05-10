import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Studio strip */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-6 md:px-14 py-6 md:py-8 bg-[#f8f5ef] border-t border-b border-black/10 text-center sm:text-left">
        <p className="font-serif italic text-[14px] md:text-[15px] text-[#6a6560]">Permanent exhibition open to visitors</p>
        <p className="text-[8.5px] md:text-[9px] tracking-[.18em] md:tracking-[.2em] uppercase text-[#9a9188]">
          Northrup King Building · Studio 439 · Minneapolis, MN
        </p>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 md:px-14 py-6 border-t border-black/10">
        <div className="text-[9.5px] md:text-[10px] text-[#9a9188] tracking-[.04em] leading-[1.7] text-center sm:text-left">
          <p>© Sylviane Paris-Dickson. All rights reserved.</p>
          <p>No image on this site may be reproduced without written permission.</p>
        </div>
        <ul className="flex gap-6 md:gap-7 list-none">
          {[{ label: "Instagram", href: "#" }, { label: "Facebook", href: "#" }, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
            <li key={label}>
              <Link href={href} className="text-[9px] tracking-[.18em] uppercase text-[#9a9188] hover:text-[#1a1816] transition-colors duration-300">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </>
  );
}
