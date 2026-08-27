import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Print Scroll Saw Patterns at 1:1 Actual Size | Tiling Tool - TileStencil",
  description: "Free browser-based tool to print scroll saw, routing, and carving patterns at true physical size (cm/in). Ink-saving black-and-white lines with zero distortion, ready for spray-adhesive mounting straight onto wood. Runs 100% offline — no uploads.",
  keywords: ["print scroll saw pattern actual size","woodworking pattern tiling print","routing pattern print tool","1:1 pattern print tool","spray adhesive pattern printing","scroll saw pattern PDF print","actual size printing tool","disable scale to fit printing"],
  alternates: {
    canonical: "/print-scroll-saw-patterns",
    languages: languageAlternates("scrollSawGuide"),
  },
  openGraph: {
    title: "Print Scroll Saw Patterns at 1:1 Actual Size | Tiling Tool - TileStencil",
    description: "Free browser-based tool to print scroll saw, routing, and carving patterns at true physical size (cm/in). Ink-saving black-and-white lines with zero distortion, ready for spray-adhesive mounting straight onto wood. Runs 100% offline — no uploads.",
    url: "/print-scroll-saw-patterns",
  },
};

const howToSteps = [
  {
    "name": "Upload Your Scroll Saw / Routing Pattern",
    "text": "Drag your pattern image (JPG/PNG) directly into the browser. Nothing is uploaded to a server — everything is processed locally, so it works just as well with your own designs or purchased pattern files."
  },
  {
    "name": "Set the Actual Workpiece Dimensions",
    "text": "Enter the finished piece's real length and width (cm or in), choose A4/Letter paper, and TileStencil auto-calculates the page count and lays out overlap zones with cross-hair registration marks."
  },
  {
    "name": "Print, Assemble, and Spray-Mount",
    "text": "Turn off \"fit to page\" and select 100%/Actual Size in your print dialog. Trim along the cross-hair marks and tape the pages into one full pattern, then spray-glue it to your stock for scroll sawing or routing."
  }
];

const faqItems = [
  {
    "question": "How can I confirm the printed pattern is really 1:1 actual size?",
    "answer": "Every page prints a calibration ruler marked in centimeters/inches. After printing, measure it with a tape measure or ruler — if the length matches exactly, no scaling occurred. If it doesn't, check your print settings for \"Fit to page\" or \"Scale to printable area\" and make sure it's off, selecting \"Actual Size / 100% / No Scaling\" instead — otherwise every cutting dimension will be off."
  },
  {
    "question": "Will the pattern distort once I've taped the pages together and spray-mounted it?",
    "answer": "No. TileStencil generates a fixed-width overlap margin with cross-hair registration marks on every page edge. Trim off the excess border at the outer cross-hairs and use the cross-hairs within the overlap zone as your alignment reference — not the raw paper edges. This absorbs the small errors introduced by printing and trimming, so the assembled pattern keeps the exact proportions of your original design once mounted."
  },
  {
    "question": "Can I use a purchased pattern (e.g. a PDF screenshot) directly?",
    "answer": "Yes — export or screenshot it as JPG/PNG and upload it. TileStencil automatically applies high-contrast black-and-white conversion to strip background color and shading. Note that if the source file has its own printed scale reference, what matters is the actual dimensions you enter manually — the uploaded image's resolution or DPI has no bearing on the final print size. TileStencil calculates tiling and scaling purely from your specified physical width/height and paper size."
  }
];

export default function ScrollSawEnPage() {
  return (
    <>
      <HowToJsonLd
        name="How to Print Scroll Saw Patterns at 1:1 Actual Size"
        description="Free browser-based tool to print scroll saw, routing, and carving patterns at true physical size (cm/in). Ink-saving black-and-white lines with zero distortion, ready for spray-adhesive mounting straight onto wood. Runs 100% offline — no uploads."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="scrollSawGuide"
        kicker="Woodworking Craft · True-to-Scale Printing"
        title="Print Scroll Saw & Routing/Carving Patterns at 1:1 Actual Size"
        lead="Before scroll sawing or routing, the pattern gets spray-glued directly onto the wood and cut along the lines — any distortion or scaling error throws off the fit, jams the blade, or wastes stock outright. TileStencil runs locally in your browser, tiling patterns across pages at true centimeter/inch dimensions with crisp, ink-saving black-and-white lines — so any home A4/Letter printer can output precise, full-size patterns. Nothing is ever uploaded."
      >
        <section>
          <h2>Why Woodworking Patterns Demand Absolute Precision</h2>
          <p>Once you cut into wood, there's no undo. A 1-2mm error in the pattern means an inlay won't seat, and a shifted routing path can cut straight through a critical structural line. "Fit to page" scaling is harmless for a text document — for a cutting template, it's fatal.</p>
          <ul>
            <li>TileStencil forces 100% / Actual Size output, eliminating printer auto-scaling</li>
            <li>Switch between centimeters and inches to match your tape measure or digital calipers</li>
            <li>Large patterns are auto-tiled across pages, with dimensional error after assembly reduced to near zero</li>
          </ul>
        </section>

        <section>
          <h2>Ink-Saving Black & White Lines, Ready for Spray Adhesive</h2>
          <p>Scroll saw and routing patterns are typically mounted with spray adhesive directly onto the workpiece and cut along the line — heavy ink coverage smears easily. Clean, high-contrast lines let you track the cut path precisely without color blocks obscuring your view.</p>
          <ul>
            <li>One-click conversion to high-contrast black-and-white line art, purpose-built for spray-mount cutting</li>
            <li>Ink-saving mode cuts ink consumption dramatically on multi-page patterns</li>
            <li>Adjustable line thickness for fine scroll saw curves or bold routing paths</li>
          </ul>
        </section>

        <section>
          <h2>Zero-Distortion Tiling — Dimensions You Can Trust</h2>
          <p>Scaling drift between pages is the biggest risk in multi-page tiling. TileStencil guarantees an identical scale factor across every page, and combined with overlap zones and cross-hair registration marks, the assembled pattern matches your original design to the millimeter — accurate enough to use directly as a cutting template.</p>
          <ul>
            <li>Every page includes an auto-generated overlap margin, giving slack that absorbs trimming error instead of compounding distortion</li>
            <li>Cross-hair marks pinpoint exact page boundaries — trim the excess and pieces align seamlessly</li>
            <li>Preview the full assembled layout before printing to confirm dimensions match the original design exactly</li>
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
          <p>Need 100% scale templates for stained glass or mosaic craft?</p>
          <Link href="/print-stained-glass-patterns">See the stained glass pattern printing guide →</Link>
        </aside>

        <Link className="guide-cta" href="/">
          Open TileStencil and print scroll saw pattern
        </Link>
      </GuideShell>
    </>
  );
}
