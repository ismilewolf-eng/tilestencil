import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/locale";

type SiteFooterProps = {
  locale: Locale;
};

function text(locale: Locale, chinese: string, english: string): string {
  return locale === "en" ? english : chinese;
}

const moreTools = [
  {
    href: "https://fee.skillary.ai",
    glyph: "💰",
    name: "Etsy Profit Studio",
    title: { zh: "Etsy 卖家利润与定价计算器", en: "Etsy Fee & Margin Calculator for Sellers" },
  },
  {
    href: "https://magickcmd.com",
    glyph: "🪄",
    name: "MagickCMD",
    title: { zh: "ImageMagick 图像处理指令生成器", en: "ImageMagick Command Builder" },
  },
  {
    href: "https://apriltag.skillary.ai",
    glyph: "🎯",
    name: "AprilTag Studio",
    title: { zh: "机器人与视觉标定板生成", en: "AprilTag Calibration Studio" },
  },
];

export function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <span>{text(locale, "TileStencil · 浏览器本地打印工具", "TileStencil · Browser-local print tool")}</span>
        <div className="footer-links">
          <Link href={localizedPath(locale, "home")}>{text(locale, "开始制作", "Start creating")}</Link>
          <Link href={localizedPath(locale, "posterGuide")}>{text(locale, "分页打印", "Posters")}</Link>
          <Link href={localizedPath(locale, "stencilGuide")}>{text(locale, "模板放大", "Stencils")}</Link>
          <Link href={localizedPath(locale, "patternGuide")}>{text(locale, "纸样打印", "Patterns")}</Link>
          <Link href={localizedPath(locale, "bannerGuide")}>{text(locale, "横幅大字", "Banners")}</Link>
          <Link href={localizedPath(locale, "stainedGlassGuide")}>{text(locale, "彩色玻璃", "Stained Glass")}</Link>
          <Link href={localizedPath(locale, "scrollSawGuide")}>{text(locale, "木工线锯", "Scroll Saw")}</Link>
          <Link href={localizedPath(locale, "privacy")}>{text(locale, "隐私说明", "Privacy")}</Link>
          <a href="https://github.com/ismilewolf-eng/tilestencil" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
      <div className="footer-tools">
        <span className="footer-tools-label">{text(locale, "更多免费工具", "More Free Tools")}</span>
        <ul>
          {moreTools.map((tool) => (
            <li key={tool.href}>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                title={text(locale, tool.title.zh, tool.title.en)}
              >
                <span aria-hidden="true">{tool.glyph}</span>
                {tool.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
