import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "The Rasterbator 替代工具 | 无波点高清大图分页拼接打印",
  description:
    "寻找好用的 The Rasterbator 或 Blockposters 替代软件？TileStencil 免费在线将高清图片按 1:1 真实物理尺寸（cm/in）分页切片到 A4/A3 纸张，不产生任何波点像素化，保留原始高清像素。纯浏览器本地处理，绝不上传图片。",
  keywords: [
    "Rasterbator替代工具",
    "Rasterbator无波点",
    "Blockposters替代",
    "大图高清分页打印",
    "A4拼接海报不失真",
    "无网点大图切片打印",
    "多页PDF海报生成器",
  ],
  alternates: {
    canonical: "/zh/rasterbator-alternative",
    languages: languageAlternates("rasterbatorAlternative"),
  },
  openGraph: {
    title: "The Rasterbator 替代工具 | 无波点高清大图分页拼接打印",
    description: "不产生波点像素化网点，保留原图清晰度，按真实厘米尺寸将大图切片为 A4 多页 PDF。",
    url: "/zh/rasterbator-alternative",
  },
};

const howToSteps = [
  {
    name: "上传高清图片",
    text: "选择本地 JPG 或 PNG，TileStencil 保持原图高清像素，不强行转换为圆点波点网格。",
  },
  {
    name: "设定真实物理长宽",
    text: "输入最终期望的厘米(cm)或英寸(in)尺寸，选择 A4/A3 纸张与打印边距重叠量。",
  },
  {
    name: "导出多页拼接 PDF 并打印",
    text: "一键导出带十字裁切标记和网格坐标的 PDF，按 100% 实际大小打印后拼装。",
  },
];

const faqItems = [
  {
    question: "The Rasterbator 为什么要将图片变成波点圆点？TileStencil 会这样吗？",
    answer: "The Rasterbator 经典算法是把图像转化为半色调波点网格（Halftone Dots），适合做复古波普艺术海报，但会彻底破坏文字、精细线条、木工图纸和手作线稿。TileStencil 绝不添加任何波点，它保留原图的清晰像素与边缘，确保图纸与海报高清还原。",
  },
  {
    question: "TileStencil 与 Blockposters 相比有哪些优势？",
    answer: "Blockposters 免费版限制导出张数和图片清晰度，且需要把图片上传到其服务器处理。TileStencil 完全免费开源无限制，支持毫米级精准物理尺寸控制、重叠对齐调节与高对比黑白模板，且 100% 在本地浏览器离线完成，保护隐私。",
  },
  {
    question: "拼接时如何避免出现白边和错位？",
    answer: "TileStencil 允许用户自定义 Overlap（重叠量，如 5~10mm）并在每页四周印上十字对齐线（Crosshairs）。打印后只需裁掉单侧白边，压在相邻页的重叠线上对准十字标记粘贴即可，轻松消除手工裁切误差。",
  },
];

export default function RasterbatorAlternativeZhPage() {
  return (
    <>
      <HowToJsonLd
        name="如何不用波点网格高清分页打印大幅海报"
        description="使用 TileStencil 替代 The Rasterbator 进行无损高清多页拼装打印指南。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="rasterbatorAlternative"
        kicker="RASTERBATOR 替代方案"
        title="无波点、不模糊的大图分页拼接打印工具。"
        lead="寻找 The Rasterbator 或 Blockposters 的现代替代工具？TileStencil 让普通打印机以 100% 物理真实尺寸、保留原始高清像素将图片拆切为 A4、A3 多页 PDF，且绝不上传图片。"
      >
        <section>
          <h2>为什么你需要一款没有波点网格的替代工具？</h2>
          <p>
            早期经典工具 The Rasterbator 虽然开创了多页拼海报的玩法，但其强制性的半色调波点（Halftone Dots）会让原本清晰的摄影作品、手作蓝图、大字标语变得斑驳模糊。
          </p>
          <ul>
            <li><strong>保留原图高清细节：</strong>原图彩色、灰阶和黑白轮廓均保持原始锐度，文字清晰可读。</li>
            <li><strong>精准物理长宽控制：</strong>支持直接输入厘米(cm)或英寸(in)，不再凭空猜测“放大几倍”。</li>
            <li><strong>纯本地离线隐私：</strong>全套算法在本地浏览器内存中运行，个人照片与设计草图绝不上云。</li>
            <li><strong>手作与墙绘模板：</strong>提供高对比黑白模板模式，专门优化木工下刀与墙绘描摹。</li>
          </ul>
        </section>

        <section>
          <h2>TileStencil 与传统工具对比</h2>
          <ul>
            <li><strong>画质保真度：</strong>TileStencil（原图高清无网点）vs Rasterbator（强制圆点波点）vs Blockposters（压缩降质）。</li>
            <li><strong>尺寸控制：</strong>TileStencil（真实厘米/英寸输入，100% 实际大小）vs 传统工具（仅支持估算页数）。</li>
            <li><strong>隐私安全：</strong>TileStencil（零上传，纯本地处理）vs 传统工具（需上传至第三方服务器）。</li>
          </ul>
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
          <p>需要制作等比例实体手作纸样或木工图纸？</p>
          <Link href="/zh/print-pattern-actual-size">查看纸样 1:1 等比例打印指南 →</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil，开始高清分页打印
        </Link>
      </GuideShell>
    </>
  );
}

