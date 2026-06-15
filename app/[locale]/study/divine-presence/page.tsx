import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getLocalizedSeries } from "@/lib/localizedData";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Divine Presence — Sylviane Paris",
};

export default async function DivinePresence({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const series = await getLocalizedSeries(locale, "divine-presence");
  if (!series) notFound();
  return <SeriesPageTemplate series={series} />;
}
