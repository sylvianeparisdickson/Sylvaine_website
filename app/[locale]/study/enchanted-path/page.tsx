import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getLocalizedSeries } from "@/lib/localizedData";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Enchanted Path — Sylviane Paris",
};

export default async function EnchantedPath({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const series = await getLocalizedSeries(locale, "enchanted-path");
  if (!series) notFound();
  return <SeriesPageTemplate series={series} />;
}
