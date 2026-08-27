import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Print Stained Glass Patterns at 100% Actual Size | Tiling Tool - TileStencil",
  description: "Free browser-based tool to print stained glass and mosaic patterns at true physical size (cm/in). Auto-generates overlap zones and cross-hair alignment marks for multi-page tiling. Runs 100% offline in your browser — no uploads, guaranteed exact fit for came and foil framing.",
  keywords: ["print stained glass pattern actual size","stained glass cartoon printing","mosaic pattern tiling print","1:1 pattern print tool","cross hair alignment marks","came foil pattern print","actual size printing tool","scale to fit disable printing"],
  alternates: {
    canonical: "/print-stained-glass-patterns",
    languages: languageAlternates("stainedGlassGuide"),
  },
  openGraph: {
    title: "Print Stained Glass Patterns at 100% Actual Size | Tiling Tool - TileStencil",
    description: "Free browser-based tool to print stained glass and mosaic patterns at true physical size (cm/in). Auto-generates overlap zones and cross-hair alignment marks for multi-page tiling. Runs 100% offline in your browser — no uploads, guaranteed exact fit for came and foil framing.",
    url: "/print-stained-glass-patterns",
  },
};

const howToSteps = [
  {
    "name": "Upload Your Stained Glass Cartoon",
    "text": "Drag your pattern image (JPG/PNG) directly into the browser. Nothing is uploaded to a server — everything is processed locally, keeping your original design private."
  },
  {
    "name": "Set the True Physical Dimensions",
    "text": "Enter the finished panel's real width and height (cm or in), pick A4/Letter paper, and TileStencil auto-calculates the page count and lays out overlap zones with cross-hair registration marks."
  },
  {
    "name": "Print, Assemble, and Cut",
    "text": "Turn off \"fit to page\" in your printer settings and select 100%/Actual Size. Trim along the cross-hair marks and tape the pages together into one full-size pattern, ready for glass cutting or light-table tracing."
  }
];

const faqItems = [
  {
    "question": "How do I know the printout is really at 100% actual size?",
    "answer": "TileStencil prints a calibration ruler with centimeter/inch markings on every page. After printing, measure that ruler with a physical ruler — if the length matches exactly, no scaling was applied and the pattern is true physical size. If it's off, check your print dialog: make sure \"Fit to page\" or \"Scale to printable area\" is unchecked, and select \"Actual Size / 100% / No Scaling\" instead."
  },
  {
    "question": "The pages don't line up after tiling — what am I doing wrong?",
    "answer": "TileStencil automatically adds a fixed-width overlap margin (adjustable in settings) and prints cross-hair marks on each page. Trim off the excess white border at the outer cross-hairs, keep the overlap area, and use the cross-hairs inside that overlap as your alignment reference when taping pages together — rather than butting the raw paper edges together. This absorbs the small margin of error from printing and cutting."
  },
  {
    "question": "Do I need to convert my pattern to black and white first? Does it work with photos?",
    "answer": "No manual conversion needed — TileStencil includes a built-in high-contrast black-and-white converter that automatically detects line work and strips out background color, gradients, and shadows, even from a hand-drawn photo or scan. If your original lines are thin or low-contrast, raise the contrast threshold in settings to avoid losing fine detail at corners and tight curves."
  }
];

export default function StainedGlassEnPage() {
  return (
    <>
      <HowToJsonLd
        name="How to Print Stained Glass Patterns at 100% Actual Size"
        description="Free browser-based tool to print stained glass and mosaic patterns at true physical size (cm/in). Auto-generates overlap zones and cross-hair alignment marks for multi-page tiling. Runs 100% offline in your browser — no uploads, guaranteed exact fit for came and foil framing."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="stainedGlassGuide"
        kicker="Stained Glass Craft · True-to-Scale Printing"
        title="Print Stained Glass & Mosaic Panel Patterns at 100% Actual Size"
        lead="The one thing that ruins a stained glass project is a scaled printout. A 1% deviation means your cut glass won't fit the came or foil frame. TileStencil runs locally in your browser, tiling your pattern (cartoon) across multiple pages at true centimeter/inch dimensions — complete with overlap zones and cross-hair registration marks — so any home A4/Letter printer can output precise, oversized patterns. No image ever leaves your device."
      >
        <section>
          <h2>Why a Normal Printout Ruins the Glass</h2>
          <p>Home printers default to "fit to page" scaling — the pattern still looks complete, but the real dimensions have quietly shifted. Glass is unforgiving: cut it a millimeter off and the piece is scrap, and in a complex mosaic with dozens of interlocking pieces, that scaling error compounds across every cut.</p>
          <ul>
            <li>Disable your browser/printer's auto-scale — TileStencil forces true physical output (100% / Actual Size)</li>
            <li>Toggle between centimeters and inches to match metric or imperial rulers and printers</li>
            <li>The full pattern is auto-tiled across multiple A4/Letter sheets and stays exactly to scale after assembly</li>
          </ul>
        </section>

        <section>
          <h2>High-Contrast Black & White Lines, Low Ink Usage</h2>
          <p>A stained glass pattern is ultimately traced through a light table or directly onto the glass, so lines must be sharp black-on-white with no gray noise — otherwise you can't see the cut path on the glass surface.</p>
          <ul>
            <li>One-click conversion to high-contrast black-and-white line art, stripping background color and shading</li>
            <li>Ink-saving mode so large multi-page patterns won't run your cartridge dry</li>
            <li>Adjustable line thickness for oil-pen tracing or direct through-glass copying</li>
          </ul>
        </section>

        <section>
          <h2>Overlap Zones + Cross-Hair Marks Keep the Tiling Accurate</h2>
          <p>The biggest risk in multi-page tiling is misaligned or skewed assembly. TileStencil automatically prints a visible overlap margin and cross-hair registration marks on every page edge — cut and tape along the crosshairs and the full pattern lines up perfectly.</p>
          <ul>
            <li>Every page includes an overlap margin, giving you slack for accurate tape alignment</li>
            <li>Cross-hair marks pinpoint exact page boundaries — trim the excess and the pieces snap together</li>
            <li>Preview the fully assembled pattern before printing to confirm there's zero distortion</li>
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
          <p>Need 1:1 scale woodworking scroll saw templates?</p>
          <Link href="/print-scroll-saw-patterns">See the scroll saw pattern printing guide →</Link>
        </aside>

        <Link className="guide-cta" href="/">
          Open TileStencil and print stained glass pattern
        </Link>
      </GuideShell>
    </>
  );
}
