import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getSeriesById } from "@/lib/data";

export const metadata = {
  title: "Architecture of Light — Sylviane Paris-Dickson",
};

export default function ArchitectureOfLight() {
  const series = getSeriesById("architecture-of-light")!;
  return <SeriesPageTemplate series={series} />;
}
