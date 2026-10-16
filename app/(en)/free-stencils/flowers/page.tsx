import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { FLOWERS } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Free Flower Stencils – Printable Rose, Butterfly, Daisy & Leaf Stencils",
  description: "Free printable flower stencils: daisies, sunflowers, tulips, lotus, roses, butterflies, maple leaves, and ferns. Bridges already added; download the PDF or resize any design.",
  keywords: ["flower stencils", "free flower stencils", "printable flower stencils", "butterfly stencil", "rose stencil", "leaf stencil", "sunflower stencil"],
  alternates: { canonical: "/free-stencils/flowers", languages: languageAlternates("flowerStencils") },
  openGraph: {
    locale: "en_US",
    title: "Free Flower Stencils – Printable Rose, Butterfly, Daisy & Leaf Stencils",
    description: "Free printable flower stencils: daisies, sunflowers, tulips, lotus, roses, butterflies, maple leaves, and ferns. Bridges already added; download the PDF or resize any design.",
    url: "/free-stencils/flowers",
  },
};

export default function EnglishFlowerStencilsPage() {
  return <CategoryGalleryPage locale="en" category={FLOWERS} />;
}
