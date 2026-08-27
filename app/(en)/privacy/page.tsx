import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Privacy",
  description: "TileStencil processes images and creates PDFs locally in your browser, without uploading image data or size settings.",
  alternates: {
    canonical: "/privacy",
    languages: languageAlternates("privacy"),
  },
  openGraph: {
    locale: "en_US",
    title: "TileStencil privacy",
    description: "Your images, settings, and generated PDFs stay in your browser.",
    url: "/privacy",
  },
};

export default function EnglishPrivacyPage() {
  return <PrivacyPage locale="en" />;
}
