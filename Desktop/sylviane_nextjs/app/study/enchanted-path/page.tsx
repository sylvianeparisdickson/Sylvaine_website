import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getSeriesById } from "@/lib/data";

export const metadata = {
  title: "Enchanted Path — Sylviane Paris-Dickson",
};

export default function EnchantedPath() {
  const series = getSeriesById("enchanted-path")!;
  return <SeriesPageTemplate series={series} />;
}
