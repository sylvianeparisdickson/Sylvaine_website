import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getLocalizedSeries } from "@/lib/localizedData";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Architecture of Light — Sylviane Paris",
};

export default async function ArchitectureOfLight({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const series = await getLocalizedSeries(locale, "architecture-of-light");
  if (!series) notFound();
  return <SeriesPageTemplate series={series} />;
}
