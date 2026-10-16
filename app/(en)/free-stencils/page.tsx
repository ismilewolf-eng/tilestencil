import type { Metadata } from "next";
import { FreeStencilsHubPage } from "@/components/GalleryPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Free Printable Stencils – Download PDF or Resize to Any Size",
  description: "Free printable stencils with bridges already in place. Download the PDF, or open any design in the stencil maker to print it at the exact size you need.",
  keywords: ["free printable stencils", "free stencils", "printable stencils", "stencil templates"],
  alternates: { canonical: "/free-stencils", languages: languageAlternates("freeStencils") },
  openGraph: {
    locale: "en_US",
    title: "Free Printable Stencils – Download PDF or Resize to Any Size",
    description: "Free printable stencils with bridges already in place. Download the PDF, or open any design in the stencil maker to print it at the exact size you need.",
    url: "/free-stencils",
  },
};

export default function EnglishFreeStencilsPage() {
  return <FreeStencilsHubPage locale="en" />;
}
