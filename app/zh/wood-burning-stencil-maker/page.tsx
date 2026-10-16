import type { Metadata } from "next";
import { StencilLanding } from "@/components/StencilLanding";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "烙画模板制作 – 用照片做烙画图样",
  description: "把照片做成烙画图样：实时预览得到清晰轮廓，按木板实际尺寸打印，附三种把图样转到木头上的方法。",
  alternates: { canonical: "/zh/wood-burning-stencil-maker", languages: languageAlternates("woodBurningStencil") },
  openGraph: { title: "烙画模板制作 – 用照片做烙画图样", description: "把照片做成烙画图样：实时预览得到清晰轮廓，按木板实际尺寸打印，附三种把图样转到木头上的方法。", url: "/zh/wood-burning-stencil-maker" },
};

export default function ChineseWoodBurningStencilPage() {
  return (
    <StencilLanding
      locale="zh-CN"
      intro={{ eyebrow: "烙画模板制作", heading: "把任意照片做成烙画图样，按木板大小打印。", copy: "实时预览得到清晰的高对比轮廓，按实际尺寸打印，用转印纸、热转印或针扎转到木头上。免费，照片不离开浏览器。" }}
      defaults={{ renderMode: "template", widthCm: 18, heightCm: 13 }}
      howToName={"烙画模板制作 – 用照片做烙画图样"}
      howToDescription={"把照片做成烙画图样：实时预览得到清晰轮廓，按木板实际尺寸打印，附三种把图样转到木头上的方法。"}
      howToSteps={[
        { name: "选照片", text: "宠物、人像、风景，明暗分明的最好。" },
        { name: "调轮廓", text: "阈值低是简单轮廓好描；阈值高保留阴影，用烙笔填色。" },
        { name: "量木板", text: "填要烙的区域宽度，四周留边。" },
        { name: "打印并转印", text: "按实际大小打印，用转印纸、激光热转印或针扎转到木头上，先烙轮廓。" },
      ]}
      sections={[
        { heading: "轮廓还是明暗？", items: ["阈值低：粗轮廓，适合用细头描烙。", "阈值高：保留深色块，用宽头做明暗。烙画不用刻穿，所以默认不加连接桥。"] },
        { heading: "三种转印方法", items: ["石墨转印纸：垫在打印稿下面用圆珠笔描，最简单干净。", "热转印：用激光打印机打印镜像版（打印设置里开“镜像/翻转”），正面朝下贴木头，用转印头或熨斗压。喷墨打印转不了。", "针扎加铅笔：贴好打印稿沿线扎孔，再用铅笔连点，适合弧面或粗糙表面。"] },
        { heading: "烙得干净的要点", items: ["转印前把木板砂到 220 目。", "椴木、桦木、枫木这类浅色细纹木头最显细节。", "先低温烙轮廓，再回头做明暗。"] },
      ]}
      faqItems={[
        { question: "怎么把照片做成烙画图样？", answer: "在本页选照片，调阈值到轮廓满意，填木板尺寸，按实际大小打印 PDF，再转印到木头上。" },
        { question: "要镜像吗？", answer: "只有热转印需要，因为碳粉是正面朝下压到木头上的。转印纸和针扎法用正向图样。" },
        { question: "免费吗？", answer: "免费，不用注册，照片只在浏览器里处理。" },
      ]}
    />
  );
}
