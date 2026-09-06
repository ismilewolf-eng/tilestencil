import type { Metadata } from "next";
import { FaqJsonLd, HowToJsonLd, OrganizationJsonLd, WebApplicationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
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
      <OrganizationJsonLd />
      <WebSiteJsonLd locale="en" />
      <WebApplicationJsonLd locale="en" />
      <HowToJsonLd
        name="How to Tile Print Large Images Across Multiple Pages at 100% Actual Size"
        description="Step-by-step instructions to split any large photo, blueprint, or craft pattern across standard A4, A3, or US Letter sheets with alignment markers and overlap."
        steps={[
          {
            name: "Upload Image",
            text: "Select a high-resolution JPG or PNG file in your browser. All processing is 100% client-side and never uploaded to a server.",
          },
          {
            name: "Set Target Physical Dimensions",
            text: "Enter your desired final output width or height in centimeters (cm) or inches (in). The tool preserves aspect ratio automatically.",
          },
          {
            name: "Choose Paper Size and Overlap",
            text: "Select A4, A3, or US Letter paper, adjust printable margins, and set overlap alignment borders (typically 5mm to 10mm) for seamless taping.",
          },
          {
            name: "Export Multi-Page PDF and Print",
            text: "Generate and download the multi-page PDF. When printing from your PDF viewer, choose Actual Size or 100% Scale without page scaling.",
          },
        ]}
      />
      <FaqJsonLd
        items={[
          {
            question: "How do I print a picture across multiple pages on standard printer paper?",
            answer:
              "Upload your image to TileStencil, specify your target total physical width or height (e.g. 100cm), select your paper size (A4, A3, or US Letter), and download the generated PDF. Print the PDF with Actual Size or 100% scaling, then trim along the alignment guidelines to tape the sheets together.",
          },
          {
            question: "Is TileStencil free and private?",
            answer:
              "Yes, TileStencil is 100% free and open-source under the MIT license. All image scaling, slicing, and PDF compiling happen entirely inside your local browser using HTML5 Canvas and jsPDF. Zero bytes of your photos or documents are ever uploaded to any cloud server.",
          },
          {
            question: "How is TileStencil different from The Rasterbator?",
            answer:
              "Unlike The Rasterbator which converts images into halftone dot patterns or pixelated grids, TileStencil retains crisp, full-resolution continuous-tone imagery and provides exact physical millimeter calibration with customizable overlap margins for woodworking, sewing, and poster prints.",
          },
          {
            question: "Why do my printed pages not match the real-world scale?",
            answer:
              "The most common cause is the printer dialog setting Fit to Printable Area or Shrink Oversized Pages. Always select Actual Size or 100% scale in Adobe Acrobat, Chrome, or your printer print preview.",
          },
        ]}
      />
      <TileStencilApp locale="en" />
    </>
  );
}
