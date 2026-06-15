import ContactClient from "./ContactClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Contact");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ContactPage() {
    return <ContactClient />;
}
