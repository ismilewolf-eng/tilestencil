import type { Metadata } from "next";
import { CategoryGalleryPage } from "@/components/GalleryPages";
import { CHRISTMAS } from "@/lib/gallery";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Free Christmas Stencils – Printable Snowflake, Star, Tree & Reindeer Stencils",
  description: "Free printable Christmas stencils: snowflakes, stars, Christmas trees, ornaments, reindeer, snowman, gingerbread man, and more. Bridges already added; download the PDF or resize any design.",
  keywords: ["christmas stencils", "free christmas stencils", "printable christmas stencils", "snowflake stencil", "star stencil", "christmas tree stencil", "reindeer stencil"],
  alternates: { canonical: "/free-stencils/christmas", languages: languageAlternates("christmasStencils") },
  openGraph: {
    locale: "en_US",
    title: "Free Christmas Stencils – Printable Snowflake, Star, Tree & Reindeer Stencils",
    description: "Free printable Christmas stencils: snowflakes, stars, Christmas trees, ornaments, reindeer, snowman, gingerbread man, and more. Bridges already added; download the PDF or resize any design.",
    url: "/free-stencils/christmas",
  },
};

export default function EnglishChristmasStencilsPage() {
  return <CategoryGalleryPage locale="en" category={CHRISTMAS} />;
}
