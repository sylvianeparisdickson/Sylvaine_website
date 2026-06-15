import CommissionClient from "./CommissionClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Commission");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function CommissionPage() {
    return <CommissionClient />;
}
