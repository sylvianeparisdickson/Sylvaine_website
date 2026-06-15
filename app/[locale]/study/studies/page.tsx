import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getLocalizedSeries } from "@/lib/localizedData";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Studies — Sylviane Paris",
};

export default async function Studies({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const series = await getLocalizedSeries(locale, "studies");
  if (!series) notFound();
  return <SeriesPageTemplate series={series} />;
}
