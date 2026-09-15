import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Print A0 Sewing Patterns on A4 & Letter at 100% Actual Size",
  description:
    "How to print large A0 sewing, cosplay, and craft patterns on a home A4 or US Letter printer at 100% actual scale. Includes 10x10cm / 2x2in calibration test square, overlap guidelines, and multi-page PDF tiling.",
  keywords: [
    "print a0 pattern on a4",
    "print sewing pattern actual size at home",
    "a0 to a4 pdf converter free",
    "how to print a0 sewing pattern on home printer",
    "etsy sewing pattern a0 printing without acrobat",
    "tile print a0 blueprint to letter sheets",
    "scale sewing pattern 100 percent",
  ],
  alternates: {
    canonical: "/print-a0-to-a4-actual-size",
    languages: languageAlternates("a0SewingGuide"),
  },
  openGraph: {
    title: "Print A0 Sewing Patterns on A4 & Letter at 100% Actual Size",
    description: "Tile print large A0 digital sewing patterns on your home printer at 1:1 scale with alignment marks and test square calibration.",
    url: "/print-a0-to-a4-actual-size",
  },
};

const howToSteps = [
  {
    name: "Import your A0 pattern image",
    text: "Convert your digital sewing pattern or blueprint page into a high-resolution PNG or JPG and open it in TileStencil.",
  },
  {
    name: "Set standard A0 physical dimensions",
    text: "Enter 84.1 cm width and 118.9 cm height (or your pattern's specific physical dimensions). Aspect ratio is locked automatically.",
  },
  {
    name: "Configure paper and 10mm overlap",
    text: "Select A4 or US Letter paper with 10mm overlap borders to give you ample room for taping and glueing tiles together.",
  },
  {
    name: "Verify test square and print",
    text: "Export the multi-page PDF. Print sheet 1 first, measure the 10x10cm or 2x2in calibration test square with a physical ruler, confirm 100% scale, and print remaining sheets.",
  },
];

const faqItems = [
  {
    question: "Why do digital sewing patterns come in A0 format, and how do I print them at home?",
    answer:
      "Independent pattern designers on Etsy and sewing platforms export in A0 format (841 x 1189 mm) for commercial plotters. Home printers only support A4 or US Letter. TileStencil splits the massive A0 sheet into a grid of A4/Letter pages with exact 1:1 millimeter physical scaling, alignment crosshairs, and row/column coordinates so you can assemble the full-size garment pattern at home.",
  },
  {
    question: "How do I ensure the printed pattern pieces are 100% actual size without distortion?",
    answer:
      "Most sewing patterns feature a 10cm x 10cm (or 2in x 2in) test square. When printing your TileStencil PDF, ALWAYS select 'Actual Size' or '100% Scale' in your printer settings. Never choose 'Fit to Page' or 'Shrink to Printable Area'. Measure the test square with a ruler before cutting fabric.",
  },
  {
    question: "How should I tape the tiled pattern sheets together?",
    answer:
      "TileStencil includes customizable overlap strips (e.g. 5mm to 10mm) and registration marks. Simply trim the right and bottom margins along the dashed lines, align the coordinate crosshairs (A1 to A2, B1 to B2), and secure with clear tape.",
  },
];

export default function A0SewingGuideEnPage() {
  return (
    <>
      <HowToJsonLd
        name="How to Tile Print A0 Sewing Patterns on A4 Printer Paper"
        description="Complete workflow for printing large format A0 sewing, quilting, and cosplay patterns on standard home printer sheets at 100% scale."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="a0SewingGuide"
        kicker="SEWING &amp; PATTERN TILING"
        title="Print large A0 sewing and cosplay patterns on your home printer."
        lead="Bought an A0 digital sewing pattern on Etsy or from an independent designer? Save $15 on copy shop plotting fees by tiling your pattern across standard A4 or US Letter paper with guaranteed 100% actual physical accuracy."
      >
        <section>
          <h2>Why Home Tiling Saves Time and Money for Sewists</h2>
          <p>
            Commercial wide-format plotting often costs $10 to $20 per pattern sheet plus shipping delays. Tiling directly on home A4 or Letter sheets lets you begin cutting fabric in 10 minutes:
          </p>
          <ul>
            <li><strong>Exact 1:1 Millimeter Scale:</strong> Preserves sleeve curves, armholes, and dart placements without distorting garment sizing.</li>
            <li><strong>100% Free &amp; Offline:</strong> No Acrobat Pro subscription required. Everything runs inside your web browser.</li>
            <li><strong>Foolproof Assembly Grid:</strong> Numbered coordinates (A1, A2, B1, B2) and corner trim marks eliminate assembly confusion.</li>
            <li><strong>High-Contrast B&amp;W Mode:</strong> Turn colored pattern layers into crisp monochrome lines to save valuable printer ink.</li>
          </ul>
        </section>

        <section>
          <h2>Crucial Printing Checklist for Garment Patterns</h2>
          <p>
            Follow these golden rules before cutting expensive fabrics:
          </p>
          <ul>
            <li><strong>Printer Setting:</strong> Verify 'Actual Size' / 100% scale is selected in your print dialog.</li>
            <li><strong>Ruler Check:</strong> Measure the 10cm x 10cm (or 2in x 2in) calibration box on sheet 1.</li>
            <li><strong>Trimming Strategy:</strong> Trim only the right and bottom borders of each tile, using the overlapping edge as a glue/tape tab.</li>
          </ul>
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
          <p>Working on leathercraft or heavy woodworking templates?</p>
          <Link href="/print-pattern-actual-size">Check the 1:1 craft pattern printing tutorial &rarr;</Link>
        </aside>

        <Link className="guide-cta" href="/">
          Open TileStencil and tile your pattern
        </Link>
      </GuideShell>
    </>
  );
}

