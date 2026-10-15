import type { Metadata } from "next";
import { TermsPage } from "@/components/PolicyPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using TileStencil, including free and paid exports, payments, and liability.",
  alternates: {
    canonical: "/terms",
    languages: languageAlternates("terms"),
  },
};

export default function Page() {
  return <TermsPage locale="en" />;
}
