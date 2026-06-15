import CollectorsClient from "./CollectorsClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Collectors");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CollectorsPage() {
    return <CollectorsClient />;
}
