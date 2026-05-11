"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { label: "Study", href: "/study" },
  { label: "Commission", href: "/commission" },
  { label: "Collectors", href: "/collectors" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navBg = scrolled || open
    ? "bg-white/97 backdrop-blur-md border-b border-black/10"
    : "border-b border-transparent";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-14 py-5 md:py-7 transition-all duration-500 ${navBg}`}>
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`font-serif text-[12px] md:text-[13.5px] font-light tracking-[.24em] md:tracking-[.28em] uppercase transition-colors duration-500 ${
            scrolled || open ? "text-[#1a1816]" : "text-white/85"
          }`}
        >
          Sylviane Paris-Dickson
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-11 list-none">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`text-[9.5px] tracking-[.22em] uppercase font-light transition-colors duration-300 ${
                  scrolled ? "text-[#6a6560] hover:text-[#1a1816]" : "text-white/55 hover:text-white/95"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] z-50"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px transition-all duration-300 ${
            open
              ? "rotate-45 translate-y-[6px] bg-[#1a1816]"
              : scrolled ? "bg-[#1a1816]" : "bg-white"
          }`} />
          <span className={`block w-6 h-px transition-all duration-300 ${
            open ? "opacity-0 bg-[#1a1816]" : scrolled ? "bg-[#1a1816]" : "bg-white"
          }`} />
          <span className={`block w-6 h-px transition-all duration-300 ${
            open
              ? "-rotate-45 -translate-y-[6px] bg-[#1a1816]"
              : scrolled ? "bg-[#1a1816]" : "bg-white"
          }`} />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col justify-center items-center gap-10 transition-all duration-500 md:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        {links.map(({ label, href }, i) => (
          <Link
            key={label}
            href={href}
            onClick={() => setOpen(false)}
            className="font-serif italic text-[32px] font-light text-[#1a1816] tracking-[.02em] transition-colors duration-300 hover:text-[#6a6560]"
            style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
          >
            {label}
          </Link>
        ))}
        <p className="text-[9px] tracking-[.22em] uppercase text-[#9a9188] mt-4">
          Northrup King Building · Studio 439
        </p>
      </div>
    </>
  );
}
