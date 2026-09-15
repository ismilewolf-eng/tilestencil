import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "A0 服装纸样切片打印为 A4/A3 | 100% 实际大小无形变拼接",
  description:
    "家庭普通打印机如何打印 A0 大幅面服装纸样、皮具版型与 Cosplay 图纸？TileStencil 支持将 A0 纸样以 1:1 毫米级精度切片为多张 A4 纸打印，带测试校验方块（10×10cm）与拼接对齐线，打版开料不缩放变形。",
  keywords: [
    "A0纸样打印A4",
    "服装纸样实际大小打印",
    "A0转A4打印软件免费",
    "缝纫图纸拼接打印",
    "Etsy纸样A0切片",
    "1比1服装纸样无损打印",
  ],
  alternates: {
    canonical: "/zh/print-a0-to-a4-actual-size",
    languages: languageAlternates("a0SewingGuide"),
  },
  openGraph: {
    title: "A0 服装纸样切片打印为 A4/A3 | 100% 实际大小无形变拼接",
    description: "在家用普通 A4 打印机 1:1 还原大版型服装与皮具纸样，精准对齐辅助线，告别昂贵图文店出图。",
    url: "/zh/print-a0-to-a4-actual-size",
  },
};

const howToSteps = [
  {
    name: "导入 A0 纸样图片",
    text: "将电子版纸样文件导出为高清 PNG 或 JPG 格式，在 TileStencil 中直接打开。数据全在本地处理。",
  },
  {
    name: "输入标准 A0 物理尺寸",
    text: "输入宽 84.1 cm、高 118.9 cm（或根据纸样标注的精确成品尺寸输入），系统自动锁定比例防止版型拉伸畸变。",
  },
  {
    name: "设定 A4 纸张与 10mm 重叠对齐线",
    text: "选择常用的 A4 纸规格，设置 10mm 左右的重叠余量，方便后续使用透明胶带平整拼合。",
  },
  {
    name: "校对 10×10cm 测试方块并打印",
    text: "生成并下载 PDF。打印第 1 页后，用实体直尺实测纸样上的 10×10cm（或 2×2in）校验方块，确认 100% 等比后全部打印。",
  },
];

const faqItems = [
  {
    question: "在 Etsy 或独立站买的 A0 电子纸样，怎么用普通家庭 A4 打印机打印？",
    answer:
      "设计师为了方便大型绘图仪出图，通常提供 A0（84.1×118.9厘米）图纸。TileStencil 能在浏览器里将巨大的 A0 图纸自动切片为十几张标准的 A4 纸，每张纸都带有网格编号（如 A1、A2）和十字对齐线，打印后像拼图一样贴合即可还原完整大图样。",
  },
  {
    question: "如何确保打印出来的衣服纸样码数精准、完全没有缩放？",
    answer:
      "打版最怕打印机默认缩放导致尺寸走样。在电脑打印对话框中，务必勾选'实际大小'（Actual Size）或将缩放设为 100%，绝不能勾选'适合页面'。打印后务必用直尺量取校验方块确认无误后再下剪裁布。",
  },
  {
    question: "拼接多张 A4 纸样有什么技巧？",
    answer:
      "TileStencil 提供了自定义重叠边缘（Overlap）。拼接时，只需剪掉每张纸右侧和下方的白边，左侧和上方的重叠区保留作为粘合底衬，对齐十字标记后用透明胶带固定，平整不起拱。",
  },
];

export default function A0SewingGuideZhPage() {
  return (
    <>
      <HowToJsonLd
        name="如何将 A0 大幅面服装纸样切片打印为 A4 纸"
        description="使用家用普通打印机将大尺寸缝纫、皮具与 Cosplay 纸样以 100% 实际大小拼版打印的完整教程。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="a0SewingGuide"
        kicker="缝纫纸样与打版拼图"
        title="家用普通打印机打印 A0 大幅面服装与 Cosplay 纸样。"
        lead="购买了 A0 规格的电子缝纫纸样或皮具版型？无需专程跑图文店花几十元打印大幅工程图，TileStencil 帮你以 1:1 毫米级精度切片为多张普通 A4 纸，在家即可轻松拼接打版。"
      >
        <section>
          <h2>为什么在家拼接打印纸样省时又省钱</h2>
          <p>
            去图文打印店出大幅蓝图通常需要等待且费用不菲。在家用 A4 纸切片拼接打印，10 分钟即可开始剪裁面料：
          </p>
          <ul>
            <li><strong>严格 1:1 物理毫米精度：</strong>确保袖山、领圈、省道弧线丝毫不差，码数标准不走样。</li>
            <li><strong>100% 免费本地工具：</strong>免装 Adobe Acrobat 昂贵付费软件，纯网页即开即用。</li>
            <li><strong>网格坐标辅助定位：</strong>每个页面都有行号列标（A1, A2, B1, B2）与十字交准标记，拼接毫无阻碍。</li>
            <li><strong>高对比黑白模式：</strong>将复杂的彩色图纸转为清晰利落的单色线条，省墨打印不渗透。</li>
          </ul>
        </section>

        <section className="guide-faq">
          <h2>常见问题解答 (FAQ)</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </section>

        <aside className="guide-callout">
          <p>需要制作手工皮具或木工线锯模板？</p>
          <Link href="/zh/print-pattern-actual-size">查看 1:1 手工版型制作指南 &rarr;</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil 开始拼版
        </Link>
      </GuideShell>
    </>
  );
}

