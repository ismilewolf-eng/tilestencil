import Link from "next/link";
import { localizedPath, otherLocale, type Locale } from "@/lib/locale";
import { SiteFooter } from "@/components/SiteFooter";

type PrivacyPageProps = {
  locale: Locale;
};

function text(locale: Locale, chinese: string, english: string): string {
  return locale === "en" ? english : chinese;
}

export function PrivacyPage({ locale }: PrivacyPageProps) {
  const alternateLocale = otherLocale(locale);

  return (
    <div className="legal-shell" lang={locale}>
      <main className="legal-page">
      <p className="legal-nav">
        <Link className="back-link" href={localizedPath(locale, "home")}>
          {text(locale, "← 返回 TileStencil", "← Back to TileStencil")}
        </Link>
        <span aria-hidden="true"> · </span>
        <Link className="language-switch" href={localizedPath(alternateLocale, "privacy")}>
          {alternateLocale === "en" ? "English" : "中文"}
        </Link>
      </p>
      <article>
        <p className="legal-kicker">PRIVACY</p>
        <h1>{text(locale, "你的图片留在这台设备上。", "Your images stay on this device.")}</h1>
        <p className="legal-lead">
          {text(
            locale,
            "TileStencil 在浏览器内读取、裁切、处理和导出 JPG/PNG。应用不提供图片上传接口、账户、云盘或服务器端图像处理；Cloudflare Web Analytics 仅用于汇总网站访问情况，不参与图片处理。",
            "TileStencil reads, crops, processes, and exports JPG or PNG files in your browser. This version has no image-upload endpoint, account, cloud drive, or server-side image processing. Cloudflare Web Analytics is used only for aggregate website traffic measurement and does not process your images.",
          )}
        </p>

        <section>
          <h2>{text(locale, "我们不收集什么", "What we do not collect")}</h2>
          <p>
            {text(
              locale,
              "不上传你的图片、文件名、尺寸设置或生成的 PDF；不要求登录；不使用支付或广告脚本。我们使用 Cloudflare Web Analytics 记录汇总的访问量和页面浏览量，Cloudflare 不跟踪单个访问者。",
              "We do not upload your image, filename, size settings, or generated PDF. We do not require sign-in and do not use payments or advertising scripts. We use Cloudflare Web Analytics for aggregate visit and page-view counts; Cloudflare does not track individual visitors.",
            )}
          </p>
        </section>

        <section>
          <h2>{text(locale, "浏览器内会发生什么", "What happens in your browser")}</h2>
          <p>
            {text(
              locale,
              "当你选择文件时，它只被当前浏览器标签读取到内存中。导出时，浏览器用本地 Canvas 和 jsPDF 生成下载文件。关闭或刷新页面后，未下载的工作内容不会被本应用保留。",
              "When you choose a file, only the current browser tab reads it into memory. On export, your browser uses local Canvas and jsPDF processing to create the download. Work that has not been downloaded is not retained by this app after you close or refresh the page.",
            )}
          </p>
        </section>

        <section>
          <h2>{text(locale, "你可以如何确认", "How you can verify this")}</h2>
          <p>
            {text(
              locale,
              "使用浏览器开发者工具的 Network 面板时，页面加载后可能出现 Cloudflare 的统计请求；选择图片和导出 PDF 的流程不应出现图片上传请求。未来若产品需要改变这项原则，会先更新本页并在界面中明确说明。",
              "In your browser developer tools Network panel, a Cloudflare analytics request may appear after the page loads. Choosing an image and exporting a PDF should not create an image-upload request. If the product ever changes this principle, this page and the interface will say so clearly first.",
            )}
          </p>
        </section>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
