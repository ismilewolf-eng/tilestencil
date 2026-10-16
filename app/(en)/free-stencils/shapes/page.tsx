import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { SHAPES } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Free Heart, Moon, Mandala & Tile Pattern Stencils – Printable PDF",
  description: "Free printable heart, moon, sun, mandala, Moroccan tile, honeycomb, crown, and anchor stencils. Bridges already added; download the PDF or resize any design to your wall, floor, or card.",
  keywords: ["heart stencil", "heart stencils printable", "mandala stencil", "moon stencil", "sun stencil", "floor stencil", "tile stencil", "honeycomb stencil", "crown stencil"],
  alternates: { canonical: "/free-stencils/shapes", languages: languageAlternates("shapeStencils") },
  openGraph: {
    locale: "en_US",
    title: "Free Heart, Moon, Mandala & Tile Pattern Stencils – Printable PDF",
    description: "Free printable heart, moon, sun, mandala, Moroccan tile, honeycomb, crown, and anchor stencils. Bridges already added; download the PDF or resize any design to your wall, floor, or card.",
    url: "/free-stencils/shapes",
  },
};

export default function EnglishShapeStencilsPage() {
  return <CategoryGalleryPage locale="en" category={SHAPES} />;
}
