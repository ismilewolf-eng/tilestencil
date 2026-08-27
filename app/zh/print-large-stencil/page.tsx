import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "墙绘模板放大打印：把图片拆成可拼接纸样",
  description:
    "把设计按真实墙面或画布尺寸放大成多页 PDF；可选择高对比黑白模板、设置重叠和裁切标记，再用普通打印机拼接。",
  keywords: ["墙绘模板放大打印", "黑白模板打印", "图片放大打印", "描摹模板", "大尺寸纸样"],
  alternates: {
    canonical: "/zh/print-large-stencil",
    languages: languageAlternates("stencilGuide"),
  },
  openGraph: {
    title: "墙绘模板放大打印：把图片拆成可拼接纸样",
    description: "按真实尺寸放大图片，再输出带定位标记的多页模板 PDF。",
    url: "/zh/print-large-stencil",
  },
};

const howToSteps = [
  {
    name: "测量实际墙面或画板尺寸",
    text: "测量墙面、画布或板材上实际可用的宽度和高度，并直接输入真实尺寸。",
  },
  {
    name: "选择黑白模板模式",
    text: "导出样式选择“黑白模板”，生成高对比度线条轮廓，更易于描摹和下刀裁切。",
  },
  {
    name: "按定位标记拼贴转印",
    text: "按 100% 实际大小打印全部页面，按页码顺序拼接固定，进行墙面描画或纸样转印。",
  },
];

const faqItems = [
  {
    question: "黑白模板模式有什么优势？",
    answer: "黑白模板会将彩色或灰阶图案转换为高对比的黑白线条与块面，极大减少墨水消耗，同时让图案边缘非常清晰，便于用复写纸或投影进行二次转印描摹。",
  },
  {
    question: "大幅面墙绘拼接时怎样减少接缝误差？",
    answer: "建议设置 5~10mm 的拼接重叠量（Overlap）。拼接时仅裁掉右边或下边压住相邻图案的多余白边，利用重叠区域对齐参考线，可有效消除手工裁切带来的细微误差。",
  },
  {
    question: "如何固定拼接完成的巨幅模板纸？",
    answer: "建议使用纸胶带（美纹纸）先在正面微调定位，确认无误后翻转到背面，用透明胶带牢固贴合整条接缝，这样正面画线时不会卡笔。",
  },
];

export default function PrintLargeStencilPage() {
  return (
    <>
      <HowToJsonLd
        name="如何放大打印墙绘与描摹模板"
        description="将草图或设计按真实墙面比例放大，导出带定位标记的高对比黑白拼装模板 PDF。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="stencilGuide"
      kicker="墙绘与描摹模板"
      title="把图片放大到墙面尺寸，再用普通纸张拼出来。"
      lead="做墙绘、画布描摹、手作切割或大型图案转印时，可以先把图片转为高对比黑白模板，再按最终尺寸拆成可拼接的打印页。"
    >
      <section>
        <h2>先决定模板要有多大</h2>
        <p>
          测量墙面、画布或板材上实际可用的宽度和高度，然后把这个数值直接填入工具。TileStencil 会按毫米计算每一页覆盖的区域，因此不需要靠“放大几倍”猜最终尺寸。
        </p>
        <ul>
          <li>墙绘前把草图放大到指定的厘米或英寸。</li>
          <li>把图案拆成可描摹、可裁切的大型纸样。</li>
          <li>为活动布置或手作项目制作等比例轮廓参考。</li>
        </ul>
      </section>

      <section>
        <h2>选择黑白模板，再设置拼接余量</h2>
        <p>
          导出样式选择“黑白模板”时，图片会变成高对比效果，更容易看清轮廓、描线或决定裁切区域。纸张边距要根据你的打印机保留；相邻页可加入少量重叠，让裁切稍有误差时仍能对齐图案。
        </p>
        <p>
          A4 适合大多数家用打印机，A3 能减少接缝；横向纸张通常更适合宽幅图案。无论选哪一种，PDF 都会标出每张纸在拼接网格中的位置。
        </p>
      </section>

      <section>
        <h2>拼接前先做一页样张</h2>
        <p>
          先按 <strong>Actual Size / 100%</strong> 打一页，确认纸张规格和打印机边距正确。随后将全部页面铺开，按页码从左到右、从上到下排列；仅裁掉会遮住相邻图案的边缘，再从背面固定。这样保留的重叠区域能帮助你校正接缝。
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
        <p>只想把照片或图示拼成墙面海报？</p>
        <Link href="/zh/print-image-on-multiple-pages">查看图片分页打印的完整步骤 →</Link>
      </aside>

      <Link className="guide-cta" href="/zh">
        打开 TileStencil，制作放大模板
      </Link>
    </GuideShell>
    </>
  );
}
