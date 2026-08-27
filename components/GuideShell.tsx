import type { ReactNode } from "react";
import Link from "next/link";
import { localizedPath, otherLocale, type Locale, type SiteRoute } from "@/lib/locale";
import { SiteFooter } from "@/components/SiteFooter";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { absoluteLocalizedPath } from "@/lib/locale";

type GuideShellProps = {
  locale: Locale;
  route: Exclude<SiteRoute, "home" | "privacy">;
  kicker: string;
  title: string;
  lead: string;
  children: ReactNode;
};

function text(locale: Locale, chinese: string, english: string): string {
  return locale === "en" ? english : chinese;
}

export function GuideShell({ locale, route, kicker, title, lead, children }: GuideShellProps) {
  const alternateLocale = otherLocale(locale);
  const homeUrl = absoluteLocalizedPath(locale, "home");
  const currentUrl = absoluteLocalizedPath(locale, route);

  return (
    <div className="guide-shell" lang={locale}>
      <BreadcrumbJsonLd
        items={[
          { name: text(locale, "首页", "Home"), url: homeUrl },
          { name: text(locale, "打印指南", "Guides"), url: homeUrl },
          { name: title, url: currentUrl },
        ]}
      />
      <a className="skip-link" href="#guide-content">
        {text(locale, "跳到正文", "Skip to guide")}
      </a>
      <header className="guide-topbar">
        <Link className="brand" href={localizedPath(locale, "home")} aria-label={text(locale, "TileStencil 首页", "TileStencil home")}>
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>TileStencil</span>
        </Link>
        <nav className="guide-nav" aria-label={text(locale, "主导航", "Main navigation")}>
          <Link href={localizedPath(locale, "home")}>{text(locale, "工具", "Tool")}</Link>
          <Link href={localizedPath(locale, "posterGuide")}>{text(locale, "分页打印", "Print posters")}</Link>
          <Link href={localizedPath(locale, "stencilGuide")}>{text(locale, "模板放大", "Enlarge stencils")}</Link>
          <Link href={localizedPath(locale, "patternGuide")}>{text(locale, "纸样打印", "Craft patterns")}</Link>
          <Link href={localizedPath(locale, "bannerGuide")}>{text(locale, "横幅大字", "Banner letters")}</Link>
          <Link href={localizedPath(locale, "stainedGlassGuide")}>{text(locale, "彩色玻璃", "Stained glass")}</Link>
          <Link href={localizedPath(locale, "scrollSawGuide")}>{text(locale, "木工线锯", "Scroll saw")}</Link>
          <Link className="language-switch" href={localizedPath(alternateLocale, route)}>
            {alternateLocale === "en" ? "English" : "中文"}
          </Link>
        </nav>
      </header>

      <main id="guide-content" className="guide-page">
        <article className="guide-article">
          <nav className="guide-breadcrumbs" aria-label={text(locale, "当前位置", "Breadcrumb")}>
            <Link href={localizedPath(locale, "home")}>{text(locale, "首页", "Home")}</Link>
            <span aria-hidden="true">/</span>
            <span>{text(locale, "打印指南", "Guides")}</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{kicker}</span>
          </nav>
          <p className="guide-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p className="guide-lead">{lead}</p>
          {children}
        </article>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
