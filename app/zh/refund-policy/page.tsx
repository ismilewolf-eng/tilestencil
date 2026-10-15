import type { Metadata } from "next";
import { RefundPage } from "@/components/PolicyPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "退款政策",
  description: "TileStencil 付费导出 14 天退款保证。",
  alternates: {
    canonical: "/zh/refund-policy",
    languages: languageAlternates("refundPolicy"),
  },
};

export default function Page() {
  return <RefundPage locale="zh-CN" />;
}
