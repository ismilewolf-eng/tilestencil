import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { StencilExampleSection } from "@/components/StencilExample";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "纹身转印模板制作 – 按真实尺寸打印图案",
  description:
    "把纹身图案或照片转成干净的黑白线稿，按身体部位的实际尺寸打印到转印纸上，或用来描图。免费，图案不会上传。",
  keywords: ["纹身转印模板", "纹身模板打印", "图片转纹身线稿", "纹身转印纸"],
  alternates: {
    canonical: "/zh/tattoo-stencil-maker",
    languages: languageAlternates("tattooStencil"),
  },
  openGraph: {
    title: "纹身转印模板制作 – 按真实尺寸打印",
    description: "把图案转成干净的模板线稿，按纹身部位的实际尺寸打印。",
    url: "/zh/tattoo-stencil-maker",
  },
};

const howToSteps = [
  { name: "选择图案", text: "手稿、图样或照片都可以，白底线稿效果最好。文件只在浏览器里处理。" },
  { name: "用阈值清理", text: "拖动滑块，直到线条实心、背景纯白。数值小会去掉浅色阴影，数值大保留更多。" },
  { name: "设定准确尺寸", text: "量好身体部位，填宽度，比如手腕 8 厘米、小臂 25 厘米。大面积图案会分页并带对齐标记。" },
  { name: "打印并转印", text: "按实际大小打印到喷墨纹身转印纸上，或打印在普通纸上再描到热敏纸或皮肤上。" },
];

const faqItems = [
  {
    question: "怎么把图片做成纹身转印模板？",
    answer: "在这里选择图片，拖动阈值只保留想要的黑色线条，输入纹身部位的宽度，导出 PDF，按 100% 打印到转印纸或普通纸上。",
  },
  {
    question: "普通打印机能打纹身模板吗？",
    answer: "可以。喷墨纹身转印纸就是给普通喷墨打印机用的。热敏打印机线条更锐利，也可以先打在普通纸上，再手描到热敏纸上。务必选实际大小，别让图案被缩小。",
  },
  {
    question: "图案会被上传吗？",
    answer: "不会。转换和生成 PDF 全部在浏览器里完成，原创图案只留在你的设备上。",
  },
];

const intro = {
  eyebrow: "纹身转印模板",
  heading: "把图案变成干净的纹身模板，按准确尺寸打印。",
  copy: "选择手稿或照片，用阈值滑块清理线条，输入部位尺寸，打印到转印纸或用于描图。不上传任何内容。",
};

export default function ChineseTattooStencilPage() {
  return (
    <>
      <HowToJsonLd name="如何按准确尺寸制作并打印纹身模板" description="把图案转成黑白纹身模板，并按部位尺寸打印。" steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp locale="zh-CN" intro={intro} defaults={{ renderMode: "template", widthCm: 10, heightCm: 10 }}>
        <article className="app-guide">
          <StencilExampleSection locale="zh-CN" name="tattoo" />
          <h2>线条干净的几个要点</h2>
          <ul>
            <li><strong>平拍或扫描。</strong>白天正对手稿拍摄，背景亮度才均匀。</li>
            <li><strong>先低后高。</strong>先用低阈值只留轮廓，再慢慢调高，直到细线连上、纸面还没发灰。</li>
            <li><strong>先打一张试尺寸。</strong>用普通纸打出来比一比部位，确认后再用转印纸。</li>
          </ul>
          <p>
            要给颜料、布料或木头做模板？用通用的<Link href={localizedPath("zh-CN", "photoToStencil")}>照片转镂空模板</Link>。
          </p>
          <h2>常见问题</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </article>
      </TileStencilApp>
    </>
  );
}
