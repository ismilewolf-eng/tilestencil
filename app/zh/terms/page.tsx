import type { Metadata } from "next";
import { TermsPage } from "@/components/PolicyPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "服务条款",
  description: "使用 TileStencil 的条款，包括免费与付费导出、付款和责任。",
  alternates: {
    canonical: "/zh/terms",
    languages: languageAlternates("terms"),
  },
};

export default function Page() {
  return <TermsPage locale="zh-CN" />;
}
