import { SITE_URL } from "@/lib/site";
import { ES } from "@/lib/i18n/es";
import { PT } from "@/lib/i18n/pt";

/** Chinese and English cover every page; Portuguese (Brazil) and Spanish (Latin America) cover the pages in LOCAL_SLUGS. */
export type Locale = "zh-CN" | "en" | "pt-BR" | "es";
export type SiteRoute =
  | "home"
  | "privacy"
  | "posterGuide"
  | "stencilGuide"
  | "patternGuide"
  | "bannerGuide"
  | "stainedGlassGuide"
  | "scrollSawGuide"
  | "rasterbatorAlternative"
  | "acrobatAlternative"
  | "blockpostersAlternative"
  | "a0SewingGuide"
  | "photoToStencil"
  | "pumpkinStencil"
  | "letterStencils"
  | "tattooStencil"
  | "terms"
  | "refundPolicy"
  | "pricing"
  | "cricutStencil"
  | "sprayPaintStencil"
  | "woodBurningStencil"
  | "airbrushStencil"
  | "freeStencils"
  | "halloweenStencils"
  | "christmasStencils"
  | "flowerStencils"
  | "animalStencils"
  | "shapeStencils";

const routeSuffix: Record<SiteRoute, string> = {
  home: "",
  privacy: "/privacy",
  posterGuide: "/print-image-on-multiple-pages",
  stencilGuide: "/print-large-stencil",
  patternGuide: "/print-pattern-actual-size",
  bannerGuide: "/print-banner-letters",
  stainedGlassGuide: "/print-stained-glass-patterns",
  scrollSawGuide: "/print-scroll-saw-patterns",
  rasterbatorAlternative: "/rasterbator-alternative",
  acrobatAlternative: "/print-posters-without-acrobat",
  blockpostersAlternative: "/blockposters-alternative",
  a0SewingGuide: "/print-a0-to-a4-actual-size",
  photoToStencil: "/photo-to-stencil",
  pumpkinStencil: "/pumpkin-stencil-maker",
  letterStencils: "/letter-stencils",
  tattooStencil: "/tattoo-stencil-maker",
  terms: "/terms",
  refundPolicy: "/refund-policy",
  pricing: "/pricing",
  cricutStencil: "/cricut-stencil-maker",
  sprayPaintStencil: "/spray-paint-stencil-maker",
  woodBurningStencil: "/wood-burning-stencil-maker",
  airbrushStencil: "/airbrush-stencil-maker",
  freeStencils: "/free-stencils",
  halloweenStencils: "/free-stencils/halloween",
  christmasStencils: "/free-stencils/christmas",
  flowerStencils: "/free-stencils/flowers",
  animalStencils: "/free-stencils/animals",
  shapeStencils: "/free-stencils/shapes",
};

/**
 * Pages written for Brazilian and Spanish-speaking visitors, with slugs in their language.
 * Picked from what they search (Ads volumes, 2026-10): "imprimir imagem em várias folhas",
 * "rasterbator", "block posters" (Mexico), "estêncil", "molde de letras para imprimir".
 * Any other route falls back to the English page.
 */
const LOCAL_SLUGS: Record<"pt-BR" | "es", Partial<Record<SiteRoute, string>>> = {
  "pt-BR": {
    home: "",
    rasterbatorAlternative: "/alternativa-ao-rasterbator",
    blockpostersAlternative: "/block-posters-gratis",
    photoToStencil: "/estencil-de-foto",
    letterStencils: "/moldes-de-letras",
  },
  es: {
    home: "",
    rasterbatorAlternative: "/alternativa-a-rasterbator",
    blockpostersAlternative: "/block-posters-gratis",
    photoToStencil: "/stencil-de-foto",
    letterStencils: "/plantillas-de-letras",
  },
};

const LOCALE_PREFIX: Record<Locale, string> = { "zh-CN": "/zh", en: "", "pt-BR": "/pt", es: "/es" };

export const LOCALE_LABEL: Record<Locale, string> = { "zh-CN": "中文", en: "English", "pt-BR": "Português", es: "Español" };

/** BCP 47 tag for number formatting and inLanguage. */
export const LOCALE_TAG: Record<Locale, string> = { "zh-CN": "zh-CN", en: "en-US", "pt-BR": "pt-BR", es: "es" };

/** Whether this page exists in this language (Chinese and English have every page). */
export function hasPage(locale: Locale, route: SiteRoute): boolean {
  return locale === "en" || locale === "zh-CN" || LOCAL_SLUGS[locale][route] !== undefined;
}

export function localizedPath(locale: Locale, route: SiteRoute): string {
  const suffix = routeSuffix[route];
  if (locale === "pt-BR" || locale === "es") {
    const local = LOCAL_SLUGS[locale][route];
    if (local === undefined) return suffix || "/";
    return LOCALE_PREFIX[locale] + local;
  }
  if (locale === "zh-CN") {
    return suffix ? ("/zh" + suffix) : "/zh";
  }
  return suffix || "/";
}

/** The other languages this page is available in, for the language switch. */
export function languageLinks(locale: Locale, route: SiteRoute): Array<{ locale: Locale; label: string; href: string }> {
  const order: Locale[] = ["en", "zh-CN", "pt-BR", "es"];
  return order
    .filter((other) => other !== locale && hasPage(other, route))
    .map((other) => ({ locale: other, label: LOCALE_LABEL[other], href: localizedPath(other, route) }));
}

/** Kept for pages that only exist in Chinese and English (policies, galleries). */
export function otherLocale(locale: Locale): Locale {
  return locale === "zh-CN" ? "en" : "zh-CN";
}

const HREFLANG: Record<Locale, string> = { "zh-CN": "zh-CN", en: "en", "pt-BR": "pt-BR", es: "es" };

export function languageAlternates(route: SiteRoute): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of ["zh-CN", "en", "pt-BR", "es"] as Locale[]) {
    if (hasPage(locale, route)) out[HREFLANG[locale]] = localizedPath(locale, route);
  }
  out["x-default"] = localizedPath("en", route);
  return out;
}

export function absoluteLocalizedPath(locale: Locale, route: SiteRoute): string {
  const path = localizedPath(locale, route);
  return path === "/" ? SITE_URL : (SITE_URL + path);
}

export function absoluteLanguageAlternates(route: SiteRoute): Record<string, string> {
  return Object.fromEntries(
    Object.entries(languageAlternates(route)).map(([lang, path]) => [lang, path === "/" ? SITE_URL : SITE_URL + path]),
  );
}

const DICTIONARY: Record<"pt-BR" | "es", Record<string, string>> = { "pt-BR": PT, es: ES };

/**
 * UI text. Components pass the Chinese and English versions; Portuguese and Spanish are looked
 * up by the English text (lib/i18n/pt.ts, es.ts) and fall back to English when missing.
 * {name} placeholders are filled from vars.
 */
export function tr(locale: Locale, chinese: string, english: string, vars?: Record<string, string | number>): string {
  const raw = locale === "zh-CN" ? chinese : locale === "en" ? english : DICTIONARY[locale][english] ?? english;
  if (!vars) return raw;
  // {n} is replaced by the value; {n|folha|folhas} picks the singular or plural word for it.
  return raw.replace(/\{(\w+)(?:\|([^|}]*)\|([^}]*))?\}/g, (match, key: string, one?: string, many?: string) => {
    if (!(key in vars)) return match;
    if (one !== undefined) return Number(vars[key]) === 1 ? one : (many ?? one);
    return localDecimal(locale, String(vars[key]));
  });
}

/** Brazil writes decimals with a comma (19,4 cm); everyone else here uses a point. */
export function localDecimal(locale: Locale, text: string): string {
  return locale === "pt-BR" ? text.replace(/(\d)\.(\d)/g, "$1,$2") : text;
}
