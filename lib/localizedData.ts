import { getTranslations } from "next-intl/server";
import { allSeries, Series } from "./data";

/**
 * Returns a localized copy of a Series object for the given locale,
 * replacing name, subtitle, description, and painting text with translations.
 */
export async function getLocalizedSeries(
  locale: string,
  id: string
): Promise<Series | undefined> {
  const raw = allSeries.find((s) => s.id === id);
  if (!raw) return undefined;

  const td = await getTranslations({ locale, namespace: "data" });

  const name = td(`${id}.name`);
  const subtitle = td(`${id}.subtitle`);
  const description = td(`${id}.description`);

  const paintings = raw.paintings.map((p) => {
    const paintingKey = `${id}.paintings.${p.id}`;
    const title = td(`${paintingKey}.title`);
    const medium = td(`${paintingKey}.medium`);
    const hint = p.hint ? td(`${paintingKey}.hint`) : p.hint;
    const availabilityLabel = p.availabilityLabel
      ? td(`${paintingKey}.availabilityLabel`)
      : p.availabilityLabel;
    const status = p.status ? td(`${paintingKey}.status`) : p.status;

    // Localize limitedEditions size labels and edition strings
    const limitedEditions = p.limitedEditions?.map((ed, idx) => {
      const sizeKeys = ["small", "medium", "large"] as const;
      const sizeKey = sizeKeys[idx] ?? sizeKeys[0];
      return {
        ...ed,
        sizeLabel: td(`${paintingKey}.sizeLabel_${sizeKey}`),
        edition: td(`${paintingKey}.edition_${sizeKey}`),
      };
    });

    return {
      ...p,
      title,
      medium,
      ...(hint !== undefined ? { hint } : {}),
      ...(availabilityLabel !== undefined ? { availabilityLabel } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(limitedEditions ? { limitedEditions } : {}),
    };
  });

  return {
    ...raw,
    name,
    subtitle,
    description,
    paintings,
  };
}
