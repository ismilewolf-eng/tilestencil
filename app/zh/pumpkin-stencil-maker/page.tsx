import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { StencilExampleSection } from "@/components/StencilExample";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "南瓜雕刻模板生成器 – 用任意照片做万圣节南瓜模板",
  description:
    "用宠物、家人或喜欢的角色照片做专属南瓜雕刻模板。调整黑白分界，按南瓜实际大小设置尺寸，免费打印，不上传图片。",
  keywords: ["南瓜雕刻模板", "万圣节南瓜模板", "南瓜灯模板", "照片做南瓜模板"],
  alternates: {
    canonical: "/zh/pumpkin-stencil-maker",
    languages: languageAlternates("pumpkinStencil"),
  },
  openGraph: {
    title: "南瓜雕刻模板生成器 – 用任意照片做模板",
    description: "用任意照片做南瓜雕刻模板，按南瓜实际大小打印。",
    url: "/zh/pumpkin-stencil-maker",
  },
};

const howToSteps = [
  { name: "选一张照片", text: "宠物、人脸、标志或背景干净的角色图都可以。照片留在你的浏览器里。" },
  { name: "调整模板", text: "拖动阈值滑块，直到预览里是粗壮清楚的色块。黑色部分就是要刻掉或刮掉的地方，尽量保持大块、相连。" },
  { name: "按南瓜大小设尺寸", text: "量南瓜最平的一面，中等南瓜一般填 15–25 厘米宽。" },
  { name: "打印、贴上、扎点、雕刻", text: "按实际大小打印，贴到南瓜上，用针沿线扎孔，取下纸再照点雕刻。" },
];

const faqItems = [
  {
    question: "怎么用照片做南瓜雕刻模板？",
    answer: "在本页选择照片，拖动阈值直到黑白预览出现清楚的大色块，输入南瓜宽度，下载 PDF，按 100% 打印后贴到南瓜上。",
  },
  {
    question: "南瓜模板做多大合适？",
    answer: "用软尺量南瓜最平的那一面。中等南瓜一般 15–20 厘米，大南瓜可以做到 25–30 厘米。留出边距，别让图案绕到弧面太多。",
  },
  {
    question: "哪些照片好刻？",
    answer: "明暗分明的照片：正对镜头的宠物、侧脸剪影、简单标志。胡须、发丝这类细节太细刻不出来，把阈值调小让它们消失。",
  },
  {
    question: "免费吗？",
    answer: "免费，无需注册，没有水印和页数限制，照片完全在浏览器里处理。",
  },
];

const intro = {
  eyebrow: "南瓜雕刻模板生成器",
  heading: "用任意照片，做一个南瓜雕刻模板。",
  copy: "选择照片，实时预览调整黑白模板，按南瓜宽度设置尺寸，免费打印雕刻模板。照片不会离开这个浏览器。",
};

export default function ChinesePumpkinStencilPage() {
  return (
    <>
      <HowToJsonLd name="如何用照片制作南瓜雕刻模板" description="把照片转成按南瓜大小打印的雕刻模板。" steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp locale="zh-CN" intro={intro} defaults={{ renderMode: "template", bridges: true, bridgeMm: 3, widthCm: 18, heightCm: 18 }}>
        <article className="app-guide">
          <StencilExampleSection locale="zh-CN" name="pumpkin" />
          <h2>让模板真的能刻出来</h2>
          <ul>
            <li><strong>色块要粗。</strong>打印出来细于约 5 毫米的部分，一刻就断。把阈值调小去掉细节。</li>
            <li><strong>孤岛自动处理。</strong>眼珠、字母 O 的中间刻穿后会掉，自动连接桥会留一小条南瓜连住。南瓜上建议用 3～4 毫米的桥，太细容易断。</li>
            <li><strong>刻穿还是刮皮？</strong>黑色部分一般刻穿；想做明暗人像，就把灰色部分的皮刮掉，点灯后会透出柔光。</li>
            <li><strong>大南瓜可以做大图。</strong>图案超过一张纸，TileStencil 会分页并加重叠标记，照样对得齐。</li>
          </ul>
          <p>
            想做别的模板？用通用的<Link href={localizedPath("zh-CN", "photoToStencil")}>照片转镂空模板</Link>，墙面、衣服、木板都能用。
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
