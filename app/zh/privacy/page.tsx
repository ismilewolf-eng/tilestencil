import type { Metadata } from "next";
import { PrivacyPage as PrivacyContent } from "@/components/PrivacyPage";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "隐私",
  description: "TileStencil 在浏览器本地处理图片和生成 PDF，不上传图片、文件名或尺寸设置。",
  alternates: {
    canonical: "/zh/privacy",
    languages: languageAlternates("privacy"),
  },
  openGraph: {
    locale: "zh_CN",
    title: "TileStencil 隐私说明",
    description: "图片、尺寸设置和生成的 PDF 都留在你的浏览器中。",
    url: "/zh/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent locale="zh-CN" />;
}
