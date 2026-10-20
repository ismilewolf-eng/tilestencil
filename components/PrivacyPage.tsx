import Link from "next/link";
import { localizedPath, otherLocale, type Locale } from "@/lib/locale";
import { SiteFooter } from "@/components/SiteFooter";
import { CONTACT_EMAIL } from "@/components/PolicyPages";

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
              "不上传你的图片、文件名、尺寸设置或生成的 PDF；不要求登录；不使用广告脚本。我们使用 Cloudflare Web Analytics 记录汇总的访问量和页面浏览量，Cloudflare 不跟踪单个访问者。购买付费 SVG 导出时，只有在你打开付款框后才会加载 PayPal 的付款脚本，付款由 PayPal 处理；我们只收到订单号、金额、付款状态，以及 PayPal 在商户后台显示的付款人姓名和邮箱，看不到你的银行卡信息。为了知道顾客是从哪里找到我们的，浏览器会在你第一次访问时在本机记下来源网站（例如 google.com）、落地页和日期；这条记录只在你购买时随订单一起交给 PayPal，平时不会发送到任何地方，清除浏览器数据即可删除。SVG 仍然在你的浏览器里生成，图片不会上传。",
              "We do not upload your image, filename, size settings, or generated PDF. We do not require sign-in and do not use advertising scripts. We use Cloudflare Web Analytics for aggregate visit and page-view counts; Cloudflare does not track individual visitors. If you buy a paid SVG export, PayPal's checkout script loads only when you open the checkout and PayPal processes the payment; we receive the order number, amount, payment status and the payer name and email PayPal shows merchants, never your card details. To learn how buyers find us, your browser keeps a note on your device of the site that first sent you here (for example google.com), the landing page and the date. It is sent only with a purchase, attached to the PayPal order, and never otherwise; clearing your browser data removes it. The SVG is still generated in your browser and your image is never uploaded.",
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
          <h2>{text(locale, "你的数据权利", "Your data rights")}</h2>
          <p>
            {text(
              locale,
              "我们保存的与你有关的个人数据只有付款记录：订单号、金额、付款状态、随订单提交的来源记录，以及付款服务商在商户后台向我们显示的姓名和电子邮箱。对于这些数据，你有权：",
              "The only personal data we keep about you is the payment record: order number, amount, payment status, the source note sent with the order, and the name and email address the payment provider shows us in its merchant dashboard. For this data you have the right to:",
            )}
          </p>
          <ul>
            <li>{text(locale, "查询：了解我们保存了你的哪些数据，并获取一份副本；", "Access: find out what we hold about you and get a copy of it;")}</li>
            <li>{text(locale, "更正：要求更正不准确的信息；", "Correction: have inaccurate details corrected;")}</li>
            <li>{text(locale, "删除：要求删除你的数据；", "Deletion: ask us to delete your data;")}</li>
            <li>{text(locale, "限制或反对处理：要求我们停止某种用途的处理；", "Restriction or objection: ask us to stop a particular use of it;")}</li>
            <li>{text(locale, "撤回同意：随时撤回你此前给予的同意。", "Withdrawal of consent: withdraw any consent you gave at any time.")}</li>
          </ul>
          <p>
            {text(locale, "申请方式：发邮件到 ", "How to ask: email ")}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            {text(
              locale,
              "，写明你的请求，并附上订单号或付款时使用的邮箱，方便我们找到对应记录。我们会在 30 天内答复并处理；为防止他人冒用，可能会请你从付款邮箱回复一次以确认身份。删除请求完成后，我们只会保留法律或税务要求必须保留的交易记录（例如订单号、金额和日期）。",
              " with your request and the order number or the email address you paid with, so we can find the record. We reply and act within 30 days; to protect you, we may ask you to confirm from the email address used for payment. After a deletion request we keep only what tax or accounting law requires us to keep (such as order number, amount and date).",
            )}
          </p>
          <p>
            {text(
              locale,
              "保存在你浏览器里的来源记录和下载解锁记录只在你的设备上，你可以随时通过清除本站的浏览器数据自行删除。Cloudflare Web Analytics 的汇总统计不包含能识别你个人的信息。如果你对我们的处理不满意，也可以向你所在地的数据保护机构投诉。",
              "The source note and download-unlock records stored in your browser stay on your device; you can delete them at any time by clearing this site's browser data. Cloudflare Web Analytics keeps only aggregate counts that do not identify you. If you are unhappy with how we handle a request, you can also complain to your local data protection authority.",
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
        <p className="legal-updated">{text(locale, "最后更新：2026-10-20。", "Last updated 2026-10-20.")}</p>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
