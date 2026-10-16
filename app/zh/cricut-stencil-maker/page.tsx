import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Cricut 刻字机模板制作 – 照片转可切割 SVG",
  description:
    "用任意照片做 Cricut、Silhouette 刻字机或激光切割机能直接切的模板。自动加连接桥，SVG 按毫米标注尺寸，导入就是正确大小。免费预览，SVG 每张 1.99 美元，不上传图片。",
  keywords: ["Cricut 模板", "刻字机模板", "激光切割模板", "SVG 模板", "照片转 SVG"],
  alternates: {
    canonical: "/zh/cricut-stencil-maker",
    languages: languageAlternates("cricutStencil"),
  },
  openGraph: {
    title: "Cricut 刻字机模板制作 – 照片转可切割 SVG",
    description: "照片转可切割的模板 SVG，自动加连接桥，按刻字机和激光机需要的尺寸输出。",
    url: "/zh/cricut-stencil-maker",
  },
};

const howToSteps = [
  { name: "选择照片或图案", text: "选一张主体清楚的 JPG 或 PNG，只在浏览器里处理，不会上传。" },
  { name: "调整模板", text: "拖动阈值直到形状清楚。自动连接桥会把字母、眼睛、圆环中间连住，切完不会掉。" },
  { name: "设定成品尺寸", text: "填要切的宽度，比如帆布袋 20 厘米、招牌 60 厘米，SVG 按这个尺寸以毫米标注。" },
  { name: "导出 SVG 并切割", text: "点“导出 SVG”，在 Cricut Design Space（上传 → 上传图片）、Silhouette Studio 或 LightBurn 里导入，用模板贴纸、Mylar 膜或卡纸切割。" },
];

const faqItems = [
  {
    question: "SVG 怎么收费？",
    answer: "预览、调整和打印分页 PDF 都免费。可切割 SVG 每张图 1.99 美元，用 PayPal 或银行卡付一次，不用注册、没有订阅；付完后同一张图可以反复导出。14 天内可全额退款。",
  },
  {
    question: "怎么用照片给 Cricut 做模板？",
    answer: "在本页选照片，调阈值到黑白预览满意，填尺寸，点“导出 SVG”。在 Cricut Design Space 里用“上传 → 上传图片”选这个 SVG，导入后就是带好连接桥、可以直接切的图。",
  },
  {
    question: "导入 Cricut Design Space 尺寸对吗？",
    answer: "文件里以毫米标注尺寸，Design Space 和大多数切割软件都能正确读取。导入后看一眼宽度，如果不一致，直接输入你在这里填的宽度即可，比例是锁定的。",
  },
  {
    question: "用什么材料切模板？",
    answer: "一次性用在衣服、玻璃、木头上，用模板贴纸或背胶贴纸；要反复喷涂，用 5–7 mil 的 Mylar 膜；试切用卡纸。贴纸用 2 毫米连接桥，Mylar 和卡纸用 3–4 毫米。",
  },
  {
    question: "激光切割机能用吗？",
    answer: "能。SVG 里都是闭合路径，LightBurn、xTool、Glowforge 都会把每个形状当作切割线，图层设成切割而不是雕刻即可。",
  },
];

const intro = {
  eyebrow: "CRICUT 与激光切割模板",
  heading: "把任意照片做成刻字机能切的模板。",
  copy: "选照片，实时预览调整模板，导出带好连接桥、按毫米标注尺寸的可切割 SVG，适用于 Cricut、Silhouette 和激光切割机。全部在浏览器里完成。",
};

export default function ChineseCricutStencilPage() {
  return (
    <>
      <HowToJsonLd name="如何用照片制作 Cricut 模板 SVG" description="把照片转成带自动连接桥的可切割模板 SVG。" steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp locale="zh-CN" intro={intro} defaults={{ renderMode: "template", bridges: true, widthCm: 20, heightCm: 20 }}>
        <article className="app-guide">
          <h2>比在 Design Space 里描图强在哪</h2>
          <p>
            Cricut Design Space 能去背景，但它不知道模板里哪些部分切完会掉。字母 O 的中间、眼白这类孤岛，要么掉下来，要么得手动加桥。TileStencil
            会自动找出来并加上连接桥，清掉太小、剥不下来的碎点，再按准确尺寸导出闭合路径，上传就能切。
          </p>
          <h2>适合上手的项目</h2>
          <ul>
            <li>宠物照、全家福印到帆布袋和 T 恤上（透过模板贴纸刷布料颜料）</li>
            <li>刷在木板上的招牌、门牌号</li>
            <li>玻璃蚀刻</li>
            <li>用 Mylar 膜切的可重复使用墙面、家具模板</li>
            <li>文字：用<Link href={localizedPath("zh-CN", "letterStencils")}>字母模板生成器</Link>，同样能导出 SVG</li>
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
