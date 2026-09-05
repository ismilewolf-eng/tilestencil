import type { Metadata } from "next";
import { CloudflareWebAnalytics } from "@/components/CloudflareWebAnalytics";
import { DomainRedirect } from "@/components/DomainRedirect";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TileStencil｜图片分页打印与1:1真实尺寸大图拼接生成器",
    template: "%s | TileStencil",
  },
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "TileStencil｜图片分页打印与1:1真实尺寸大图拼接生成器",
    description: "在浏览器本地生成 A4、A3 或 US Letter 的可拼接多页 PDF，不上传图片。",
    siteName: "TileStencil",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "TileStencil - 图片分页打印与真实尺寸海报生成器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TileStencil｜图片分页打印与1:1真实尺寸大图拼接生成器",
    description: "在浏览器本地生成可拼接的多页打印 PDF。",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ChineseRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="help" type="text/markdown" href={`${SITE_URL}/llms.txt`} title="LLM Documentation" />
      </head>
      <body>
        <DomainRedirect />
        {children}
        <CloudflareWebAnalytics />
      </body>
    </html>
  );
}
