import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { SHAPES } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "免费爱心、月亮、曼陀罗和花砖图案模板下载",
  description: "免费可打印的爱心、月亮、太阳、曼陀罗、摩洛哥花砖、蜂窝、皇冠、船锚镂空模板。已加好连接桥，下载 PDF 或按墙面、地板尺寸打印。",
  alternates: { canonical: "/zh/free-stencils/shapes", languages: languageAlternates("shapeStencils") },
  openGraph: {
    title: "免费爱心、月亮、曼陀罗和花砖图案模板下载",
    description: "免费可打印的爱心、月亮、太阳、曼陀罗、摩洛哥花砖、蜂窝、皇冠、船锚镂空模板。已加好连接桥，下载 PDF 或按墙面、地板尺寸打印。",
    url: "/zh/free-stencils/shapes",
  },
};

export default function ChineseShapeStencilsPage() {
  return <CategoryGalleryPage locale="zh-CN" category={SHAPES} />;
}
