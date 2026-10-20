import Link from "next/link";
import type { ReactNode } from "react";
import { localizedPath, otherLocale, type Locale, type SiteRoute } from "@/lib/locale";
import { SiteFooter } from "@/components/SiteFooter";

export const CONTACT_EMAIL = "ismilewolf@gmail.com";
const UPDATED = "2026-10-20";

type Section = { heading: string; body: ReactNode };

function PolicyShell({
  locale,
  route,
  kicker,
  title,
  lead,
  sections,
}: {
  locale: Locale;
  route: SiteRoute;
  kicker: string;
  title: string;
  lead: string;
  sections: Section[];
}) {
  const alternateLocale = otherLocale(locale);
  return (
    <div className="legal-shell" lang={locale}>
      <main className="legal-page">
        <p className="legal-nav">
          <Link className="back-link" href={localizedPath(locale, "home")}>
            {locale === "en" ? "← Back to TileStencil" : "← 返回 TileStencil"}
          </Link>
          <span aria-hidden="true"> · </span>
          <Link className="language-switch" href={localizedPath(alternateLocale, route)}>
            {alternateLocale === "en" ? "English" : "中文"}
          </Link>
        </p>
        <article>
          <p className="legal-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p className="legal-lead">{lead}</p>
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <p className="legal-updated">{locale === "en" ? `Last updated ${UPDATED}.` : `最后更新：${UPDATED}。`}</p>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export function TermsPage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <PolicyShell
      locale={locale}
      route="terms"
      kicker={en ? "TERMS OF SERVICE" : "服务条款"}
      title={en ? "Terms of Service" : "服务条款"}
      lead={
        en
          ? "These terms cover your use of TileStencil (tilestencil.com), a browser-based tool for tiling images into printable PDFs and making stencils. By using the site you agree to them."
          : "本条款适用于你使用 TileStencil（tilestencil.com）——一个在浏览器里把图片分页打印、制作镂空模板的工具。使用本网站即表示你同意这些条款。"
      }
      sections={[
        {
          heading: en ? "Who runs TileStencil" : "运营者",
          body: en
            ? <>TileStencil is an independent software project. Questions, support requests, and legal notices go to {mail}.</>
            : <>TileStencil 是一个独立开发的软件项目。问题、支持请求和法律通知请发邮件到 {mail}。</>,
        },
        {
          heading: en ? "Your images and content" : "你的图片与内容",
          body: en
            ? "You keep all rights to the images and text you use. TileStencil processes them in your browser and does not upload them to our servers. Only use images you have the right to reproduce; you are responsible for how you use the files you create."
            : "你使用的图片和文字的全部权利归你所有。TileStencil 在你的浏览器里处理它们，不会上传到我们的服务器。请只使用你有权复制的图片；你对自己生成的文件如何使用负责。",
        },
        {
          heading: en ? "Free and paid features" : "免费与付费功能",
          body: en
            ? <>Tiled PDF printing, stencil previews, and stencil bridges are free. Some exports, such as cut-ready SVG files, may be offered as paid one-time downloads. The current offer is always shown on the <Link href={localizedPath("en", "pricing")}>pricing page</Link> and before you pay.</>
            : <>分页 PDF 打印、模板预览和连接桥是免费的。部分导出（例如可切割 SVG 文件）可能以单次付费下载的形式提供。当前的收费内容以<Link href={localizedPath("zh-CN", "pricing")}>价格说明</Link>页和付款前的提示为准。</>,
        },
        {
          heading: en ? "Payments and delivery" : "付款与交付",
          body: en
            ? "Paid downloads are processed by PayPal, or by Waffo when you pay with a card, Apple Pay, Google Pay or another wallet. For Waffo orders, Waffo is the merchant of record: it sells the download to you on our behalf, handles sales tax, and its name may appear on your statement. We never see or store your card details. Files are delivered digitally in your browser immediately after payment is confirmed."
            : "付费下载由 PayPal 处理；用银行卡、Apple Pay、Google Pay 等方式付款时由 Waffo 处理。通过 Waffo 付款的订单，Waffo 是这笔订单的销售方（merchant of record）：它代我们向你出售下载、处理销售税，你的账单上可能显示 Waffo 的名称。我们看不到也不会保存你的银行卡信息。付款确认后，文件会立即在你的浏览器里交付下载。",
        },
        {
          heading: en ? "Refunds" : "退款",
          body: en
            ? <>See the <Link href={localizedPath("en", "refundPolicy")}>refund policy</Link>.</>
            : <>见<Link href={localizedPath("zh-CN", "refundPolicy")}>退款政策</Link>。</>,
        },
        {
          heading: en ? "Acceptable use" : "合理使用",
          body: en
            ? "Do not use TileStencil to infringe others' rights, to attack or overload the site, or to resell access to the tool itself."
            : "不得用 TileStencil 侵犯他人权利、攻击网站或使其过载，也不得转售本工具的使用权。",
        },
        {
          heading: en ? "Breach and termination" : "违约与终止",
          body: en
            ? "If you break these terms, we may, depending on how serious the breach is, warn you; limit or end your access to the site and its paid exports (for example by blocking abusive requests); cancel a paid download that has not been delivered yet and refund it; refuse future purchases; and take legal action where necessary. You can stop using TileStencil at any time. If your access ends, or if we stop offering the service, files you have already downloaded remain yours to use under these terms, and purchases made in the last 14 days can still be refunded under the refund policy."
            : "如果你违反本条款，我们可以视情节轻重采取以下措施：发出警告；限制或终止你使用本网站和付费导出（例如拦截滥用请求）；取消尚未交付的付费下载并退款；拒绝你之后的购买；必要时依法追究责任。你可以随时停止使用 TileStencil。使用权终止后，或我们停止提供服务时，你已经下载的文件仍可按本条款继续使用；14 天内的购买仍可按退款政策申请退款。",
        },
        {
          heading: en ? "No warranty" : "免责声明",
          body: en
            ? "TileStencil is provided as is. Print scale depends on your printer and settings, so print a test page at Actual Size before large jobs. To the extent the law allows, our liability for any claim is limited to the amount you paid us for the export concerned."
            : "TileStencil 按现状提供。打印比例取决于你的打印机和设置，大批量打印前请先以实际大小打印一张测试页。在法律允许的范围内，我们对任何索赔的责任以你为相关导出支付的金额为限。",
        },
        {
          heading: en ? "Changes" : "条款变更",
          body: en
            ? "We may update these terms; the date below shows the latest version. Continued use after a change means you accept the updated terms."
            : "我们可能更新本条款，页面底部日期为最新版本。变更后继续使用即表示你接受更新后的条款。",
        },
      ]}
    />
  );
}

export function RefundPage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <PolicyShell
      locale={locale}
      route="refundPolicy"
      kicker={en ? "REFUND POLICY" : "退款政策"}
      title={en ? "Refund Policy" : "退款政策"}
      lead={
        en
          ? "Paid exports are digital downloads. If one does not work for you, we will make it right."
          : "付费导出是数字下载产品。如果它没法用，我们会负责解决。"
      }
      sections={[
        {
          heading: en ? "14-day money-back guarantee" : "14 天退款保证",
          body: en
            ? "If a paid file does not open, does not cut or print as shown in the preview, or you bought the same export twice by mistake, ask for a refund within 14 days of purchase and you will get your money back in full."
            : "如果付费文件打不开、切割或打印效果和预览不一致，或者你误重复购买了同一份导出，在购买后 14 天内申请即可全额退款。",
        },
        {
          heading: en ? "How to ask" : "怎么申请",
          body: en
            ? <>Email {mail} with your order number (shown in your payment receipt) and a sentence about what went wrong. You do not need to send the file back.</>
            : <>发邮件到 {mail}，附上订单号（在付款收据里）并简单说明问题，不需要退回文件。</>,
        },
        {
          heading: en ? "When the money arrives" : "到账时间",
          body: en
            ? "Refunds go back to the original payment method, usually within 5–10 business days depending on your payment provider."
            : "退款原路退回，通常在 5–10 个工作日内到账，具体取决于你的支付方式。",
        },
        {
          heading: en ? "Free features" : "免费功能",
          body: en
            ? "Free features, including tiled PDF printing, involve no payment and therefore no refunds."
            : "免费功能（包括分页 PDF 打印）不涉及付款，因此不适用退款。",
        },
      ]}
    />
  );
}

export function PricingPage({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <PolicyShell
      locale={locale}
      route="pricing"
      kicker={en ? "PRICING" : "价格说明"}
      title={en ? "Pricing" : "价格说明"}
      lead={
        en
          ? "The printing tool is free. No account, no subscription."
          : "打印工具免费使用，不用注册，没有订阅。"
      }
      sections={[
        {
          heading: en ? "Free" : "免费",
          body: en
            ? "Tiled PDF printing at actual size on A4, A3, or US Letter; original, grayscale, and stencil styles; stencil threshold, invert, automatic bridges, and the letter stencil generator. No watermark and no page limit."
            : "按真实尺寸分页打印到 A4、A3 或 US Letter；原图、灰度和镂空模板三种样式；阈值、黑白反转、自动连接桥和字母模板生成器。没有水印，没有页数限制。",
        },
        {
          heading: en ? "Cut-ready SVG export" : "可切割 SVG 导出",
          body: en
            ? "Closed cut paths for Cricut, Silhouette, and laser cutters, with bridges included and sized in millimetres. $1.99 per image, paid once through PayPal, or by card, Apple Pay, Google Pay or WeChat Pay through Waffo; after that you can re-export the same image as often as you like while you adjust it. No account and no subscription, with a 14-day money-back guarantee."
            : "给 Cricut、Silhouette 刻字机和激光切割机用的闭合切割路径，带连接桥，按毫米标注尺寸。每张图 1.99 美元，用 PayPal 付一次，或通过 Waffo 用银行卡、Apple Pay、Google Pay、微信支付付一次，之后同一张图怎么调都可以反复导出。不用注册，没有订阅，14 天内可全额退款。",
        },
        {
          heading: en ? "Questions" : "有问题",
          body: en ? <>Email {mail}.</> : <>发邮件到 {mail}。</>,
        },
      ]}
    />
  );
}
