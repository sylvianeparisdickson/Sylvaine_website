import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getSeriesById } from "@/lib/data";

export const metadata = {
  title: "Studies — Sylviane Paris-Dickson",
};

export default function Studies() {
  const series = getSeriesById("studies")!;
  return <SeriesPageTemplate series={series} />;
}
