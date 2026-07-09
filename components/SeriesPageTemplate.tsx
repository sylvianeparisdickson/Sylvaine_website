"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Series, Painting } from "@/lib/data";
import { useTranslations } from "next-intl";

function PaintingDetails({ painting, variant = "card" }: { painting: Painting; variant?: "card" | "zoom" }) {
  if (variant === "zoom") {
    return (
      <div className="space-y-0.5">
        {painting.dimensions && (
          <p className="text-[8px] md:text-[9px] tracking-[.1em] md:tracking-[.12em] uppercase hidden sm:block" style={{ color: "rgba(255,255,255,.32)" }}>
            {painting.dimensions}
          </p>
        )}
        {painting.framedDimensions && (
          <p className="text-[8px] tracking-[.1em] uppercase hidden md:block" style={{ color: "rgba(255,255,255,.24)" }}>
            {painting.framedDimensions}
          </p>
        )}
        <p className="text-[8px] md:text-[9px] tracking-[.12em] md:tracking-[.14em] uppercase hidden sm:block" style={{ color: "rgba(255,255,255,.38)" }}>
          {painting.medium}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 mb-2">
      {painting.dimensions && (
        <p className="text-[9px] md:text-[9.5px] tracking-[.1em] md:tracking-[.12em] uppercase text-[#9a9188]">
          {painting.dimensions}
        </p>
      )}
      {painting.framedDimensions && (
        <p className="text-[8.5px] md:text-[9px] tracking-[.1em] uppercase text-[#9a9188]/80">
          {painting.framedDimensions}
        </p>
      )}
      <p className="text-[9px] md:text-[9.5px] tracking-[.1em] md:tracking-[.12em] uppercase text-[#9a9188]">
        {painting.medium}
      </p>
    </div>
  );
}

/* ── Zoom Viewer ── */
function ZoomViewer({ painting, onClose }: { painting: Painting; onClose: () => void }) {
  const t = useTranslations("SeriesPageTemplate");
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scaleRef = useRef(1);
  const originRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);
  const [zoomPct, setZoomPct] = useState(100);
  const [loaded, setLoaded] = useState(false);

  const applyTransform = useCallback((animate = false) => {
    const c = containerRef.current;
    if (!c) return;
    c.style.transition = animate ? "transform .25s cubic-bezier(.25,.46,.45,.94)" : "none";
    c.style.transform = `translate(${originRef.current.x}px, ${originRef.current.y}px) scale(${scaleRef.current})`;
    setZoomPct(Math.round(scaleRef.current * 100));
  }, []);

  const clamp = useCallback(() => {
    const vp = viewportRef.current;
    const img = imgRef.current;
    if (!vp || !img) return;
    const sw = img.naturalWidth * scaleRef.current;
    const sh = img.naturalHeight * scaleRef.current;
    const maxX = Math.max(0, (sw - vp.clientWidth) / 2);
    const maxY = Math.max(0, (sh - vp.clientHeight) / 2);
    originRef.current.x = Math.max(-maxX, Math.min(maxX, originRef.current.x));
    originRef.current.y = Math.max(-maxY, Math.min(maxY, originRef.current.y));
  }, []);

  const reset = useCallback((animate = true) => {
    scaleRef.current = 1; originRef.current = { x: 0, y: 0 }; applyTransform(animate);
  }, [applyTransform]);

  const zoom = useCallback((delta: number, cx = 0, cy = 0) => {
    const prev = scaleRef.current;
    scaleRef.current = Math.max(0.3, Math.min(5, prev + delta));
    const ratio = scaleRef.current / prev;
    originRef.current.x = cx + (originRef.current.x - cx) * ratio;
    originRef.current.y = cy + (originRef.current.y - cy) * ratio;
    clamp(); applyTransform(false);
  }, [clamp, applyTransform]);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      zoom(e.deltaY > 0 ? -0.25 : 0.25, e.clientX - rect.left - rect.width / 2, e.clientY - rect.top - rect.height / 2);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [zoom]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - originRef.current.x, y: e.clientY - originRef.current.y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      originRef.current = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
      clamp(); applyTransform(false);
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [clamp, applyTransform]);

  const onDblClick = (e: React.MouseEvent) => {
    const vp = viewportRef.current;
    if (!vp) return;
    if (scaleRef.current > 1.2) { reset(true); return; }
    const rect = vp.getBoundingClientRect();
    zoom(scaleRef.current * 1.5, e.clientX - rect.left - rect.width / 2, e.clientY - rect.top - rect.height / 2);
    applyTransform(true);
  };

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        lastPinchDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      } else if (e.touches.length === 1) {
        isDragging.current = true;
        dragStart.current = { x: e.touches[0].clientX - originRef.current.x, y: e.touches[0].clientY - originRef.current.y };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        zoom((dist - lastPinchDist.current) * 0.01);
        lastPinchDist.current = dist;
      } else if (isDragging.current && e.touches.length === 1) {
        originRef.current = { x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y };
        clamp(); applyTransform(false);
      }
    };
    const onTouchEnd = () => { isDragging.current = false; };
    vp.addEventListener("touchstart", onTouchStart, { passive: true });
    vp.addEventListener("touchmove", onTouchMove, { passive: false });
    vp.addEventListener("touchend", onTouchEnd);
    return () => {
      vp.removeEventListener("touchstart", onTouchStart);
      vp.removeEventListener("touchmove", onTouchMove);
      vp.removeEventListener("touchend", onTouchEnd);
    };
  }, [zoom, clamp, applyTransform]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoom(0.4);
      if (e.key === "-") zoom(-0.4);
      if (e.key === "0") reset(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, reset, onClose]);

  const toggleFullscreen = () => {
    const el = document.getElementById("zoom-viewer");
    if (!document.fullscreenElement) el?.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  };

  return (
    <div id="zoom-viewer" className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(10,9,8,.96)" }}>
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 md:px-7 py-3 md:py-4 border-b shrink-0"
        style={{ borderColor: "rgba(255,255,255,.08)", background: "rgba(10,9,8,.8)", backdropFilter: "blur(8px)" }}>
        <div className="min-w-0 mr-4">
          <p className="font-serif italic text-[14px] md:text-[17px] text-white mb-0.5 truncate">{painting.title}</p>
          <PaintingDetails painting={painting} variant="zoom" />
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <button onClick={() => zoom(-0.4)} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded text-sm transition-colors"
            style={{ background: "rgba(255,255,255,.08)", border: ".5px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.7)" }}>−</button>
          <span className="text-[9px] md:text-[10px] tracking-[.1em] w-10 md:w-14 text-center hidden sm:block" style={{ color: "rgba(255,255,255,.45)" }}>{zoomPct}%</span>
          <button onClick={() => zoom(0.4)} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded text-sm transition-colors"
            style={{ background: "rgba(255,255,255,.08)", border: ".5px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.7)" }}>+</button>
          <button onClick={() => reset(true)} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded text-sm transition-colors hidden sm:flex"
            style={{ background: "rgba(255,255,255,.08)", border: ".5px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.7)" }}>⊡</button>
          <div className="w-px h-5 mx-0.5 hidden md:block" style={{ background: "rgba(255,255,255,.12)" }} />
          <button onClick={toggleFullscreen} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded text-sm hidden md:flex transition-colors"
            style={{ background: "rgba(255,255,255,.08)", border: ".5px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.7)" }}>⛶</button>
          <div className="w-px h-5 mx-0.5 hidden md:block" style={{ background: "rgba(255,255,255,.12)" }} />
          <button onClick={onClose} className="px-3 md:px-4 h-8 md:h-9 rounded text-[8.5px] md:text-[9px] tracking-[.14em] md:tracking-[.16em] uppercase font-light transition-all duration-250"
            style={{ background: "rgba(255,255,255,.06)", border: ".5px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.6)" }}>
            {t("close")}
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div ref={viewportRef} className="flex-1 overflow-hidden relative select-none" style={{ cursor: "grab" }}
        onMouseDown={onMouseDown} onDoubleClick={onDblClick}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={containerRef} className="relative" style={{ transformOrigin: "center center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={painting.img} alt={painting.alt} draggable={false}
              onLoad={() => { setLoaded(true); reset(false); }}
              style={{ display: "block", maxWidth: "none", maxHeight: "none", opacity: loaded ? 1 : 0, transition: "opacity .4s" }} />
          </div>
        </div>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        {/* Hint text — smaller on mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[calc(100%-2rem)] text-[8px] md:text-[9px] tracking-[.14em] md:tracking-[.18em] uppercase px-3 md:px-4 py-2 rounded pointer-events-none text-center whitespace-normal sm:whitespace-nowrap"
          style={{ color: "rgba(255,255,255,.4)", background: "rgba(0,0,0,.4)", backdropFilter: "blur(4px)" }}>
          <span className="hidden md:inline">{t("zoomHintDesktop")}</span>
          <span className="md:hidden">{t("zoomHintMobile")}</span>
        </div>
      </div>

      {/* Hint bar */}
      {painting.hint && (
        <div className="px-4 md:px-7 py-3 md:py-4 border-t shrink-0" style={{ borderColor: "rgba(255,255,255,.06)", background: "rgba(10,9,8,.6)" }}>
          <p className="font-serif italic text-[12px] md:text-[14px] leading-[1.6]" style={{ color: "rgba(255,255,255,.38)" }}>{painting.hint}</p>
        </div>
      )}
    </div>
  );
}

/* ── Series Page ── */
export default function SeriesPageTemplate({ series }: { series: Series }) {
  const t = useTranslations("SeriesPageTemplate");
  const tc = useTranslations("common");
  const [selected, setSelected] = useState<Painting | null>(null);

  return (
    <main>
      <Nav />
      {selected && <ZoomViewer painting={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="pt-28 md:pt-40 pb-10 md:pb-14 px-6 md:px-14 border-b border-black/10">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Link href="/study" className="text-[9px] tracking-[.18em] uppercase text-[#9a9188] hover:text-[#1a1816] transition-colors duration-300">{t("studies")}</Link>
          <span className="text-[#9a9188] text-[9px]">→</span>
          <span className="text-[9px] tracking-[.22em] uppercase text-[#1a1816]">{series.name}</span>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-20 md:items-end gap-6">
          <div>
            <span className="block font-serif italic text-[12px] md:text-[13px] text-[#9a9188] mb-3 md:mb-4">{series.numeral}</span>
            <h1 className="font-serif italic font-light text-[#1a1816] leading-[.9] mb-4 md:mb-6"
              style={{ fontSize: "clamp(36px, 7vw, 76px)" }}>
              {series.name}
            </h1>
            <p className="text-[9px] md:text-[9.5px] tracking-[.16em] md:tracking-[.18em] uppercase text-[#9a9188]">
              {series.paintings.length === 1 ? tc("work_one") : tc("work_other", { count: series.paintings.length })} · {series.subtitle}
            </p>
          </div>
          <p className="text-[14px] md:text-[14.5px] text-[#6a6560] leading-[1.9]">{series.description}</p>
        </div>
      </div>

      {/* Paintings — 1 col mobile, 2 col sm, 3 col md */}
      <section className="px-6 md:px-14 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
          {series.paintings.map((painting) => (
            <div key={painting.id} className="group cursor-pointer" onClick={() => setSelected(painting)}>
              <div className="relative w-full mb-5 bg-[#f8f5ef] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={painting.img} alt={painting.alt} className="w-full h-auto" />
                <div className="absolute inset-0 flex items-end justify-end p-3 md:p-4 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[8px] md:text-[9px] tracking-[.14em] md:tracking-[.18em] uppercase text-white bg-black/35 px-2 md:px-3 py-1.5 md:py-2">
                    {t("viewZoom")}
                  </span>
                </div>
              </div>
              <p className="font-serif italic text-[16px] md:text-[18px] text-[#1a1816] mb-1.5">
                {painting.title}
              </p>
              <PaintingDetails painting={painting} />
              {painting.hint && <p className="text-[12.5px] md:text-[13px] text-[#6a6560] leading-[1.75]">{painting.hint}</p>}
              {series.id !== "studies" && painting.status !== "Sold" && (
                <Link
                  href="/contact"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 inline-block w-full text-center border border-black/20 px-4 py-2.5 text-[9px] tracking-[.18em] uppercase text-[#6a6560] hover:border-[#1a1816] hover:text-[#1a1816] transition-colors duration-300"
                >
                  Please inquire for availability and pricing
                </Link>
              )}

            </div>
          ))}
        </div>
      </section>

      {/* Bottom nav */}
      <div className="border-t border-black/10 px-6 md:px-14 py-7 md:py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#f8f5ef]">
        <Link href="/study" className="text-[9px] tracking-[.22em] uppercase text-[#9a9188] hover:text-[#1a1816] transition-colors duration-300">{t("allCollections")}</Link>
        <span className="font-serif italic text-[12px] md:text-[13px] text-[#9a9188]">{series.numeral} {t("ofV")}</span>
      </div>

      <Footer />
    </main>
  );
}
