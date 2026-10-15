import type { Metadata } from "next";
import { RefundPage } from "@/components/PolicyPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "14-day money-back guarantee on paid TileStencil exports.",
  alternates: {
    canonical: "/refund-policy",
    languages: languageAlternates("refundPolicy"),
  },
};

export default function Page() {
  return <RefundPage locale="en" />;
}
