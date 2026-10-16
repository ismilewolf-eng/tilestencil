import type { Metadata } from "next";
import { FreeStencilsHubPage } from "@/components/GalleryPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "免费可打印镂空模板 – 下载 PDF 或改成任意尺寸",
  description: "免费镂空模板，已加好连接桥。下载 PDF 直接打印，或放进模板工具按需要的尺寸分页打印。",
  alternates: { canonical: "/zh/free-stencils", languages: languageAlternates("freeStencils") },
  openGraph: {
    title: "免费可打印镂空模板 – 下载 PDF 或改成任意尺寸",
    description: "免费镂空模板，已加好连接桥。下载 PDF 直接打印，或放进模板工具按需要的尺寸分页打印。",
    url: "/zh/free-stencils",
  },
};

export default function ChineseFreeStencilsPage() {
  return <FreeStencilsHubPage locale="zh-CN" />;
}
