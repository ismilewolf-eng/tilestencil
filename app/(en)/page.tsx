import type { Metadata } from "next";
import { WebApplicationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Free Multi-Page Poster Printer (A4, A3, Letter) - 100% Actual Size",
  description:
    "Free online tool to split and print large images across multiple A4, A3, or Letter pages at 100% actual size. Accurate scaling, overlap alignment lines, and multi-page PDF export. 100% private in-browser.",
  keywords: [
    "print image on multiple pages",
    "tile print pdf",
    "free poster printer online",
    "rasterbator alternative",
    "print large photo on a4 sheets",
    "print pattern actual size 100%",
    "multi page stencil maker",
  ],
  alternates: {
    canonical: "/",
    languages: languageAlternates("home"),
  },
  openGraph: {
    locale: "en_US",
    title: "TileStencil | Free Multi-Page Poster & Stencil Printer",
    description: "Create an accurately sized, tile-ready PDF for A4, A3, or US Letter in your browser without uploading photos.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "TileStencil | Free Multi-Page Poster & Stencil Printer",
    description: "Split and print any image across multiple sheets of paper at true 1:1 scale.",
  },
};

export default function EnglishHomePage() {
  return (
    <>
      <WebSiteJsonLd locale="en" />
      <WebApplicationJsonLd locale="en" />
      <TileStencilApp locale="en" />
    </>
  );
}
