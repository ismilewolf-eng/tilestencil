import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "纸样等比例打印：木工、皮具与手作纸格 100% 真实尺寸还原",
  description:
    "无需大幅面绘图机，将木工图纸、手工皮具纸格、服装缝纫纸样与 Cosplay 道具图按 1:1 物理尺寸分页打印在普通 A4 纸上。",
  keywords: [
    "纸样等比例打印",
    "木工图纸1比1打印",
    "皮具纸格打印",
    "缝纫纸样拼接",
    "Cosplay道具纸样放大",
    "100% 实际大小打印",
  ],
  alternates: {
    canonical: "/zh/print-pattern-actual-size",
    languages: languageAlternates("patternGuide"),
  },
  openGraph: {
    title: "纸样等比例打印：木工、皮具与手作纸格 100% 真实尺寸还原",
    description: "精准按厘米/英寸物理尺寸将手工纸样分页切片，A4 普通纸即可拼出 1:1 工业纸样。",
    url: "/zh/print-pattern-actual-size",
  },
};

const howToSteps = [
  {
    name: "确认设计图真实尺寸",
    text: "在 CAD 或绘图软件中查看纸样的真实物理宽度与高度（厘米或英寸），并输入 TileStencil。",
  },
  {
    name: "设定打印边距与重叠对齐线",
    text: "选择常用的 A4 或 Letter 纸张，设定 5~8mm 边距和对齐重叠线，生成多页拼装 PDF。",
  },
  {
    name: "100% 无缩放打印与拼版",
    text: "打印时勾选“实际大小 / 100%”，先测量第一页的基准标尺，再按网格坐标拼成完整 1:1 纸样。",
  },
];

const faqItems = [
  {
    question: "如何验证打印出来的纸格是否确实是 1:1 真实尺寸？",
    answer: "如果原图包含参考标尺（如 5cm 测试方块），打印第一页后立即用钢尺测量。只要打印时选择了“Actual Size / 100%”，误差通常在 0.5mm 以内，完全满足木工与手工皮具的精度要求。",
  },
  {
    question: "皮具和木工制作推荐哪种渲染模式？",
    answer: "强烈推荐“黑白模板”模式。它会强化轮廓线、过滤掉背景杂色，不仅省墨，而且线条清晰分明，非常方便直接贴在木板或皮革上用划线针、冲子进行定位。",
  },
  {
    question: "裁切纸样时如何保持精度？",
    answer: "TileStencil 每页四周都带有精细的十字对准标记（Registration Marks）。拼接时使用钢尺和美工刀裁掉一边重叠区，对准两页的十字标记，用纸胶带背面固定即可。",
  },
];

export default function PrintPatternActualSizePage() {
  return (
    <>
      <HowToJsonLd
        name="如何等比例 1:1 打印手工木工与皮具纸样"
        description="将手作图纸与纸格按毫米精度分切到 A4 纸上，打印后精准拼装为 1:1 实体模型纸样。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="patternGuide"
        kicker="手作与工业纸格"
        title="手工纸样 1:1 等比例打印，普通 A4 拼出精准实体纸格。"
        lead="做木工打样、手工皮具开版、服装打版或 Cosplay 道具时，无需购买昂贵的绘图仪，普通家用打印机就能输出高精度 100% 实体尺寸图纸。"
      >
        <section>
          <h2>为什么纸样制作对“真实尺寸”要求极高？</h2>
          <p>
            手作和工程打版不同于普通装饰画，哪怕 2% 的缩放偏差也会导致木榫插接不上、皮具缝线孔位错位或服装版型走样。TileStencil 底层使用毫米级（mm）物理坐标计算，严格杜绝任何画面拉伸与比例形变。
          </p>
          <ul>
            <li>手工皮具：包袋、钱包、表带等 1:1 开料纸格精确还原。</li>
            <li>木工作业：家具榫卯、曲线切割模板、木雕轮廓等比例放大。</li>
            <li>Cosplay & 道具：EVA 泡棉头盔、铠甲与手办纸模分段打样。</li>
            <li>服装缝纫：PDF 电子裁片图按实际胸围衣长等比例输出。</li>
          </ul>
        </section>

        <section>
          <h2>制作高精度纸样的关键要点</h2>
          <ol>
            <li><strong>锁定比例：</strong>上传设计图后，TileStencil 会自动读取图片宽高比；只需输入宽或高中的一个值，另一个维度会自动匹配。</li>
            <li><strong>预留重叠区：</strong>设置 5~8mm 的 Overlap 重叠量，相邻纸张边缘会共享一小段图样，即使手工裁纸稍有抖动也能完美对齐。</li>
            <li><strong>黑白模板省墨：</strong>选择“黑白模板”输出，自动滤除阴影与渐变，以最清晰的线条呈现下刀路径。</li>
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
          <p>需要制作墙面彩绘、油画描摹或大幅背景海报？</p>
          <Link href="/zh/print-large-stencil">查看墙绘与大型描摹模板的制作指南 →</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil，开始纸样等比例打印
        </Link>
      </GuideShell>
    </>
  );
}
