"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <>
      {/* Studio strip */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-6 md:px-14 py-8 md:py-10 bg-[#f8f5ef] border-t border-b border-black/10 text-left">
        <div className="space-y-2 max-w-xl">
          <p className="font-serif italic text-[16px] sm:text-[18px] md:text-[20px] text-[#1a1816]">
            {t("title")}
          </p>
          <p className="text-[13px] md:text-[13.5px] text-[#6a6560] leading-relaxed">
            {t("text")}
          </p>
          <p className="text-[12px] text-[#6a6560]">
            {t("phone")} <a href="tel:+16127500998" className="hover:text-[#1a1816] transition-colors underline decoration-black/20 hover:decoration-black">(612) 750-0998</a>
          </p>
        </div>
        <div className="shrink-0 space-y-1">
          <p className="text-[9.5px] tracking-[.2em] uppercase text-[#1a1816] font-normal">
            {t("studio")}
          </p>
          <p className="text-[9px] tracking-[.16em] uppercase text-[#9a9188]">
            {t("studioSub")}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row justify-between items-center gap-6 px-6 md:px-14 py-8 border-t border-black/10">
        <div className="text-[9.5px] md:text-[10px] text-[#9a9188] tracking-[.04em] leading-[1.8] text-center sm:text-left">
          <p>{t("copyright")}</p>
          <p>{t("warning")}</p>
        </div>
        <ul className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 md:gap-7 list-none">
          {[
            { label: "Instagram", href: "https://www.instagram.com/sylvianeparis" },
            { label: "Facebook", href: "https://www.facebook.com/sylvianeparisdickson" },
            { label: t("contact"), href: "/contact" },
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
