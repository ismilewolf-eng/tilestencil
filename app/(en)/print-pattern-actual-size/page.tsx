import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Print Craft & Sewing Patterns at 100% Actual Size",
  description:
    "Print full-scale 1:1 woodworking templates, leathercraft patterns, sewing patterns, and Cosplay EVA foam schematics across regular A4 or Letter sheets without a large-format plotter.",
  keywords: [
    "print pattern actual size",
    "full scale woodworking template",
    "leather pattern tiling PDF",
    "sewing pattern multi page print",
    "cosplay foam template 100 percent scale",
    "tile image actual size",
  ],
  alternates: {
    canonical: "/print-pattern-actual-size",
    languages: languageAlternates("patternGuide"),
  },
  openGraph: {
    title: "Print Craft & Sewing Patterns at 100% Actual Size",
    description: "Tile exact 1:1 physical blueprints for woodworking, leathercraft, and sewing onto standard paper.",
    url: "/print-pattern-actual-size",
  },
};

const howToSteps = [
  {
    name: "Check the exact target dimensions",
    text: "Find the real-world width and height of your craft blueprint (in cm or inches) and enter them into TileStencil.",
  },
  {
    name: "Set paper, margins, and overlap marks",
    text: "Select A4 or Letter, add a 5–8mm margin and alignment overlap, then generate the multi-sheet template PDF.",
  },
  {
    name: "Print at 100% Actual Size and assemble",
    text: "In your printer dialog, disable page scaling and select 100% Actual Size. Line up registration marks and tape seams together.",
  },
];

const faqItems = [
  {
    question: "How do I verify the printed pattern is exactly 1:1 true scale?",
    answer: "If your pattern includes a 1-inch or 5-cm test square, measure it with a steel ruler immediately after printing the first page. As long as Actual Size / 100% was selected in your print settings, dimension accuracy is typically within 0.5mm.",
  },
  {
    question: "Which render mode is best for leathercraft and woodworking?",
    answer: "The Black-and-White Template mode is ideal. It strips away gradients and background colors, leaving high-contrast, razor-sharp cut lines that save printer toner and make tracing with awls or transfer paper easy.",
  },
  {
    question: "How do I assemble multi-sheet templates with maximum precision?",
    answer: "TileStencil includes registration crosses and coordinate tags on each sheet. Use a utility knife and ruler to trim along one overlapping edge, align the crosshairs, and tape firmly along the rear seam with painters or packing tape.",
  },
];

export default function EnglishPrintPatternActualSizePage() {
  return (
    <>
      <HowToJsonLd
        name="How to Print Craft & Sewing Patterns at 100% Actual Size"
        description="Step-by-step method to tile 1:1 scale templates for sewing, woodworking, and Cosplay onto home printers."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="patternGuide"
        kicker="CRAFT & BLUEPRINT PATTERNS"
        title="Print full-scale patterns at 100% actual size on standard paper."
        lead="Whether you are building furniture, crafting leather bags, sewing garments, or fabricating Cosplay EVA foam armor, you can output accurate 1:1 patterns using a home printer."
      >
        <section>
          <h2>Why physical sizing accuracy matters in crafting</h2>
          <p>
            Unlike decorative artwork, a 2% scaling distortion in a template ruins woodworking joints, leather stitch line alignments, or clothing seam allowances. TileStencil calculates all tile strides internally in millimetres to ensure zero scaling deformation.
          </p>
          <ul>
            <li><strong>Leathercraft:</strong> Wallet, bag, and holster patterns printed at true 1:1 scale.</li>
            <li><strong>Woodworking:</strong> Curved templates, scroll saw patterns, and joinery guides.</li>
            <li><strong>Cosplay & Props:</strong> Multi-page EVA foam armor pieces and prop blueprints.</li>
            <li><strong>Sewing & Quilting:</strong> Garment pattern blocks tiled across manageable sheets.</li>
          </ul>
        </section>

        <section>
          <h2>Keys to flawless pattern printing</h2>
          <ol>
            <li><strong>Preserve Aspect Ratio:</strong> TileStencil locks original proportions automatically, so entering one target dimension scales the other accurately.</li>
            <li><strong>Include Overlap:</strong> A 5–8mm (0.2–0.3 in) overlap provides safety margin when trimming and overlapping adjoining sheets.</li>
            <li><strong>Black & White Mode:</strong> Produces crisp outlines and minimizes ink usage for clean cutting lines.</li>
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
          <p>Need to enlarge graphics for wall murals or painting transfer?</p>
          <Link href="/print-large-stencil">See the mural stencil enlarging guide →</Link>
        </aside>

        <Link className="guide-cta" href="/">
          Open TileStencil and print your pattern
        </Link>
      </GuideShell>
    </>
  );
}
