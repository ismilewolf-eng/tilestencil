import type { Metadata } from "next";
import { HalloweenGalleryPage } from "@/components/GalleryPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "免费万圣节模板 – 南瓜脸、蝙蝠、骷髅、女巫镂空模板下载",
  description: "免费可打印的万圣节镂空模板：南瓜脸、蝙蝠、黑猫、幽灵、骷髅、蜘蛛网、乌鸦、女巫。已加好连接桥，下载 PDF 或一键改尺寸。",
  alternates: { canonical: "/zh/free-stencils/halloween", languages: languageAlternates("halloweenStencils") },
  openGraph: {
    title: "免费万圣节模板 – 南瓜脸、蝙蝠、骷髅、女巫镂空模板下载",
    description: "免费可打印的万圣节镂空模板：南瓜脸、蝙蝠、黑猫、幽灵、骷髅、蜘蛛网、乌鸦、女巫。已加好连接桥，下载 PDF 或一键改尺寸。",
    url: "/zh/free-stencils/halloween",
  },
};

export default function ChineseHalloweenStencilsPage() {
  return <HalloweenGalleryPage locale="zh-CN" />;
}
