"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/pocketbase";

export default function Footer() {
  const t = useTranslations("Footer");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const success = await subscribeToNewsletter(email);

    if (success) {
      setSubscribed(true);
      setEmail("");
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Studio strip with newsletter */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-6 md:px-14 py-8 md:py-10 bg-[#f8f5ef] border-t border-b border-black/10 text-left">
        <div className="space-y-3 max-w-xl">
          <p className="font-serif italic text-[16px] sm:text-[18px] md:text-[20px] text-[#1a1816]">
            {t("title")}
          </p>
          <p className="text-[13px] md:text-[13.5px] text-[#6a6560] leading-relaxed">
            {t("text")}
          </p>
          <p className="text-[12px] text-[#6a6560]">
            {t("phone")} <a href="tel:+16127500998" className="hover:text-[#1a1816] transition-colors underline decoration-black/20 hover:decoration-black">(612) 750-0998</a>
          </p>
          <div className="space-y-1 pt-2">
            <p className="text-[9.5px] tracking-[.2em] uppercase text-[#1a1816] font-normal">
              {t("studio")}
            </p>
            <p className="text-[9px] tracking-[.16em] uppercase text-[#9a9188]">
              {t("studioSub")}
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full md:w-auto max-w-md">
          <p className="text-[9.5px] tracking-[.2em] uppercase text-[#1a1816] mb-2">
            {t("newsletterHeading")}
          </p>
          <p className="text-[12px] text-[#6a6560] mb-4">
            {t("newsletterText")}
          </p>

          {!subscribed ? (
            <>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletterPlaceholder")}
                  required
                  className="flex-1 bg-transparent border border-black/12 px-4 py-2 text-[13px] text-[#1a1816] placeholder:text-black/20 outline-none focus:border-black/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#1a1816] text-white text-[10px] tracking-[.18em] uppercase hover:bg-[#3a3836] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : t("newsletterButton")}
                </button>
              </form>
              {error && (
                <p className="text-[11px] text-red-500 mt-2">
                  Something went wrong. Please try again.
                </p>
              )}
            </>
          ) : (
            <p className="text-[13px] text-[#1a1816] font-serif italic">
              Thank you for subscribing.
            </p>
          )}
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
