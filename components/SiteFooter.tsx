import Link from "next/link";
import { localizedPath, tr, type Locale } from "@/lib/locale";

type SiteFooterProps = {
  locale: Locale;
};

const text = tr;

function LocalFooterLinks({ locale }: { locale: "pt-BR" | "es" }) {
  const t = (chinese: string, english: string) => tr(locale, chinese, english);
  return (
    <div className="footer-links">
      <Link href={localizedPath(locale, "home")}>{t("开始制作", "Start creating")}</Link>
      <Link href={localizedPath(locale, "blockpostersAlternative")}>Block Posters</Link>
      <Link href={localizedPath(locale, "rasterbatorAlternative")}>{t("Rasterbator替代", "Rasterbator Alternative")}</Link>
      <Link href={localizedPath(locale, "photoToStencil")}>{t("照片转模板", "Photo to Stencil")}</Link>
      <Link href={localizedPath(locale, "letterStencils")}>{t("字母模板", "Letter Stencils")}</Link>
      <Link href={localizedPath("en", "pricing")} hrefLang="en">{t("价格", "Pricing (English)")}</Link>
      <Link href={localizedPath("en", "privacy")} hrefLang="en">{t("隐私说明", "Privacy (English)")}</Link>
      <Link href={localizedPath("en", "terms")} hrefLang="en">{t("服务条款", "Terms (English)")}</Link>
      <Link href={localizedPath("en", "refundPolicy")} hrefLang="en">{t("退款政策", "Refunds (English)")}</Link>
      <Link href={localizedPath("en", "home")} hrefLang="en">English</Link>
      <a href="mailto:ismilewolf@gmail.com">{t("联系我们", "Contact")}</a>
      <a href="https://github.com/ismilewolf-eng/tilestencil" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  );
}

export function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <span>{text(locale, "TileStencil · 浏览器本地打印工具", "TileStencil · Browser-local print tool")}</span>
        {locale === "pt-BR" || locale === "es" ? <LocalFooterLinks locale={locale} /> : <div className="footer-links">
          <Link href={localizedPath(locale, "home")}>{text(locale, "开始制作", "Start creating")}</Link>
          <Link href={localizedPath(locale, "posterGuide")}>{text(locale, "分页打印", "Posters")}</Link>
          <Link href={localizedPath(locale, "stencilGuide")}>{text(locale, "模板放大", "Stencils")}</Link>
          {locale === "en" ? <Link href={localizedPath("en", "gridDrawing")}>Drawing Grid Maker</Link> : null}
          <Link href={localizedPath(locale, "patternGuide")}>{text(locale, "纸样打印", "Patterns")}</Link>
          <Link href={localizedPath(locale, "bannerGuide")}>{text(locale, "横幅大字", "Banners")}</Link>
          <Link href={localizedPath(locale, "stainedGlassGuide")}>{text(locale, "彩色玻璃", "Stained Glass")}</Link>
          <Link href={localizedPath(locale, "scrollSawGuide")}>{text(locale, "木工线锯", "Scroll Saw")}</Link>
          <Link href={localizedPath(locale, "rasterbatorAlternative")}>{text(locale, "Rasterbator替代", "Rasterbator Alternative")}</Link>
          <Link href={localizedPath(locale, "acrobatAlternative")}>{text(locale, "免Acrobat打印", "Print Without Acrobat")}</Link>
          <Link href={localizedPath(locale, "blockpostersAlternative")}>{text(locale, "Blockposters替代", "Blockposters Alternative")}</Link>
          <Link href={localizedPath(locale, "a0SewingGuide")}>{text(locale, "A0纸样打印", "A0 Sewing Patterns")}</Link>
          <Link href={localizedPath(locale, "photoToStencil")}>{text(locale, "照片转模板", "Photo to Stencil")}</Link>
          <Link href={localizedPath(locale, "pumpkinStencil")}>{text(locale, "南瓜雕刻模板", "Pumpkin Stencils")}</Link>
          <Link href={localizedPath(locale, "letterStencils")}>{text(locale, "字母模板", "Letter Stencils")}</Link>
          <Link href={localizedPath(locale, "tattooStencil")}>{text(locale, "纹身转印模板", "Tattoo Stencils")}</Link>
          <Link href={localizedPath(locale, "cricutStencil")}>{text(locale, "刻字机模板", "Cricut Stencils")}</Link>
          <Link href={localizedPath(locale, "sprayPaintStencil")}>{text(locale, "喷漆模板", "Spray Paint Stencils")}</Link>
          <Link href={localizedPath(locale, "woodBurningStencil")}>{text(locale, "烙画模板", "Wood Burning Stencils")}</Link>
          <Link href={localizedPath(locale, "airbrushStencil")}>{text(locale, "喷笔模板", "Airbrush Stencils")}</Link>
          <Link href={localizedPath(locale, "freeStencils")}>{text(locale, "免费模板", "Free Stencils")}</Link>
          <Link href={localizedPath(locale, "halloweenStencils")}>{text(locale, "万圣节模板", "Halloween Stencils")}</Link>
          <Link href={localizedPath(locale, "christmasStencils")}>{text(locale, "圣诞模板", "Christmas Stencils")}</Link>
          <Link href={localizedPath(locale, "flowerStencils")}>{text(locale, "花朵模板", "Flower Stencils")}</Link>
          <Link href={localizedPath(locale, "animalStencils")}>{text(locale, "动物模板", "Animal Stencils")}</Link>
          <Link href={localizedPath(locale, "shapeStencils")}>{text(locale, "爱心和图案模板", "Heart & Pattern Stencils")}</Link>
          <Link href={localizedPath(locale, "pricing")}>{text(locale, "价格", "Pricing")}</Link>
          <Link href={localizedPath(locale, "privacy")}>{text(locale, "隐私说明", "Privacy")}</Link>
          <Link href={localizedPath(locale, "terms")}>{text(locale, "服务条款", "Terms")}</Link>
          <Link href={localizedPath(locale, "refundPolicy")}>{text(locale, "退款政策", "Refunds")}</Link>
          <a href="mailto:ismilewolf@gmail.com">{text(locale, "联系我们", "Contact")}</a>
          <a href="https://github.com/ismilewolf-eng/tilestencil" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>}
      </div>
    </footer>
  );
}
