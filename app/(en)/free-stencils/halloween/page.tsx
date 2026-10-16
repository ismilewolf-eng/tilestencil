import type { Metadata } from "next";
import { HalloweenGalleryPage } from "@/components/GalleryPages";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Free Halloween Stencils – Printable Pumpkin, Bat, Skull & Witch Stencils",
  description: "Free printable Halloween stencils: pumpkin faces, bats, black cats, ghosts, skulls, spider webs, ravens, and witches. Bridges already added; download the PDF or resize any design.",
  keywords: ["halloween stencils", "free halloween stencils", "printable halloween stencils", "pumpkin face stencil", "skull stencil", "bat stencil", "spider web stencil"],
  alternates: { canonical: "/free-stencils/halloween", languages: languageAlternates("halloweenStencils") },
  openGraph: {
    locale: "en_US",
    title: "Free Halloween Stencils – Printable Pumpkin, Bat, Skull & Witch Stencils",
    description: "Free printable Halloween stencils: pumpkin faces, bats, black cats, ghosts, skulls, spider webs, ravens, and witches. Bridges already added; download the PDF or resize any design.",
    url: "/free-stencils/halloween",
  },
};

export default function EnglishHalloweenStencilsPage() {
  return <HalloweenGalleryPage locale="en" />;
}
