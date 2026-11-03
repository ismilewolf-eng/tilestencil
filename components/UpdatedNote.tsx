import type { Locale } from "@/lib/locale";
import type { SiteRoute } from "@/lib/locale";
import { CITED_ROUTES, CONTENT_UPDATED } from "@/lib/site";

const PREFIX: Record<Locale, (month: string) => string> = {
  en: (m) => `Updated ${m}`,
  "zh-CN": (m) => `${m}更新`,
  "pt-BR": (m) => `Atualizado em ${m}`,
  es: (m) => `Actualizado en ${m}`,
};

/** "Updated November 2026" under a page's lead, plus a WebPage dateModified for search and AI engines. */
export function UpdatedNote({ locale, route }: { locale: Locale; route: SiteRoute }) {
  if (CITED_ROUTES.has(route)) return null;
  const month = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${CONTENT_UPDATED}T00:00:00Z`));
  return (
    <>
      <p className="updated-note">
        <time dateTime={CONTENT_UPDATED}>{PREFIX[locale](month)}</time>
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", dateModified: CONTENT_UPDATED }) }}
      />
    </>
  );
}
