import SeriesPageTemplate from "@/components/SeriesPageTemplate";
import { getSeriesById } from "@/lib/data";

export const metadata = {
  title: "Divine Presence — Sylviane Paris",
};

export default function DivinePresence() {
  const series = getSeriesById("divine-presence")!;
  return <SeriesPageTemplate series={series} />;
}
