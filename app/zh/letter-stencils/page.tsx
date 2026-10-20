import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "字母模板生成器 – 任意文字、任意大小，免费打印",
  description:
    "输入任意单词或数字，按需要的尺寸打印镂空字母，从 5 厘米到一米多高都行，自动分页到 A4、A3 或 Letter。三种模板字体，免费，无需注册。",
  keywords: ["字母模板", "镂空字母", "数字模板打印", "喷漆字模板", "模板字体"],
  alternates: {
    canonical: "/zh/letter-stencils",
    languages: languageAlternates("letterStencils"),
  },
  openGraph: {
    title: "字母模板生成器 – 任意文字、任意大小",
    description: "输入文字、选模板字体，按真实尺寸分页打印。",
    url: "/zh/letter-stencils",
  },
};

const howToSteps = [
  { name: "输入文字", text: "输入单词、名字、门牌号或短句，换行可以叠成多行。" },
  { name: "选模板字体", text: "三种模板字体都自带小连接桥，A、B、O、8 这类字母的中间不会掉。" },
  { name: "设定成品尺寸", text: "输入招牌、墙面或箱子上需要的总宽度，超过一张纸会自动分页。" },
  { name: "打印、拼贴、刻字", text: "按实际大小打印，按网格编号拼好，刻掉黑色字形，或转描到模板膜、硬纸板上。" },
];

const faqItems = [
  {
    question: "怎么打印大号字母模板？",
    answer: "在本页输入文字、选字体，填总宽度，比如花园招牌 90 厘米。工具会把文字拆到普通打印纸上，并带重叠和裁切标记，按 100% 打印后拼起来即可。",
  },
  {
    question: "模板字母为什么有缺口？",
    answer: "A、B、D、O、P、R 和 0、4、6、8、9 这些字形中间是封闭的，刻穿后中间会掉下来，所以模板字体用小桥把它们连住。",
  },
  {
    question: "可以做多大的字？",
    answer: "多大都行。小字一页就够；车位编号、仓库招牌这类大字，输入完整尺寸，PDF 会按需要分成多页。",
  },
  {
    question: "能商用吗？",
    answer: "可以。字体采用 SIL 开源字体许可，允许用于招牌和产品。你的文字不会离开浏览器。",
  },
];

const intro = {
  eyebrow: "字母模板生成器",
  heading: "输入任意文字，按需要的尺寸打印镂空字母。",
  copy: "选模板字体，设成品宽度，下载自动分页的 PDF，支持 A4、A3 和 US Letter。免费、无需注册、不上传任何内容。",
};

export default function ChineseLetterStencilsPage() {
  return (
    <>
      <HowToJsonLd name="如何在家打印大号字母模板" description="生成任意大小的镂空字母，并按真实尺寸分页打印。" steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp route="letterStencils" locale="zh-CN" intro={intro} source="text" defaults={{ renderMode: "template", widthCm: 60, heightCm: 20 }}>
        <article className="app-guide">
          <h2>常见用途</h2>
          <ul>
            <li>门牌号、信箱上的名字</li>
            <li>刷在木板上的花园、农场、店铺招牌</li>
            <li>货箱、工具箱、收纳箱上的标记</li>
            <li>车位编号、地面标线</li>
            <li>墙面标语、儿童房名字</li>
          </ul>
          <h2>让字边更干净</h2>
          <ul>
            <li>用喷胶或美纹纸固定模板，防止颜料渗到边下。</li>
            <li>用模板刷或海绵轻拍上色，不要横着刷。</li>
            <li>颜料半干时揭下模板，边缘最利落。</li>
            <li>想做图案而不是文字？用<Link href={localizedPath("zh-CN", "photoToStencil")}>照片转镂空模板</Link>。</li>
          </ul>
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
