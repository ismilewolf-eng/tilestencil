import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Print an Image on Multiple Pages",
  description:
    "Print one JPG or PNG as an accurately sized poster across A4, A3, or US Letter pages, with page numbers, trim marks, and overlap guidance.",
  keywords: ["print image on multiple pages", "print poster on multiple pages", "tile image for printing", "print large image at home"],
  alternates: {
    canonical: "/print-image-on-multiple-pages",
    languages: languageAlternates("posterGuide"),
  },
  openGraph: {
    locale: "en_US",
    title: "Print an image on multiple pages",
    description: "Split one image into an accurately sized, assemble-ready PDF for a home printer.",
    url: "/print-image-on-multiple-pages",
  },
};

const howToSteps = [
  {
    name: "Select image and specify physical size",
    text: "Choose a local JPG or PNG and enter the desired final width and height in centimetres (cm) or inches (in).",
  },
  {
    name: "Set paper, margins, and overlap",
    text: "Choose your paper size (A4, A3, Letter) and orientation, set printer margins and a small overlap for seamless alignment.",
  },
  {
    name: "Export and assemble PDF",
    text: "Download the multi-page PDF, print at 100% Actual Size, trim edges by tile label, and tape from the back.",
  },
];

const faqItems = [
  {
    question: "Is TileStencil a good alternative to The Rasterbator or Blockposters?",
    answer: "Yes. Unlike The Rasterbator which converts images into stylized raster halftone dots, TileStencil preserves full pixel sharpness and exact physical dimensions without any dot rasterization. It also runs 100% locally in your browser with zero image uploads.",
  },
  {
    question: "Why is my assembled poster smaller than the specified dimensions?",
    answer: "This almost always happens when 'Fit to Page' or shrink-to-fit scaling is enabled in your printer dialog. Always select 'Actual Size / 100%' when printing.",
  },
  {
    question: "Can I use a regular printer without borderless printing capability?",
    answer: "Yes! TileStencil allows you to define printer margins (e.g. 5–8mm) and an overlap strip. Simply trim one edge along the alignment line and overlap pages seamlessly.",
  },
  {
    question: "Are my photos or images uploaded to any cloud server?",
    answer: "No. TileStencil runs 100% locally in your browser. All decoding, cropping, and PDF rendering take place in local memory without server transmission.",
  },
];

export default function EnglishPrintImageOnMultiplePagesPage() {
  return (
    <>
      <HowToJsonLd
        name="How to Print an Image on Multiple Pages"
        description="Step-by-step guide to tiling an image across multiple A4, A3, or Letter pages with home printers."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="posterGuide"
      kicker="TILED POSTER PRINTING"
      title="Print one image across multiple pages for a real poster."
      lead="When your home printer only handles standard paper, you can split a JPG or PNG across A4, A3, or US Letter pages, then assemble it into one full-size image."
    >
      <section>
        <h2>When is multi-page image printing useful?</h2>
        <p>
          Use it for a room poster, classroom display, event sign, or photo wall when you do not have a large-format printer. The important part is not simply cutting an image into pieces: set the finished width and height first, then print every page at the same scale.
        </p>
        <ul>
          <li>Turn one photo into a wall poster made from several A4 pages.</li>
          <li>Create large text or graphics for an event, class, or shop display.</li>
          <li>Test a final size at home before producing the finished piece.</li>
        </ul>
      </section>

      <section>
        <h2>Export an assemble-ready PDF in three steps</h2>
        <ol>
          <li>Choose a local JPG or PNG and enter the final width and height in centimetres or inches.</li>
          <li>Choose the paper size and orientation you have, then set your printer margin and a small overlap for easier alignment.</li>
          <li>Export the PDF. Each page includes a page number, grid position, and trim or assembly marks so you can cut and join it in order.</li>
        </ol>
      </section>

      <section>
        <h2>The print setting people miss</h2>
        <p>
          In the print dialog, choose <strong>Actual Size / 100%</strong>; do not choose Fit to Page or automatic scaling. Scaling quietly shrinks every sheet, so the assembled poster will be smaller than the final size you entered.
        </p>
        <p>
          If your printer cannot print edge to edge, leave a small margin and add a little overlap. Lay out all sheets and check their page numbers before cutting and joining to avoid reprinting pages.
        </p>
      </section>

      <section className="guide-faq">
        <h2>Frequently Asked Questions (FAQ)</h2>
        {faqItems.map((item) => (
          <div className="guide-faq-item" key={item.question}>
            <h3 className="guide-faq-question">{item.question}</h3>
            <p className="guide-faq-answer">{item.answer}</p>
          </div>
        ))}
      </section>

      <aside className="guide-callout">
        <p>Need a full-size reference for tracing, cutting, or a mural?</p>
        <Link href="/print-large-stencil">See how to enlarge an image as a stencil template →</Link>
      </aside>

      <Link className="guide-cta" href="/">
        Open TileStencil and start tiling
      </Link>
    </GuideShell>
    </>
  );
}
