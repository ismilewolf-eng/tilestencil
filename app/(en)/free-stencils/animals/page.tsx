import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { ANIMALS } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Free Animal Stencils – Printable Dog, Cat, Wolf, Horse & Dinosaur Stencils",
  description: "Free printable animal stencils: dogs, cats, paw prints, wolves, bears, eagles, owls, horses, unicorns, dragons, dinosaurs, and fish. Bridges already added; download the PDF or resize any design.",
  keywords: ["animal stencils", "free animal stencils", "printable animal stencils", "dog stencil", "wolf stencil", "horse stencil", "dinosaur stencil", "dragon stencil"],
  alternates: { canonical: "/free-stencils/animals", languages: languageAlternates("animalStencils") },
  openGraph: {
    locale: "en_US",
    title: "Free Animal Stencils – Printable Dog, Cat, Wolf, Horse & Dinosaur Stencils",
    description: "Free printable animal stencils: dogs, cats, paw prints, wolves, bears, eagles, owls, horses, unicorns, dragons, dinosaurs, and fish. Bridges already added; download the PDF or resize any design.",
    url: "/free-stencils/animals",
  },
};

export default function EnglishAnimalStencilsPage() {
  return <CategoryGalleryPage locale="en" category={ANIMALS} />;
}
