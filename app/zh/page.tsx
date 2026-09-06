import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, OrganizationJsonLd, WebApplicationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
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
      <OrganizationJsonLd />
      <WebSiteJsonLd locale="zh-CN" />
      <WebApplicationJsonLd locale="zh-CN" />
      <HowToJsonLd
        name="如何将大图以 100% 实际大小分页打印拼版"
        description="分步指南：在普通家用或办公室打印机上，使用 A4 或 A3 纸张将大图切片打印并完美拼接成大幅海报或纸样。"
        steps={[
          {
            name: "上传高清图片",
            text: "在浏览器中选择需要打印的 JPG 或 PNG 图片。纯本地离线处理，绝不上传服务器。",
          },
          {
            name: "设定最终物理尺寸",
            text: "输入期望的成品宽度或高度（厘米 cm 或英寸 in），系统会自动按比例保持画面不畸变。",
          },
          {
            name: "配置纸张与拼接重叠",
            text: "选择 A4、A3 或 Letter 纸张，设定四周打印边距与 5-10mm 重叠对齐辅助线，方便后续用胶带拼接。",
          },
          {
            name: "导出多页 PDF 并按实际大小打印",
            text: "一键生成并下载多页 PDF。在电脑打印设置中务必选择 实际大小 或 100% 比例，切勿勾选 适合页面。",
          },
        ]}
      />
      <FaqJsonLd
        items={[
          {
            question: "普通打印机怎么把一张大图分页打印在多张 A4 纸上？",
            answer:
              "将图片上传至 TileStencil，输入期望的整体成品厘米尺寸，选择 A4 纸张，工具会自动计算需要的行数和列数并生成带页码和重叠对齐十字线的多页 PDF。下载后用任何 PDF 软件直接打印即可。",
          },
          {
            question: "TileStencil 收费吗？我的图片安全吗？",
            answer:
              "TileStencil 完全免费且基于开源技术构建。所有图片缩放、切片、PDF 编译全部在你的本地浏览器端（HTML5 Canvas + jsPDF）完成，零字节图片数据上传到云端，保护隐私安全。",
          },
          {
            question: "为什么打印出来的拼版尺寸和设定的真实尺寸不一致？",
            answer:
              "最常见的原因是在打印对话框中勾选了 适合可打印区域 或 缩小过大页面。请务必在打印选项中勾选 实际大小 (Actual Size) 或将缩放比例设为 100%。",
          },
        ]}
      />
      <TileStencilApp locale="zh-CN" />
    </>
  );
}
