import type { Metadata } from "next";
import { PricingPage } from "@/components/PolicyPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "价格说明",
  description: "TileStencil 免费使用，可切割 SVG 导出在推广期免费。",
  alternates: {
    canonical: "/zh/pricing",
    languages: languageAlternates("pricing"),
  },
};

export default function Page() {
  return <PricingPage locale="zh-CN" />;
}
