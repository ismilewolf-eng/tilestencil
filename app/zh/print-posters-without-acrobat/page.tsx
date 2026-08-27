import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "无需 Adobe Acrobat 免费大图分页打印海报与图纸教程",
  description:
    "无需购买昂贵的 Adobe Acrobat Pro 订阅，用普通打印机如何将一张大图按真实尺寸拆分打印到多张 A4/A3 纸上？TileStencil 提供免费在线图片切片、拼接重叠标记与多页 PDF 导出。",
  keywords: [
    "无需Acrobat打印海报",
    "免费海报分页打印",
    "不用Adobe切片打印大图",
    "普通A4拼大海报",
    "图纸分页打印免安装",
    "Acrobat海报打印替代",
  ],
  alternates: {
    canonical: "/zh/print-posters-without-acrobat",
    languages: languageAlternates("acrobatAlternative"),
  },
  openGraph: {
    title: "无需 Adobe Acrobat 免费大图分页打印海报与图纸教程",
    description: "无需安装任何专业软件或付费订阅，浏览器直接将大图拆分为可拼接的多页 A4/A3 PDF。",
    url: "/zh/print-posters-without-acrobat",
  },
};

const howToSteps = [
  {
    name: "选择图片并输入目标尺寸",
    text: "上传本地 JPG/PNG，输入最终希望达到的真实物理宽度与高度（厘米或英寸）。",
  },
  {
    name: "设定纸张与接缝重叠量",
    text: "选择 A4 或 A3 纸张规格，设定 5~8mm 拼接重叠余量，实时预览排版网格。",
  },
  {
    name: "导出 PDF 并按 100% 比例打印",
    text: "在浏览器中直接打印导出的 PDF，勾选“实际大小 / 100%”，裁切重叠白边后拼接组装。",
  },
];

const faqItems = [
  {
    question: "为什么很多人用 Adobe Acrobat 打印多页海报很麻烦？",
    answer: "Adobe Acrobat Pro 需要昂贵的按月订阅，而免费版 Reader 的“海报（Poster）”打印功能无法自由设定物理厘米尺寸、不支持可视化重叠微调与黑白模板转换，且无法直接保存为便携的多页 PDF 文件分发。TileStencil 在浏览器中即可一键完成可视化切片并导出标准 PDF。",
  },
  {
    question: "不用专业软件，怎样保证拼出来的海报尺寸绝对准确？",
    answer: "TileStencil 底层按毫米物理单位精确切分。只要打印时在系统打印对话框中关闭“适合页面（Fit to page）”，选择“实际大小（Actual Size / 100%）”，打印出来的每一页尺寸与电脑设定的真实尺寸完全一致。",
  },
  {
    question: "导出的多页 PDF 可以在手机或别人的电脑上打印吗？",
    answer: "可以！TileStencil 导出的是标准 PDF 文件，内置了每一页的页码、网格坐标（如 A1、A2）和十字对齐标记，发给任何打印店或在手机端都能直接打开打印。",
  },
];

export default function AcrobatAlternativeZhPage() {
  return (
    <>
      <HowToJsonLd
        name="如何无需 Adobe Acrobat 免费分页打印大幅海报"
        description="免安装、免订阅，在浏览器中将大图拆分为多页 A4 打印拼接完整教程。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="acrobatAlternative"
        kicker="免费海报打印指南"
        title="无需 Adobe Acrobat，免费大图分页打印海报与纸样。"
        lead="想把一张大图、工程蓝图或手作纸样拆到多张普通 A4 纸上拼起来？告别昂贵的 Adobe Acrobat Pro 订阅与繁琐的打印机驱动设置，用 TileStencil 在浏览器中即可完成高精度多页 PDF 切片。"
      >
        <section>
          <h2>告别付费订阅：更轻快、更直观的海报打印工具</h2>
          <p>
            许多教程教大家用 Adobe Acrobat 的“海报”模式打印大图，但常常遇到无法控制精确厘米数、接缝无重叠导致拼不准等问题。TileStencil 专为多页拼接场景设计：
          </p>
          <ul>
            <li><strong>完全免费无需订阅：</strong>不花一分钱，打开网页就能用。</li>
            <li><strong>实时可视化网格预览：</strong>输入尺寸立即看到需要几行几列、一共多少张纸。</li>
            <li><strong>自定义拼接重叠量（Overlap）：</strong>预留对齐边缘，手工裁剪粘贴不再跑偏。</li>
            <li><strong>通用标准 PDF 导出：</strong>生成的 PDF 可随时分享、保存或带到打印店输出。</li>
          </ul>
        </section>

        <section>
          <h2>三步完成大图分页拼接</h2>
          <ol>
            <li><strong>设定真实尺寸：</strong>输入海报或图纸最终需要的物理宽高（如 80 × 120 cm）。</li>
            <li><strong>选择纸张与边距：</strong>选择手头的 A4、A3 或 Letter 纸，预留打印机边距。</li>
            <li><strong>100% 实际大小打印：</strong>导出 PDF，在任意浏览器中按实际比例打印并顺次拼贴。</li>
          </ol>
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
          <p>寻找 The Rasterbator 或 Blockposters 的无波点替代品？</p>
          <Link href="/zh/rasterbator-alternative">查看 Rasterbator 替代方案对比 →</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil，开始免费分页打印
        </Link>
      </GuideShell>
    </>
  );
}

