"use client";
import Image from "next/image";
import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      first_name: (form.elements.namedItem("first_name") as HTMLInputElement).value,
      last_name:  (form.elements.namedItem("last_name")  as HTMLInputElement).value,
      email:      (form.elements.namedItem("email")      as HTMLInputElement).value,
      subject:    (form.elements.namedItem("subject")    as HTMLInputElement).value,
      message:    (form.elements.namedItem("message")    as HTMLTextAreaElement).value,
    };

    try {
      // Save to Pocketbase
      const pbRes = await fetch(
        `${process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sgzo0nrujpc3b4h.ba7w.pocketbasecloud.com"}/api/collections/contact_submissions/records`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!pbRes.ok) throw new Error("Pocketbase failed");

      // Send email notification
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Nav />

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-0 md:min-h-screen">

        {/* LEFT — painting */}
        <div className="relative overflow-hidden h-[50vh] sm:h-[55vw] md:h-auto md:min-h-[320px]">
          <Image
            src="/morning-visit.jpg"
            alt="Morning Visit — Sylviane Paris"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 50%)" }} />
          <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 right-5 sm:right-auto">
            <p className="font-serif italic text-[11px] sm:text-[12px] text-white/55 tracking-[.06em]">
              Morning Visit &nbsp;·&nbsp; Divine Presence
            </p>
          </div>
        </div>

        {/* RIGHT — contact */}
        <div className="flex flex-col justify-center px-6 md:px-16 py-16 md:py-24 bg-[#faf9f6] overflow-y-auto">

          <p className="flex items-center gap-3 text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-5">
            <span className="block w-7 h-px bg-[#9a9188]" />
            Contact
          </p>

          <h1 className="font-serif italic font-light text-[#1a1816] leading-[.92] mb-4"
            style={{ fontSize: "clamp(32px, 3.8vw, 54px)" }}>
            Let&apos;s begin<br />a conversation.
          </h1>

          <p className="text-[13.5px] text-[#6a6560] leading-[1.85] mb-10 max-w-sm">
            Whether you are interested in a commission, a print, or simply wish to connect — I would be glad to hear from you.
          </p>

          {/* Direct links */}
          <div className="flex flex-col mb-8">
            {[
              { label: "Email",     value: "sylviane.paris_dickson@yahoo.com", href: "mailto:sylviane.paris_dickson@yahoo.com" },
              { label: "Instagram", value: "@sylvianeparis", href: "https://www.instagram.com/sylvianeparis" },
              { label: "Facebook",  value: "Sylviane Paris", href: "https://www.facebook.com/sylvianeparisdickson" },
            ].map((item) => (
              <div key={item.label}
                className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-5 py-4 border-t border-black/10 last:border-b transition-all duration-300 sm:hover:pl-2">
                <span className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] sm:min-w-[72px] shrink-0">{item.label}</span>
                <a href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="font-serif italic text-[#1a1816] hover:text-[#6a6560] transition-colors duration-300 break-all"
                  style={{ fontSize: "clamp(13px, 1.6vw, 19px)" }}>
                  {item.value}
                </a>
                <span className="hidden sm:inline ml-auto text-[14px] text-[#9a9188] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <span className="flex-1 h-px bg-black/10" />
            <span className="text-[9px] tracking-[.2em] uppercase text-[#9a9188]">or send a message</span>
            <span className="flex-1 h-px bg-black/10" />
          </div>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-0">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {[
                  { label: "First name", name: "first_name", type: "text", placeholder: "Your first name" },
                  { label: "Last name",  name: "last_name",  type: "text", placeholder: "Your last name"  },
                ].map((f) => (
                  <div key={f.name} className="group flex flex-col border-b border-black/10 relative">
                    <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-5 mb-2">{f.label}</label>
                    <input name={f.name} type={f.type} placeholder={f.placeholder} required
                      className="bg-transparent border-none outline-none font-serif italic text-[17px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full" />
                    <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
                  </div>
                ))}
              </div>

              {[
                { label: "Email",   name: "email",   type: "email", placeholder: "your@email.com",                       required: true  },
                { label: "Subject", name: "subject", type: "text",  placeholder: "Commission · Print · General enquiry",  required: false },
              ].map((f) => (
                <div key={f.name} className="group flex flex-col border-b border-black/10 relative">
                  <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-5 mb-2">{f.label}</label>
                  <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.required}
                    className="bg-transparent border-none outline-none font-serif italic text-[17px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full" />
                  <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
                </div>
              ))}

              <div className="group flex flex-col border-b border-black/10 relative">
                <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-5 mb-2">Message</label>
                <textarea name="message" placeholder="Tell me what is on your mind..." required rows={4}
                  className="bg-transparent border-none outline-none font-serif italic text-[17px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full resize-none" />
                <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
              </div>

              {error && <p className="text-[12px] text-red-500 mt-4">{error}</p>}

              <button type="submit" disabled={loading}
                className="group w-full sm:w-auto self-stretch sm:self-start mt-8 bg-[#1a1816] text-white text-[9.5px] tracking-[.24em] uppercase font-light px-11 py-[18px] transition-all duration-300 hover:bg-[#3a3835] disabled:opacity-50 text-center">
                {loading ? "Sending..." : "Send message"}
                {!loading && <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>}
              </button>

            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <p className="font-serif italic text-[40px] text-[#9a9188] mb-4">✦</p>
              <p className="font-serif italic text-[24px] text-[#1a1816] mb-3">Thank you.</p>
              <p className="text-[13.5px] text-[#6a6560] leading-[1.8]">
                Your message has been sent.<br />I will be in touch with you soon.
              </p>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  );
}
