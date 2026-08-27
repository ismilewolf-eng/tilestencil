import type { MetadataRoute } from "next";
import {
  absoluteLanguageAlternates,
  absoluteLocalizedPath,
  type Locale,
  type SiteRoute,
} from "@/lib/locale";

export const dynamic = "force-static";

const locales: Locale[] = ["zh-CN", "en"];

const routes: Array<{
  route: SiteRoute;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { route: "home", changeFrequency: "monthly", priority: 1 },
  { route: "privacy", changeFrequency: "yearly", priority: 0.4 },
  { route: "posterGuide", changeFrequency: "monthly", priority: 0.8 },
  { route: "stencilGuide", changeFrequency: "monthly", priority: 0.8 },
  { route: "patternGuide", changeFrequency: "monthly", priority: 0.8 },
  { route: "bannerGuide", changeFrequency: "monthly", priority: 0.8 },
  { route: "stainedGlassGuide", changeFrequency: "monthly", priority: 0.8 },
  { route: "scrollSawGuide", changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap(({ route, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: absoluteLocalizedPath(locale, route),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: absoluteLanguageAlternates(route),
      },
    })),
  );
}
