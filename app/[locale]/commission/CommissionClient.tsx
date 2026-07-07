"use client";
import Image from "next/image";
import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function CommissionClient() {
  const t = useTranslations("Commission");
  const tc = useTranslations("common");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("reference_image") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    // Use FormData to support file upload
    const formData = new FormData();
    formData.append("first_name",        (form.elements.namedItem("first_name")        as HTMLInputElement).value);
    formData.append("last_name",         (form.elements.namedItem("last_name")         as HTMLInputElement).value);
    formData.append("email",             (form.elements.namedItem("email")             as HTMLInputElement).value);
    formData.append("subject",           (form.elements.namedItem("subject")           as HTMLTextAreaElement).value);
    formData.append("size",              (form.elements.namedItem("size")              as HTMLSelectElement).value);
    formData.append("timeline",          (form.elements.namedItem("timeline")          as HTMLInputElement).value);
    formData.append("how_did_you_find_us",(form.elements.namedItem("how_did_you_find_us") as HTMLInputElement).value);
    if (file) formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_POCKETBASE_URL || "https://sgzo0nrujpc3b4h.ba7w.pocketbasecloud.com"}/api/collections/contact_submissions/records`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError(t("formError"));
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || "");
  };

  return (
    <main>
      <Nav />

      {/* HERO */}
      <section className="relative w-full min-h-screen-safe overflow-hidden">
        <Image
          src="/souls-of-the-park.jpg"
          alt="The Souls of the Park — Sylviane Paris"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 sm:right-auto md:left-14 max-w-xl pr-2">
          <div className="max-w-lg bg-[#f8f5ef]/84 backdrop-blur-md border border-white/55 shadow-[0_20px_70px_rgba(0,0,0,.18)] px-6 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10">
          <p className="flex items-center gap-3 text-[8px] sm:text-[9px] tracking-[.28em] sm:tracking-[.32em] uppercase text-[#6f665d] mb-5 sm:mb-6">
            <span className="block w-8 h-px bg-[#9a9188] shrink-0" />
            {t("badge")}
          </p>
          <h1 className="font-serif font-light text-[#1a1816] leading-[.88] tracking-[.02em] mb-5 sm:mb-7"
            style={{ fontSize: "clamp(40px, 9vw, 96px)", fontWeight: 200 }}>
            {t("heading")}
          </h1>
          <p className="font-serif italic font-light text-[#3f3a35] leading-[1.7] text-[16px] sm:text-[18px] max-w-sm mb-8 sm:mb-10">
            {t("heroText")}
          </p>
          <a href="#form"
            className="group inline-flex items-center gap-3 bg-[#1a1816] text-white text-[9.5px] tracking-[.22em] uppercase px-6 py-4 hover:bg-[#3a3835] transition-colors duration-300">
            {t("beginConversation")} <span>→</span>
          </a>
          </div>
        </div>
      </section>

      {/* QUOTE STRIP */}
      <div className="bg-[#141210] px-6 md:px-14 py-14 md:py-16 flex flex-col md:flex-row items-start gap-8 md:gap-14">
        <span className="font-serif text-[72px] leading-[.6] text-white/8 shrink-0 hidden md:block">"</span>
        <div className="border-t md:border-t-0 md:border-l border-white/8 pt-6 md:pt-0 md:pl-12">
          <p className="font-serif italic font-light text-white/55 leading-[1.75] mb-5"
            style={{ fontSize: "clamp(15px, 1.8vw, 20px)" }}>
            {t("bmText")}
          </p>
          <p className="text-[9px] tracking-[.2em] uppercase text-white/28">{t("bmLabel")}</p>
        </div>
      </div>

      {/* ABOUT */}
      <div className="grid grid-cols-1 md:grid-cols-[380px_minmax(0,1fr)] border-b border-black/10">
        <div className="px-6 md:px-14 py-12 md:py-20 border-b md:border-b-0 md:border-r border-black/10 flex flex-col justify-start">
          <span className="block text-[9px] tracking-[.28em] uppercase text-[#9a9188] mb-8">{t("aboutLabel")}</span>
          <h2 className="font-serif italic font-light text-[#1a1816] leading-[1.15]"
            style={{ fontSize: "clamp(24px, 3vw, 38px)", whiteSpace: "pre-line" }}>
            {t("aboutHeading")}
          </h2>
        </div>
        <div className="px-6 md:px-16 py-12 md:py-20">
          <div className="text-[15px] text-[#6a6560] leading-[1.95] max-w-xl space-y-5">
            <p>{t("aboutText1")}</p>
            <p>{t("aboutText2")}</p>
            <p>{t("aboutText3")}</p>
            <p>{t("aboutText4")}</p>
          </div>
        </div>
      </div>

      {/* TYPICAL DIMENSIONS */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border-b border-black/10 bg-[#faf9f6]">
        <div className="px-6 md:px-14 py-10 md:py-14 border-b md:border-b-0 md:border-r border-black/10 flex flex-col justify-start">
          <span className="block text-[9px] tracking-[.22em] uppercase text-[#9a9188]">{t("formatLabel")}</span>
        </div>
        <div className="px-6 md:px-16 py-10 md:py-14">
          <div className="text-[15px] text-[#6a6560] leading-[1.95] max-w-xl space-y-5">
            <p>{t("formatText1")}</p>
            <div>
              <p className="mb-3">{t("formatTypical")}</p>
              <ul className="space-y-2 font-serif italic text-[#1a1816] text-[16px] md:text-[17px]">
                <li>22 × 30 in / 56 × 76 cm</li>
                <li className="text-[#9a9188] not-italic text-[13px] tracking-[.12em] uppercase">{t("formatOr")}</li>
                <li>19 × 24 in / 48 × 61 cm</li>
              </ul>
            </div>
            <p>{t("formatText2")}</p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-[#f8f5ef] px-6 md:px-14 py-16 md:py-24" id="form">
        <div className="text-center mb-14 md:mb-16">
          <h2 className="font-serif italic font-normal text-[#1a1816] leading-[.92] mb-4"
            style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}>
            {t("formTitle")}
          </h2>
          <p className="text-[14px] text-[#6a6560] leading-[1.8] max-w-sm mx-auto">
            {t("formSub")}
          </p>
          <div className="w-7 h-px bg-black/20 mx-auto mt-5" />
        </div>

        <div className="max-w-[700px] mx-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {[
                  { label: t("formFirstName"), name: "first_name", placeholder: t("formFirstNamePlaceholder") },
                  { label: t("formLastName"),  name: "last_name",  placeholder: t("formLastNamePlaceholder")  },
                ].map((f) => (
                  <div key={f.name} className="group flex flex-col border-b border-black/12 relative">
                    <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-6 mb-2">{f.label}</label>
                    <input name={f.name} type="text" placeholder={f.placeholder} required
                      className="bg-transparent border-none outline-none font-serif italic text-[18px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full" />
                    <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
                  </div>
                ))}
              </div>

              <div className="group flex flex-col border-b border-black/12 relative">
                <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-6 mb-2">{t("formEmail")}</label>
                <input name="email" type="email" placeholder="your@email.com" required
                  className="bg-transparent border-none outline-none font-serif italic text-[18px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full" />
                <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
              </div>

              <div className="group flex flex-col border-b border-black/12 relative">
                <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-6 mb-2">
                  {t("formSubject")}
                </label>
                <textarea name="subject" placeholder={t("formSubjectPlaceholder")} required rows={4}
                  className="bg-transparent border-none outline-none font-serif italic text-[18px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full resize-none" />
                <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <div className="group flex flex-col border-b border-black/12 relative">
                  <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-6 mb-2">{t("formSize")}</label>
                  <select name="size" defaultValue=""
                    className="bg-transparent border-none outline-none font-serif italic text-[18px] font-light text-[#1a1816] pb-3 w-full cursor-pointer appearance-none">
                    <option value="" disabled>{t("formSizeSelect")}</option>
                    <option>{tc("small")}</option>
                    <option>{tc("medium")}</option>
                    <option>{tc("large")}</option>
                    <option>{tc("unsure")}</option>
                  </select>
                  <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
                </div>
                <div className="group flex flex-col border-b border-black/12 relative">
                  <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-6 mb-2">{t("formTimeline")}</label>
                  <input name="timeline" type="text" placeholder={t("formTimelinePlaceholder")}
                    className="bg-transparent border-none outline-none font-serif italic text-[18px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full" />
                  <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
                </div>
              </div>

              <div className="group flex flex-col border-b border-black/12 relative">
                <label className="text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mt-6 mb-2">{t("formFindUs")}</label>
                <input name="how_did_you_find_us" type="text" placeholder={t("formFindUsPlaceholder")}
                  className="bg-transparent border-none outline-none font-serif italic text-[18px] font-light text-[#1a1816] pb-3 placeholder:text-black/20 w-full" />
                <span className="absolute bottom-[-1px] left-0 w-0 h-px bg-[#1a1816] transition-all duration-[400ms] group-focus-within:w-full" />
              </div>

              {/* File upload */}
              <div className="border-b border-black/12 py-6">
                <span className="block text-[8.5px] tracking-[.22em] uppercase text-[#9a9188] mb-4">
                  {t("formRefImage")}
                </span>
                <label htmlFor="reference_image"
                  className="inline-flex items-center gap-3 border border-black/18 bg-white px-5 py-3 cursor-pointer hover:bg-[#ede9e1] hover:border-black/30 transition-all duration-300">
                  <svg className="w-3.5 h-3.5 opacity-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 12l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  <span className="text-[10px] tracking-[.16em] uppercase text-[#6a6560]">{t("formRefImageUpload")}</span>
                </label>
                <input type="file" id="reference_image" name="reference_image" accept="image/*" className="hidden" onChange={handleFile} />
                {fileName && <p className="font-serif italic text-[14px] text-[#9a9188] mt-3">{fileName}</p>}
                <p className="text-[10px] text-[#9a9188] mt-2">{t("formRefImageNote")}</p>
              </div>

              {error && <p className="text-[12px] text-red-500 mt-4">{error}</p>}

              <div className="flex justify-center mt-12">
                <button type="submit" disabled={loading}
                  className="group w-full sm:w-auto justify-center bg-[#1a1816] text-white text-[9.5px] tracking-[.26em] uppercase font-light px-10 sm:px-16 py-5 hover:bg-[#3a3835] transition-all duration-400 flex items-center gap-3 disabled:opacity-50">
                  {loading ? t("sending") : t("sendEnquiry")}
                  {!loading && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
                </button>
              </div>

            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-14">
              <p className="font-serif italic text-[48px] text-[#9a9188] mb-5">✦</p>
              <p className="font-serif italic text-[28px] text-[#1a1816] mb-3">{t("formSubmittedTitle")}</p>
              <p className="text-[14px] text-[#6a6560] leading-[1.85]">
                {t("formSubmittedText")}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
