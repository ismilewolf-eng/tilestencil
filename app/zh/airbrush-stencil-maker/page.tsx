import type { Metadata } from "next";
import { StencilLanding } from "@/components/StencilLanding";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "喷笔模板制作 – 用任意图片做正片和负片喷笔模板",
  description: "用任意图片做喷笔模板和遮罩：一键切换正片和负片，可重复使用的模板加连接桥，打印或导出 SVG 用胶片、Mylar 膜切割。",
  alternates: { canonical: "/zh/airbrush-stencil-maker", languages: languageAlternates("airbrushStencil") },
  openGraph: { title: "喷笔模板制作 – 用任意图片做正片和负片喷笔模板", description: "用任意图片做喷笔模板和遮罩：一键切换正片和负片，可重复使用的模板加连接桥，打印或导出 SVG 用胶片、Mylar 膜切割。", url: "/zh/airbrush-stencil-maker" },
};

export default function ChineseAirbrushStencilPage() {
  return (
    <StencilLanding
      locale="zh-CN"
      intro={{ eyebrow: "喷笔模板制作", heading: "用任意图片做正片和负片喷笔模板。", copy: "用黑白反转在模板和遮罩之间切换，可重复使用的模板保留连接桥，按实际尺寸打印，或导出 SVG 用胶片、Mylar 膜或遮盖膜切割。" }}
      defaults={{ renderMode: "template", bridges: true, bridgeMm: 2, widthCm: 18, heightCm: 13 }}
      howToName={"喷笔模板制作 – 用任意图片做正片和负片喷笔模板"}
      howToDescription={"用任意图片做喷笔模板和遮罩：一键切换正片和负片，可重复使用的模板加连接桥，打印或导出 SVG 用胶片、Mylar 膜切割。"}
      howToSteps={[
        { name: "选图", text: "干净的图形、火焰、骷髅、文字、明暗分明的人像都合适。" },
        { name: "选正片或负片", text: "黑色部分会被刻掉；用黑白反转切换哪里上色、哪里遮住。" },
        { name: "设尺寸", text: "填在衣服、头盔、模型或画布上的成品宽度。" },
        { name: "切割并喷涂", text: "可重复用的模板用胶片或 Mylar 膜，一次性遮罩用遮盖膜，薄喷几遍。" },
      ]}
      sections={[
        { heading: "正片和负片", items: ["正片：图案被刻空，颜料喷在图案上。", "负片（遮罩）：盖住图案，颜料喷在周围。", "同一张图用黑白反转就能互相切换，也可以分两遍做：先透过遮罩喷背景，再透过模板喷细节。"] },
        { heading: "材料", items: ["胶片或 Mylar 膜（3–7 mil）：可重复用，薄的能贴合曲面，记得开连接桥。", "遮盖膜（frisket）：低黏背胶，适合一次性遮罩，碎片会粘在原位，可以关掉连接桥。", "转印膜或贴纸：头盔、汽车等硬表面。"] },
        { heading: "喷笔技巧", items: ["模板边缘稍微抬起，边缘柔和；压平则边缘锐利。", "低气压（15–25 psi）垂直喷，减少渗到边缘下。", "换色前用喷笔清洗剂擦模板，免得颜料堆在连接桥上。"] },
      ]}
      example="airbrush"
      faqItems={[
        { question: "怎么自己做喷笔模板？", answer: "在本页选图，调阈值到形状干净，用黑白反转选正片或负片，填尺寸，打印后刻掉黑色部分，或导出 SVG 上机切割。" },
        { question: "喷笔模板要连接桥吗？", answer: "可重复用的胶片、Mylar 模板要，不然字母和封闭图形的中间会掉。背胶遮盖膜可以不要，碎片会粘在原位。" },
        { question: "免费吗？", answer: "制作和打印免费，不用注册。给切割机用的 SVG 每张 1.99 美元。" },
      ]}
    />
  );
}
