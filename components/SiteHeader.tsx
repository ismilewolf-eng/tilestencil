import Link from "next/link";
import { hasPage, languageLinks, localizedPath, tr, type Locale, type SiteRoute } from "@/lib/locale";

type NavItem = { route: SiteRoute; zh: string; en: string };

const MAIN_NAV: NavItem[] = [
  { route: "posterGuide", zh: "分页打印", en: "Print posters" },
  { route: "stencilGuide", zh: "模板放大", en: "Enlarge stencils" },
  { route: "gridDrawing", zh: "网格画法", en: "Grid drawing" },
  { route: "patternGuide", zh: "纸样打印", en: "Craft patterns" },
  { route: "bannerGuide", zh: "横幅大字", en: "Banner letters" },
  { route: "stainedGlassGuide", zh: "彩色玻璃", en: "Stained glass" },
  { route: "scrollSawGuide", zh: "木工线锯", en: "Scroll saw" },
  { route: "privacy", zh: "隐私", en: "Privacy" },
];

/** Portuguese and Spanish pages (see LOCAL_SLUGS in lib/locale.ts). */
const LOCAL_NAV: NavItem[] = [
  { route: "home", zh: "分页打印", en: "Print posters" },
  { route: "blockpostersAlternative", zh: "Block Posters", en: "Block Posters" },
  { route: "rasterbatorAlternative", zh: "Rasterbator 替代", en: "Rasterbator alternative" },
  { route: "photoToStencil", zh: "照片转模板", en: "Photo to stencil" },
  { route: "letterStencils", zh: "字母模板", en: "Letter stencils" },
];

/** The tool pages' top bar: brand, the pages that exist in this language, and the language switch. */
export function SiteHeader({ locale, route }: { locale: Locale; route: SiteRoute }) {
  const localOnly = locale === "pt-BR" || locale === "es";
  const items = (localOnly ? LOCAL_NAV : MAIN_NAV).filter((item) => hasPage(locale, item.route));
  return (
    <header className="topbar">
      <Link className="brand" href={localizedPath(locale, "home")} aria-label={tr(locale, "TileStencil 首页", "TileStencil home")}>
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
        </span>
        <span>TileStencil</span>
      </Link>
      <nav aria-label={tr(locale, "主导航", "Main navigation")}>
        {items.map((item) => (
          <Link key={item.route} href={localizedPath(locale, item.route)} aria-current={item.route === route ? "page" : undefined}>
            {tr(locale, item.zh, item.en)}
          </Link>
        ))}
        <span className="language-switches">
          {languageLinks(locale, route).map((link) => (
            <Link key={link.locale} className="language-switch" href={link.href} hrefLang={link.locale} lang={link.locale}>
              {link.label}
            </Link>
          ))}
        </span>
      </nav>
    </header>
  );
}
