import { SITE_URL } from "@/lib/site";

export type Locale = "zh-CN" | "en";
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
  | "flowerStencils";

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
};

export function localizedPath(locale: Locale, route: SiteRoute): string {
  const suffix = routeSuffix[route];
  if (locale === "zh-CN") {
    return suffix ? ("/zh" + suffix) : "/zh";
  }
  return suffix || "/";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "zh-CN" : "en";
}

export function languageAlternates(route: SiteRoute): Record<"zh-CN" | "en" | "x-default", string> {
  return {
    "zh-CN": localizedPath("zh-CN", route),
    en: localizedPath("en", route),
    "x-default": localizedPath("en", route),
  };
}

export function absoluteLocalizedPath(locale: Locale, route: SiteRoute): string {
  const path = localizedPath(locale, route);
  return path === "/" ? SITE_URL : (SITE_URL + path);
}

export function absoluteLanguageAlternates(
  route: SiteRoute,
): Record<"zh-CN" | "en" | "x-default", string> {
  return {
    "zh-CN": absoluteLocalizedPath("zh-CN", route),
    en: absoluteLocalizedPath("en", route),
    "x-default": absoluteLocalizedPath("en", route),
  };
}
