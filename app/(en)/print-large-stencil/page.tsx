import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Enlarge an Image as a Stencil Template",
  description:
    "Enlarge an image to a real wall or canvas size, choose a high-contrast black-and-white template, and print an assemble-ready multi-page PDF at home.",
  keywords: ["enlarge stencil template", "print large stencil", "wall mural template", "black and white template", "trace image at actual size"],
  alternates: {
    canonical: "/print-large-stencil",
    languages: languageAlternates("stencilGuide"),
  },
  openGraph: {
    locale: "en_US",
    title: "Enlarge an image as a stencil template",
    description: "Make a full-size black-and-white template with alignment marks for home printing.",
    url: "/print-large-stencil",
  },
};

const howToSteps = [
  {
    name: "Measure the target wall or board area",
    text: "Measure the exact width and height needed on your wall or canvas, and enter those physical dimensions in cm or inches.",
  },
  {
    name: "Select Black-and-White template mode",
    text: "Pick the B&W template export option to maximize outline contrast for tracing, carving, or stencil cutting.",
  },
  {
    name: "Print at 100% and assemble",
    text: "Print all pages at 100% Actual Size, arrange in order by grid coordinate (e.g. A1, A2), trim overlaps and tape seams.",
  },
];

const faqItems = [
  {
    question: "What is the benefit of the Black-and-White Template mode?",
    answer: "It creates high-contrast monochrome contours, saving printer ink while making cutting lines and transfer outlines crystal clear for tracing onto walls or wood.",
  },
  {
    question: "How do I ensure clean alignment on huge multi-sheet murals?",
    answer: "Set an overlap margin of around 5–10mm (0.2–0.4 in). Cut off only one overlapping margin along the guide mark and overlap sheets, which cushions any small manual cutting inaccuracies.",
  },
  {
    question: "What is the best way to tape assembled template sheets?",
    answer: "Use painter's masking tape to tack sheets temporarily on the front, then flip the assembly and use wide clear packing tape across the entire seam on the backside.",
  },
];

export default function EnglishPrintLargeStencilPage() {
  return (
    <>
      <HowToJsonLd
        name="How to Enlarge an Image as a Stencil Template"
        description="Scale designs to real wall dimensions and print high-contrast tiling stencil patterns on standard paper."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="stencilGuide"
      kicker="MURAL AND TRACING TEMPLATES"
      title="Enlarge an image to wall size, then assemble it from regular paper."
      lead="For a mural, canvas trace, cut-paper project, or large transfer, convert your image to a high-contrast black-and-white template and split it into pages at the finished size."
    >
      <section>
        <h2>Decide how large the template needs to be</h2>
        <p>
          Measure the usable width and height of the wall, canvas, or board, then enter those numbers directly. TileStencil calculates each page in millimetres, so you do not need to guess what a percentage increase will look like at the final size.
        </p>
        <ul>
          <li>Scale a sketch to a specific wall size in centimetres or inches.</li>
          <li>Split a design into large paper pieces for tracing or cutting.</li>
          <li>Make a proportional outline reference for an event display or craft project.</li>
        </ul>
      </section>

      <section>
        <h2>Choose black and white, then leave room to assemble</h2>
        <p>
          Select the black-and-white template mode for a high-contrast image that makes outlines, tracing, and cut lines easier to see. Keep a margin for your printer, then add a small overlap so neighbouring pages can still line up if a cut is slightly imperfect.
        </p>
        <p>
          A4 works with most home printers, while A3 reduces the number of seams. Landscape paper often suits wide artwork. In every case, the PDF labels each page’s place in the assembly grid.
        </p>
      </section>

      <section>
        <h2>Print one test page first</h2>
        <p>
          Print one sheet at <strong>Actual Size / 100%</strong> to confirm the paper size and printer margins. Then lay out all pages from left to right and top to bottom by page number. Trim only edges that cover adjacent artwork and join from the back, using the remaining overlap to correct the seam.
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
        <p>Just want to turn a photo or graphic into a wall poster?</p>
        <Link href="/print-image-on-multiple-pages">See the complete multi-page image-printing guide →</Link>
      </aside>

      <Link className="guide-cta" href="/">
        Open TileStencil and make a stencil template
      </Link>
    </GuideShell>
    </>
  );
}
