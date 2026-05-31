import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getSeriesById } from "@/lib/data";

export const metadata = {
  title: "Living Moments — Sylviane Paris",
};

export default function LivingMoments() {
  const series = getSeriesById("living-moments")!;
  return <SeriesPageTemplate series={series} />;
}
