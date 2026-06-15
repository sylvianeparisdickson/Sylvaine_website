import { useTranslations } from "next-intl";

export default function NorthrupStrip() {
  const t = useTranslations("NorthrupStrip");
  return (
    <div className="flex items-center justify-center gap-3 md:gap-5 px-6 md:px-14 py-4 md:py-5 bg-[#141210] border-b border-white/6">
      <span className="w-[4px] h-[4px] md:w-[5px] md:h-[5px] rounded-full bg-white/20 shrink-0" />
      <p className="text-[8.5px] md:text-[10px] tracking-[.14em] md:tracking-[.18em] uppercase text-white/45 text-center leading-relaxed">
        {t.rich("text", {
          building: (chunks) => <span className="text-white/65">{chunks}</span>,
          desktop: (chunks) => <span className="hidden md:inline">{chunks}</span>,
          mobile: (chunks) => <span className="md:hidden">{chunks}</span>,
          br: () => <br />,
        })}
      </p>
      <span className="w-[4px] h-[4px] md:w-[5px] md:h-[5px] rounded-full bg-white/20 shrink-0" />
    </div>
  );
}
