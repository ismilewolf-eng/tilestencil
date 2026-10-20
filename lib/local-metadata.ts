import type { Metadata } from "next";
import { languageAlternates, localizedPath, type SiteRoute } from "@/lib/locale";

/** Metadata for a Portuguese or Spanish page: canonical, hreflang to every version, Open Graph locale. */
export function localMetadata(
  locale: "pt-BR" | "es",
  route: SiteRoute,
  { title, description, keywords }: { title: string; description: string; keywords: string[] },
): Metadata {
  const path = localizedPath(locale, route);
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path, languages: languageAlternates(route) },
    openGraph: { locale: locale === "pt-BR" ? "pt_BR" : "es_MX", title, description, url: path },
  };
}
