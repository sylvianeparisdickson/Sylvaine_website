"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const currentLocale = window.location.pathname.split("/")[1] || "en";
    setLocale(currentLocale);
  }, [pathname]);

  const links = [
    { label: t("series"), href: "/study" },
    { label: t("commission"), href: "/commission" },
    { label: t("collectors"), href: "/collectors" },
    { label: t("limitedEditions"), href: "/limited-editions" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const locales = [
    { code: "en", flag: "/flags/us.svg" },
    { code: "fr", flag: "/flags/fr.svg" },
    { code: "es", flag: "/flags/es.svg" },
  ];

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navBg = "bg-white/97 backdrop-blur-md border-b border-black/10";

  return (
    <>
      <nav className={`sticky top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-14 py-5 md:py-7 ${navBg}`}>
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className={`font-serif text-[10px] sm:text-[12px] md:text-[13.5px] font-normal tracking-[.12em] sm:tracking-[.16em] md:tracking-[.2em] uppercase transition-colors duration-500 text-[#1a1816] max-w-[55vw] sm:max-w-none truncate sm:overflow-visible sm:whitespace-normal`}
        >
          Sylviane Paris
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-11 list-none items-center">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`text-[9.5px] tracking-[.18em] uppercase font-normal transition-colors duration-300 text-[#6a6560] hover:text-[#1a1816]`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="flex gap-2 ml-4">
            {locales.map(({ code, flag }) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                className={`relative w-6 h-4 transition-opacity duration-300 ${locale === code ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={flag}
                  alt={code}
                  className="w-full h-full object-cover rounded-sm"
                />
              </button>
            ))}
          </li>
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
              : "bg-[#1a1816]"
          }`} />
          <span className={`block w-6 h-px transition-all duration-300 ${
            open ? "opacity-0 bg-[#1a1816]" : "bg-[#1a1816]"
          }`} />
          <span className={`block w-6 h-px transition-all duration-300 ${
            open
              ? "-rotate-45 -translate-y-[6px] bg-[#1a1816]"
              : "bg-[#1a1816]"
          }`} />
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div className={`fixed inset-0 z-40 bg-white flex flex-col justify-center items-center gap-6 sm:gap-8 px-8 overflow-y-auto overscroll-contain md:hidden pb-[env(safe-area-inset-bottom)] pt-24 transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        {links.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            onClick={() => setOpen(false)}
            className="font-serif italic text-[24px] sm:text-[28px] font-normal text-[#1a1816] tracking-[.01em] hover:text-[#6a6560]"
          >
            {label}
          </Link>
        ))}
        <div className="flex gap-4">
          {locales.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => {
                switchLocale(code);
                setOpen(false);
              }}
              className={`relative w-8 h-5 transition-opacity duration-300 ${locale === code ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flag}
                alt={code}
                className="w-full h-full object-cover rounded-sm"
              />
            </button>
          ))}
        </div>
        <p className="text-[9px] tracking-[.22em] uppercase text-[#9a9188] mt-4">
          Northrup King Building · Studio 439
        </p>
      </div>
    </>
  );
}
