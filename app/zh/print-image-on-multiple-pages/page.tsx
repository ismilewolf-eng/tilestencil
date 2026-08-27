import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "图片分页打印：把一张图拼成 A4 大海报",
  description:
    "用家用打印机把 JPG 或 PNG 按真实尺寸拆成多张 A4、A3 或 US Letter，导出带页码、裁切标记和拼接提示的 PDF。",
  keywords: ["图片分页打印", "A4 拼接海报", "图片分割打印", "多页 PDF 海报", "家用打印机海报"],
  alternates: {
    canonical: "/zh/print-image-on-multiple-pages",
    languages: languageAlternates("posterGuide"),
  },
  openGraph: {
    title: "图片分页打印：把一张图拼成 A4 大海报",
    description: "设定真实尺寸后，把一张图片拆成可拼接的多页打印 PDF。",
    url: "/zh/print-image-on-multiple-pages",
  },
};

const howToSteps = [
  {
    name: "选择本地图片并输入尺寸",
    text: "选择本地 JPG 或 PNG，并输入成品要达到的宽度和高度；单位可用厘米(cm)或英寸(in)。",
  },
  {
    name: "设置纸张与边距重叠",
    text: "选择手头纸张的规格（A4/A3/Letter）与方向，设置打印机需要的边距，以及方便对齐的重叠区域。",
  },
  {
    name: "导出并拼装 PDF",
    text: "导出 PDF。打印时选择 100% 实际大小，按网格页码裁切并从背面粘贴即可。",
  },
];

const faqItems = [
  {
    question: "TileStencil 与 The Rasterbator（光栅化打印）有什么区别？",
    answer: "The Rasterbator 会将图片强行转换为圆点/波点网点（Halftone Dots），而 TileStencil 保留原图的高清像素与真实线条，不产生任何波点像素化。同时 TileStencil 支持 1:1 毫米级物理尺寸设定与纯本地离线处理，更适合清晰海报与手作纸样。",
  },
  {
    question: "为什么拼出来的海报比预期尺寸偏小？",
    answer: "通常是因为打印时勾选了“适合页面”或“缩放至可打印区域”。请务必在打印设置中勾选“Actual Size（实际大小 / 100%）”，才能保证物理尺寸准确。",
  },
  {
    question: "普通家用打印机没有无边距功能可以用吗？",
    answer: "可以。TileStencil 默认支持设置物理边距（例如 5mm~8mm），并且可以设置相邻页的重叠区域，打印后只需裁掉一边就能完美对齐图案。",
  },
  {
    question: "上传的图片会保存到服务器吗？",
    answer: "不会。TileStencil 采用纯浏览器本地离线处理机制，图片读取、裁切和 PDF 生成全在你的浏览器内存中完成，不会上传到任何服务器。",
  },
];

export default function PrintImageOnMultiplePagesPage() {
  return (
    <>
      <HowToJsonLd
        name="如何把一张图片分页打印成 A4 大海报"
        description="用家用普通打印机把 JPG 或 PNG 按真实尺寸拆成多张 A4、A3 纸张拼接成大幅海报。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="posterGuide"
      kicker="A4 拼接海报"
      title="把一张图片，分页打印成真正的大海报。"
      lead="当家里只有普通打印机时，也可以把 JPG 或 PNG 拆到多张 A4、A3 或 US Letter 上，再按页码拼成一张完整的大图。"
    >
      <section>
        <h2>什么时候适合用图片分页打印？</h2>
        <p>
          想做房间海报、教室展示、活动指示牌或照片墙，却没有大幅面打印机时，分页打印能让普通纸张承担大尺寸输出。关键不是把图片随便切开，而是先确定成品的真实宽高，再让每一页按同一个比例打印。
        </p>
        <ul>
          <li>一张照片要拼成多张 A4 的墙面海报。</li>
          <li>活动、课堂或店面需要大字标题和图示。</li>
          <li>希望先在家试印，确认尺寸后再制作成品。</li>
        </ul>
      </section>

      <section>
        <h2>三步导出可拼接 PDF</h2>
        <ol>
          <li>选择本地 JPG 或 PNG，并输入成品要达到的宽度和高度；单位可用厘米或英寸。</li>
          <li>选择手头纸张的规格与方向，设置打印机需要的边距，以及方便对齐的重叠区域。</li>
          <li>导出 PDF。每页都有页码、网格坐标和裁切/拼接标记，按顺序裁切并从背面粘贴即可。</li>
        </ol>
      </section>

      <section>
        <h2>打印时最容易忽略的一步</h2>
        <p>
          在打印对话框中选择 <strong>Actual Size / 100%</strong>，不要选择“适合页面”或自动缩放。自动缩放会把每一页悄悄缩小，最后拼起来的总尺寸就会小于你设置的成品尺寸。
        </p>
        <p>
          如果打印机无法无边距打印，保留一点边距并设置少量重叠会更稳妥。先把所有页面铺开核对页码，再裁切和拼接，能避免重复打印。
        </p>
      </section>

      <section className="guide-faq">
        <h2>常见问题 (FAQ)</h2>
        {faqItems.map((item) => (
          <div className="guide-faq-item" key={item.question}>
            <h3 className="guide-faq-question">{item.question}</h3>
            <p className="guide-faq-answer">{item.answer}</p>
          </div>
        ))}
      </section>

      <aside className="guide-callout">
        <p>需要把设计放大后用于描摹、切割或墙绘？</p>
        <Link href="/zh/print-large-stencil">查看墙绘与黑白模板的放大打印方法 →</Link>
      </aside>

      <Link className="guide-cta" href="/zh">
        打开 TileStencil，开始分页打印
      </Link>
    </GuideShell>
    </>
  );
}
