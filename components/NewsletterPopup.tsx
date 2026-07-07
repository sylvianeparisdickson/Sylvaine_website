"use client";
import { useEffect, useState } from "react";
import { subscribeToNewsletter } from "@/lib/pocketbase";

const STORAGE_KEY = "sp_newsletter_dismissed";
const DELAY_MS = 4000; // 4 seconds after load

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed / subscribed
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Storage blocked — show anyway
    }

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* */ }
    setTimeout(() => setVisible(false), 420);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const ok = await subscribeToNewsletter(email);
    if (ok) {
      setStatus("success");
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch { /* */ }
      setTimeout(dismiss, 2800);
    } else {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter subscription"
        className={`fixed z-[61] bottom-0 left-0 right-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg w-full
          bg-[#faf8f4] border border-black/10 shadow-2xl
          transition-all duration-[420ms] ease-out
          ${closing
            ? "opacity-0 translate-y-8 sm:translate-y-4"
            : "opacity-100 translate-y-0"
          }
        `}
      >
        {/* Top ornament strip */}
        <div className="h-[3px] bg-gradient-to-r from-[#c9b99a] via-[#1a1816] to-[#c9b99a]" />

        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close newsletter popup"
          className="absolute top-4 right-4 text-[#9a9188] hover:text-[#1a1816] transition-colors duration-200 p-1"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        <div className="px-8 pt-9 pb-10 sm:px-10 sm:pt-11 sm:pb-12">
          {/* Eyebrow */}
          <p className="text-[9px] tracking-[.28em] uppercase text-[#c9b99a] mb-4 font-normal">
            Studio Newsletter
          </p>

          {/* Heading */}
          <h2 className="font-serif italic text-[26px] sm:text-[30px] text-[#1a1816] leading-tight mb-3">
            Stay close to the studio
          </h2>

          {/* Body */}
          <p className="text-[12.5px] sm:text-[13px] text-[#6a6560] leading-relaxed mb-7 max-w-sm">
            Be the first to know when a new painting joins the collection, follow the stories behind each work, and receive exclusive offers &amp; blog updates — quietly delivered to your inbox.
          </p>

          {status === "success" ? (
            <div className="py-4 text-center">
              <p className="font-serif italic text-[18px] text-[#1a1816] mb-1">Thank you.</p>
              <p className="text-[12px] text-[#6a6560] tracking-wide">
                Welcome to the studio. We&apos;ll be in touch.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  id="nl-popup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={status === "loading"}
                  className="flex-1 bg-white border border-black/12 px-4 py-3 text-[13px] text-[#1a1816] placeholder:text-black/25 outline-none focus:border-[#1a1816]/40 transition-colors disabled:opacity-50"
                />
                <button
                  id="nl-popup-submit"
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3 bg-[#1a1816] text-white text-[9.5px] tracking-[.2em] uppercase hover:bg-[#3a3836] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === "loading" ? "···" : "Subscribe"}
                </button>
              </form>

              {status === "error" && (
                <p className="text-[11px] text-red-500">
                  Something went wrong — please try again.
                </p>
              )}

              <p className="text-[10px] text-[#b0a89e] leading-relaxed">
                No spam, ever. Unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
