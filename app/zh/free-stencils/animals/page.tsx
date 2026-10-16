import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { ANIMALS } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "免费动物模板 – 狗、猫、狼、马、恐龙镂空模板下载",
  description: "免费可打印的动物镂空模板：狗、猫、爪印、狼、熊、老鹰、猫头鹰、马、独角兽、龙、恐龙、鱼。已加好连接桥，下载 PDF 或一键改尺寸。",
  alternates: { canonical: "/zh/free-stencils/animals", languages: languageAlternates("animalStencils") },
  openGraph: {
    title: "免费动物模板 – 狗、猫、狼、马、恐龙镂空模板下载",
    description: "免费可打印的动物镂空模板：狗、猫、爪印、狼、熊、老鹰、猫头鹰、马、独角兽、龙、恐龙、鱼。已加好连接桥，下载 PDF 或一键改尺寸。",
    url: "/zh/free-stencils/animals",
  },
};

export default function ChineseAnimalStencilsPage() {
  return <CategoryGalleryPage locale="zh-CN" category={ANIMALS} />;
}
