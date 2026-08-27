import type { Metadata } from "next";
import { WebApplicationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "图片分页打印与1:1真实尺寸大图拼接生成器",
  description:
    "免费在线将 JPG 或 PNG 按 1:1 物理真实尺寸（cm/in）分页拆分并导出为 A4、A3 或 Letter 多页拼接 PDF。自带裁切辅助线与重叠区域，纯浏览器本地离线处理，不上传图片。",
  keywords: [
    "图片分页打印",
    "A4拼接海报",
    "大图分割打印",
    "1比1纸样打印",
    "墙绘模板放大",
    "多页PDF海报制作",
    "真实尺寸打印",
    "Rasterbator替代工具",
  ],
  alternates: {
    canonical: "/zh",
    languages: languageAlternates("home"),
  },
  openGraph: {
    locale: "zh_CN",
    title: "TileStencil｜图片分页打印与1:1真实尺寸大图拼接生成器",
    description: "在浏览器本地生成 A4、A3 或 US Letter 的可拼接多页 PDF。",
    url: "/zh",
  },
};

export default function HomePage() {
  return (
    <>
      <WebSiteJsonLd locale="zh-CN" />
      <WebApplicationJsonLd locale="zh-CN" />
      <TileStencilApp locale="zh-CN" />
    </>
  );
}
