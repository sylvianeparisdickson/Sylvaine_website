import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getLocalizedSeries } from "@/lib/localizedData";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Living Moments — Sylviane Paris",
};

export default async function LivingMoments({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const series = await getLocalizedSeries(locale, "living-moments");
  if (!series) notFound();
  return <SeriesPageTemplate series={series} />;
}
