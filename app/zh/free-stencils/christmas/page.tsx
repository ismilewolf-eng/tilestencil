import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { CHRISTMAS } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "免费圣诞模板 – 雪花、星星、圣诞树、驯鹿镂空模板下载",
  description: "免费可打印的圣诞镂空模板：雪花、星星、圣诞树、彩球、驯鹿、雪人、姜饼人等。已加好连接桥，下载 PDF 或一键改尺寸。",
  alternates: { canonical: "/zh/free-stencils/christmas", languages: languageAlternates("christmasStencils") },
  openGraph: {
    title: "免费圣诞模板 – 雪花、星星、圣诞树、驯鹿镂空模板下载",
    description: "免费可打印的圣诞镂空模板：雪花、星星、圣诞树、彩球、驯鹿、雪人、姜饼人等。已加好连接桥，下载 PDF 或一键改尺寸。",
    url: "/zh/free-stencils/christmas",
  },
};

export default function ChineseChristmasStencilsPage() {
  return <CategoryGalleryPage locale="zh-CN" category={CHRISTMAS} />;
}
