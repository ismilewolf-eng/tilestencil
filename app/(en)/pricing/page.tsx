import type { Metadata } from "next";
import { PricingPage } from "@/components/PolicyPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Pricing",
  description: "TileStencil is free to use. Cut-ready SVG export is free during launch.",
  alternates: {
    canonical: "/pricing",
    languages: languageAlternates("pricing"),
  },
};

export default function Page() {
  return <PricingPage locale="en" />;
}
