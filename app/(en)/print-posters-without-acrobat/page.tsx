import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Print Multi-Page Posters Without Adobe Acrobat Pro | Free Tiling Tool",
  description:
    "Need to tile print large PDF posters across multiple A4, A3, or Letter pages without an expensive Adobe Acrobat Pro subscription? Use TileStencil to scale and split images into assemble-ready tiled PDFs with overlap marks for free.",
  keywords: [
    "print poster without acrobat",
    "tile print pdf free without adobe",
    "adobe acrobat poster print alternative",
    "how to print large image on multiple pages without software",
    "free multi page poster printer",
    "print blueprint on regular paper",
  ],
  alternates: {
    canonical: "/print-posters-without-acrobat",
    languages: languageAlternates("acrobatAlternative"),
  },
  openGraph: {
    title: "Print Multi-Page Posters Without Adobe Acrobat Pro | Free Tiling Tool",
    description: "Tile print large images and posters across standard home printer pages without Adobe Acrobat Pro.",
    url: "/print-posters-without-acrobat",
  },
};

const howToSteps = [
  {
    name: "Upload your image or schematic",
    text: "Select your JPG or PNG. TileStencil automatically detects aspect ratio in your browser without software installation.",
  },
  {
    name: "Input physical size and configure tile layout",
    text: "Enter your real-world dimensions (cm/in), choose your paper format (A4, A3, Letter), and adjust overlap for seam taping.",
  },
  {
    name: "Download PDF and print at 100% scale",
    text: "Open the generated multi-page PDF in any free browser or PDF reader, select 'Actual Size / 100%', and print.",
  },
];

const faqItems = [
  {
    question: "Do I need Adobe Acrobat Pro or Reader to print tiled posters?",
    answer: "No! Adobe Acrobat Pro requires an expensive monthly subscription, and Acrobat Reader's 'Poster' feature often crops arbitrarily without customizable overlap margins or previewing. TileStencil generates a standard multi-page PDF with built-in cut marks and overlaps that prints perfectly from ANY browser or printer without Adobe software.",
  },
  {
    question: "How do I make sure the pages print at exact size without Adobe?",
    answer: "In your default print dialog (Chrome, Edge, Safari, or Mac Preview), simply uncheck 'Fit to Page' and select 'Actual Size' or 'Scale: 100%'. TileStencil calculates all geometric tile strides in advance, so each page is already calibrated in millimeters.",
  },
  {
    question: "Can TileStencil tile print CAD drawings, patterns, and schematics?",
    answer: "Yes! TileStencil is widely used for woodworking schematics, sewing patterns, stained glass line art, and Cosplay EVA foam armor templates that require strict 1:1 millimeter physical accuracy.",
  },
];

export default function AcrobatAlternativeEnPage() {
  return (
    <>
      <HowToJsonLd
        name="How to Tile Print Multi-Page Posters Without Adobe Acrobat"
        description="A step-by-step free method to split and print large images across multiple sheets without paid Adobe Acrobat subscriptions."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="acrobatAlternative"
        kicker="FREE TILE PRINTING GUIDE"
        title="Print large posters on multiple pages without Adobe Acrobat."
        lead="Need to print a large poster, blueprint, or sewing pattern across multiple standard A4, A3, or Letter pages? Skip expensive Adobe Acrobat Pro subscriptions — TileStencil gives you precise multi-sheet tiling and overlap lines for free in your browser."
      >
        <section>
          <h2>Why pay for Acrobat Pro just to tile print a poster?</h2>
          <p>
            Many tutorials instruct users to buy Adobe Acrobat Pro or wrestle with complicated print driver settings just to split an image across 4 or 6 sheets of paper. TileStencil gives you a faster, visual, and completely free solution.
          </p>
          <ul>
            <li><strong>No Subscription Required:</strong> 100% free web app with zero paywalls.</li>
            <li><strong>Visual Interactive Preview:</strong> See your exact assembly grid and sheet count before printing.</li>
            <li><strong>Configurable Overlap:</strong> Add 5–10mm of overlap strip on all adjacent edges for error-free seam taping.</li>
            <li><strong>Universal Compatibility:</strong> Outputs standard PDF files compatible with all desktop printers and mobile devices.</li>
          </ul>
        </section>

        <section>
          <h2>Tile Printing in 3 Simple Steps</h2>
          <ol>
            <li><strong>Set Physical Dimensions:</strong> Enter the finished height and width you want (e.g. 60 × 90 cm).</li>
            <li><strong>Select Paper & Margins:</strong> Pick A4, A3, or US Letter, set your printer border allowance and overlap.</li>
            <li><strong>Print at 100% Actual Size:</strong> Open the PDF in your browser and print without page scaling.</li>
          </ol>
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
          <p>Looking for a replacement for The Rasterbator or Blockposters?</p>
          <Link href="/rasterbator-alternative">See the Rasterbator alternative comparison →</Link>
        </aside>

        <Link className="guide-cta" href="/">
          Open TileStencil and start printing
        </Link>
      </GuideShell>
    </>
  );
}

