import type { Metadata } from "next";
import { StencilLanding } from "@/components/StencilLanding";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "喷漆模板制作 – 用任意照片做喷漆镂空模板",
  description: "把照片或标志做成带自动连接桥的喷漆模板，按真实尺寸分页打印，或导出 SVG 用 Mylar 膜切割。含双层模板和喷涂技巧。",
  alternates: { canonical: "/zh/spray-paint-stencil-maker", languages: languageAlternates("sprayPaintStencil") },
  openGraph: { title: "喷漆模板制作 – 用任意照片做喷漆镂空模板", description: "把照片或标志做成带自动连接桥的喷漆模板，按真实尺寸分页打印，或导出 SVG 用 Mylar 膜切割。含双层模板和喷涂技巧。", url: "/zh/spray-paint-stencil-maker" },
};

export default function ChineseSprayPaintStencilPage() {
  return (
    <StencilLanding
      locale="zh-CN"
      intro={{ eyebrow: "喷漆模板制作", heading: "用任意照片或标志，做一张喷漆模板。", copy: "实时预览调整模板，自动连接桥固定孤岛，按真实尺寸分页打印，或导出 SVG 用 Mylar 膜切割。" }}
      defaults={{ renderMode: "template", bridges: true, bridgeMm: 3, widthCm: 40, heightCm: 30 }}
      howToName={"喷漆模板制作 – 用任意照片做喷漆镂空模板"}
      howToDescription={"把照片或标志做成带自动连接桥的喷漆模板，按真实尺寸分页打印，或导出 SVG 用 Mylar 膜切割。含双层模板和喷涂技巧。"}
      howToSteps={[
        { name: "选高对比的图", text: "标志、剪影、侧光人像最好，先裁到只剩主体。" },
        { name: "调阈值和连接桥", text: "调到形状清楚；连接桥至少 3 毫米，反复喷涂也不容易断。" },
        { name: "设尺寸", text: "填成品宽度，超过一张纸会自动分页。" },
        { name: "切割、固定、喷涂", text: "用卡纸或 Mylar 膜刻掉黑色部分，喷胶固定，薄喷几层。" },
      ]}
      sections={[
        { heading: "选材料", items: ["打印纸、卡纸：一次性用，先在正面喷一层透明漆防渗。", "海报板、文件夹：便宜，能用几次。", "Mylar 膜（7–10 mil）：可重复用上百次，可手刻，也可导出 SVG 上刻字机或激光机。", "背胶模板贴纸：边缘最利落，但只能用一次。"] },
        { heading: "用两个阈值做双层模板", items: ["先用低阈值导出一次：这一层只有最深的阴影。", "再用高阈值导出一次：这一层加上中间调。", "先透过中间调那层喷浅色，干后对齐阴影层喷深色。同一张图、同一尺寸，两层自然对得齐。"] },
        { heading: "喷涂技巧", items: ["模板背面用可重贴喷胶，防止颜料渗到下面。", "距离 15–25 厘米，薄喷两三层，别一次喷厚。", "垂直喷，尤其是连接桥附近。", "最后一层还微黏时揭下模板。"] },
      ]}
      faqItems={[
        { question: "怎么用照片做喷漆模板？", answer: "在本页选照片，调阈值到黑白预览形状清楚，保持自动连接桥打开，填尺寸。按实际大小打印 PDF 后刻掉黑色部分，或导出 SVG 上机切割。" },
        { question: "喷漆模板的连接桥多宽合适？", answer: "纸和海报板约 3 毫米，要反复用的 Mylar 膜 3–4 毫米。太细好看但容易撕断。" },
        { question: "免费吗？", answer: "制作模板和打印分页 PDF 免费，不用注册。给切割机用的 SVG 每张 1.99 美元。" },
      ]}
    />
  );
}
