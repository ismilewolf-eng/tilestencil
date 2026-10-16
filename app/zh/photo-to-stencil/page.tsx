import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "照片转镂空模板 – 免费在线制作，按真实尺寸打印",
  description:
    "在浏览器里把照片转成黑白镂空模板，拖动阈值实时预览，再按需要的尺寸分页打印到 A4、A3 或 Letter。不上传图片，不用注册。",
  keywords: ["照片转模板", "图片转镂空模板", "镂空模板制作", "喷漆模板", "在线模板生成"],
  alternates: {
    canonical: "/zh/photo-to-stencil",
    languages: languageAlternates("photoToStencil"),
  },
  openGraph: {
    title: "照片转镂空模板 – 免费，按真实尺寸打印",
    description: "把照片转成可调的黑白镂空模板，并按真实尺寸分页打印。",
    url: "/zh/photo-to-stencil",
  },
};

const howToSteps = [
  { name: "选择照片", text: "选一张主体清楚、背景干净的 JPG 或 PNG。图片只在浏览器里处理，不会上传。" },
  { name: "调整黑白分界", text: "一边看预览一边拖动滑块，直到轮廓清楚。想镂空主体而不是背景，就勾选黑白反转。" },
  { name: "设定成品尺寸", text: "输入墙面、衣服、蛋糕或木板上需要的宽度，工具会自动分到 A4、A3 或 Letter。" },
  { name: "按 100% 打印后裁切", text: "以实际大小打印，按网格编号和重叠标记拼好，再用美工刀刻掉黑色部分。" },
];

const faqItems = [
  {
    question: "能导出给 Cricut、刻字机或激光切割机用的 SVG 吗？",
    answer: "可以。在黑白模板模式下点“导出 SVG”，文件里是已经带好连接桥的闭合切割路径，按你填的宽度以毫米标注尺寸，导入 Cricut Design Space、Silhouette Studio、LightBurn 或 Inkscape 都是正确大小。SVG 每张图 1.99 美元，付一次即可；打印 PDF 仍然免费。",
  },
  {
    question: "怎样免费把照片做成镂空模板？",
    answer: "在本页选择照片，拖动阈值直到黑白预览轮廓清楚，设定尺寸后导出 PDF。免费、无需账号，照片不离开你的浏览器。",
  },
  {
    question: "什么样的照片适合做模板？",
    answer: "主体单一、明暗对比强的照片最好，比如侧光人像、纯色背景前的宠物、标志或剪影。背景杂乱会变成很多碎点，最好先裁掉。",
  },
  {
    question: "阈值滑块是什么意思？",
    answer: "比阈值亮的像素变白，比阈值暗的变黑。数值小，形状更简单、线条更细；数值大，保留更多阴影细节。以预览效果为准。",
  },
  {
    question: "模板能比打印纸大吗？",
    answer: "可以，这正是 TileStencil 的用途。输入成品尺寸，比如墙面 120 厘米宽，它会自动拆成带编号、重叠和对齐标记的多页 PDF。",
  },
];

const intro = {
  eyebrow: "免费照片转模板",
  heading: "把照片变成镂空模板，再按需要的尺寸打印出来。",
  copy: "选择照片，实时预览调整黑白分界，导出可分页打印的模板，支持 A4、A3 和 US Letter。全部在浏览器本地完成。",
};

export default function ChinesePhotoToStencilPage() {
  return (
    <>
      <HowToJsonLd name="如何把照片做成可打印的镂空模板" description="把照片转成黑白镂空模板，并按真实尺寸分页打印。" steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp locale="zh-CN" intro={intro} defaults={{ renderMode: "template", bridges: true, widthCm: 40, heightCm: 30 }}>
        <article className="app-guide">
          <h2>做出干净模板的几个要点</h2>
          <ul>
            <li><strong>先要有对比。</strong>侧光人像、浅色墙前的深色物体，形状最清楚。</li>
            <li><strong>先裁剪。</strong>选文件前去掉杂乱背景，阈值对所有像素一视同仁。</li>
            <li><strong>盯住眼睛和边缘。</strong>调到五官和轮廓一眼能认出来为止；脸被涂黑就把阈值调小。</li>
            <li><strong>反转做镂空。</strong>想喷涂主体而不是背景时，勾选黑白反转。</li>
          </ul>
          <h2>自动连接桥：真正能刻的模板</h2>
          <ul>
            <li><strong>自动找出孤岛。</strong>被黑色完全包住的白色块，比如字母 O 的中间、眼白，一刻就会掉。关掉连接桥可以看到它们被标成红色。</li>
            <li><strong>每座桥走最短路线。</strong>从孤岛到最近的、已经固定住的纸面刻一条细桥，尽量不影响图案。</li>
            <li><strong>宽度可调。</strong>纸和卡纸用 2 毫米；要反复喷涂的模板膜、硬纸板用 3～4 毫米。</li>
            <li><strong>自动清碎点。</strong>小于约 1.5 毫米的细节刻不干净，打印前会被清掉。</li>
          </ul>
          <h2>常见用途</h2>
          <ul>
            <li>墙面、招牌、家具的喷漆模板</li>
            <li>烙画、线锯图样，描到木板上</li>
            <li>T 恤和帆布袋的布料颜料模板</li>
            <li>按烤盘尺寸打印的蛋糕、饼干模板</li>
            <li>万圣节南瓜：见<Link href={localizedPath("zh-CN", "pumpkinStencil")}>南瓜雕刻模板生成器</Link></li>
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
