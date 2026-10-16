import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { FLOWERS } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "免费花朵模板 – 玫瑰、蝴蝶、雏菊、叶子镂空模板下载",
  description: "免费可打印的花朵镂空模板：雏菊、向日葵、郁金香、莲花、玫瑰、蝴蝶、枫叶、蕨叶。已加好连接桥，下载 PDF 或一键改尺寸。",
  alternates: { canonical: "/zh/free-stencils/flowers", languages: languageAlternates("flowerStencils") },
  openGraph: {
    title: "免费花朵模板 – 玫瑰、蝴蝶、雏菊、叶子镂空模板下载",
    description: "免费可打印的花朵镂空模板：雏菊、向日葵、郁金香、莲花、玫瑰、蝴蝶、枫叶、蕨叶。已加好连接桥，下载 PDF 或一键改尺寸。",
    url: "/zh/free-stencils/flowers",
  },
};

export default function ChineseFlowerStencilsPage() {
  return <CategoryGalleryPage locale="zh-CN" category={FLOWERS} />;
}
