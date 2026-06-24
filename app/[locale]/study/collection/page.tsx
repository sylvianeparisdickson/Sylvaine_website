import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getLocalizedSeries } from "@/lib/localizedData";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Collection — Sylviane Paris",
};

export default async function Collection({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const series = await getLocalizedSeries(locale, "collection");
  if (!series) notFound();
  return <SeriesPageTemplate series={series} />;
}
