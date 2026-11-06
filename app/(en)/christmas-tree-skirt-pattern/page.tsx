import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { QuickAnswer } from "@/components/QuickAnswer";
import { TreeSkirtApp } from "@/components/TreeSkirtApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

const TITLE = "Free Christmas Tree Skirt Pattern – Printable PDF in Any Size";
const DESCRIPTION =
  "Free printable Christmas tree skirt pattern: round or 6, 8 or 12 panels, 36, 48, 60 in or any size. Prints at actual size on US Letter or A4, seam allowance included.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "christmas tree skirt pattern",
    "tree skirt pattern free",
    "free christmas tree skirt pattern",
    "tree skirt pattern pdf",
    "round tree skirt pattern",
    "christmas tree skirt template",
    "how to make a tree skirt",
  ],
  alternates: {
    canonical: "/christmas-tree-skirt-pattern",
    languages: languageAlternates("treeSkirt"),
  },
  openGraph: {
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    url: "/christmas-tree-skirt-pattern",
  },
};

const howToSteps = [
  {
    name: "Print and tape the template",
    text: "Choose round or panels, the size and your paper, download the PDF and print it at 100% (Actual Size). Measure the 1 inch square, then trim each sheet on its corner marks and tape the sheets together in order.",
  },
  {
    name: "Cut the top and the lining",
    text: "Round skirt: fold a square of fabric in half and in half again, lay the two straight edges of the template on the folds and cut through all layers. Paneled skirt: cut the panel the number of times printed on it. Cut the lining the same way.",
  },
  {
    name: "Cut the opening",
    text: "Round skirt: unfold the top and the lining and cut each from the outer edge to the centre along one fold line. Paneled skirt: sew the panels together side by side, leaving the last seam open; that gap is the opening.",
  },
  {
    name: "Sew the top to the lining",
    text: "Lay the top and the lining right sides together and sew around every edge 3/8 inch (1 cm) from the edge, leaving 6 inches open along one side of the opening. Clip the curves, especially around the centre.",
  },
  {
    name: "Turn, press and close",
    text: "Turn the skirt right side out through the gap, press the edges flat and slip-stitch the gap closed. Add ties or Velcro along the opening if you want it to stay shut around the tree stand.",
  },
];

const faqItems = [
  {
    question: "What size should a Christmas tree skirt be?",
    answer:
      "Measure the widest spread of the lowest branches and choose a skirt about that wide, or a little wider. Most trees of 6 to 7 feet take a 48 inch skirt, which is the most common size. A 36 inch skirt suits tabletop and narrow trees, and a 60 inch skirt suits 8 to 9 foot trees or a tree with gifts piled underneath.",
  },
  {
    question: "How big should the centre hole be?",
    answer:
      "About 5 inches across fits around most trunks and lets the skirt lie flat over the stand's legs. Make it bigger, up to 12 inches, if your stand has a wide bowl you want to cover, and smaller for a tabletop tree. Choose Custom to change it; the seam allowance is added for you.",
  },
  {
    question: "How much fabric do I need for a tree skirt?",
    answer:
      "For a round skirt you need a square as wide as the skirt plus the seam allowance, for the top and again for the lining: about 37 inches square for a 36 inch skirt, 49 inches square for 48 inches. Above about 42 inches that is wider than quilting cotton, so use 60 inch felt or fleece, or sew panels instead. A 48 inch skirt in 8 panels takes about 1 3/4 yards of 44 inch cotton per layer. The tool shows the amount for any size.",
  },
  {
    question: "Round or panels: which is easier?",
    answer:
      "The round skirt is fewer seams: one quarter template, cut on folded fabric, then sewn to its lining. Panels take longer but fit on standard quilting cotton at any size and are the way to make patchwork, two-color or scalloped skirts. Eight panels is the classic look; twelve makes a rounder outline.",
  },
  {
    question: "How do I print the pattern at the right size?",
    answer:
      "Print at 100% or Actual Size, not Fit to page or Shrink to fit. Every printed sheet has corner marks for lining up and a sheet number, and the template has a 1 inch square and a 5 cm bar. Measure one before cutting fabric; if it is off, check the scale setting in your printer dialog and print again.",
  },
  {
    question: "Can I make a tree skirt without sewing?",
    answer:
      "Yes. Cut a single layer of felt or fleece, which do not fray, from the template on the sewing line (the dashed line) instead of the cutting line, and leave the edges raw. Glue on ribbon or pom-pom trim around the outside with fabric glue.",
  },
];

export default function ChristmasTreeSkirtPatternPage() {
  return (
    <>
      <HowToJsonLd
        name="How to sew a Christmas tree skirt from a free printable pattern"
        description="Print the tree skirt template at actual size, cut the top and lining, cut the opening, sew them together and turn the skirt right side out."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <TreeSkirtApp>
        <article className="app-guide">
          <QuickAnswer heading="Free Christmas tree skirt pattern">
            <p>
              This free tree skirt pattern prints at actual size on a home printer, on US Letter or A4. No sign-up. Choose a round skirt, cut from one
              square of fabric folded in four, or a skirt sewn from 6, 8 or 12 panels.
            </p>
            <p>
              Sizes are 36, 48 and 60 inches across, or any size from 20 to 80 inches with a centre opening you choose. The 48 inch round skirt prints on
              9 sheets. Seam allowance of 3/8 inch (1 cm) is already added.
            </p>
          </QuickAnswer>

          <section>
            <h2>Tree skirt sizes</h2>
            <div className="pg-table-wrap">
              <table className="pg-table pg-table-figures">
                <thead>
                  <tr>
                    <th scope="col">Size</th>
                    <th scope="col">Tree height</th>
                    <th scope="col">Round, fabric per layer</th>
                    <th scope="col">8 panels, 44 in cotton</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">36 in (91 cm)</th>
                    <td data-label="Tree height">Tabletop to 5 ft</td>
                    <td data-label="Round">37 in square</td>
                    <td data-label="8 panels">1 yd</td>
                  </tr>
                  <tr>
                    <th scope="row">48 in (122 cm)</th>
                    <td data-label="Tree height">6 to 7 ft</td>
                    <td data-label="Round">49 in square (wide fabric)</td>
                    <td data-label="8 panels">1 3/4 yd</td>
                  </tr>
                  <tr>
                    <th scope="row">60 in (152 cm)</th>
                    <td data-label="Tree height">8 to 9 ft</td>
                    <td data-label="Round">61 in square (wide fabric)</td>
                    <td data-label="8 panels">3 yd</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Buy the same amount again for the lining. The amounts include the seam allowance; panel yardage is rounded up to the next quarter yard.</p>
          </section>

          <section>
            <h2>How to sew the tree skirt</h2>
            <ol>
              {howToSteps.map((step) => (
                <li key={step.name}>
                  <b>{step.name}.</b> {step.text}
                </li>
              ))}
            </ol>
            <p>
              For a quilted skirt, put a layer of thin batting under the top before you sew it to the lining, and quilt through all three layers after
              turning. For a ruffle or pom-pom trim, baste it to the right side of the outer edge before sewing the lining on.
            </p>
          </section>

          <section>
            <h2>Matching stockings and decorations</h2>
            <p>
              The <Link href={localizedPath("en", "stockingPattern")}>Christmas stocking pattern</Link> prints the same way, in three sizes, so you can
              sew stockings from the leftover fabric. For painted or appliquéd stars, snowflakes and trees on the skirt, the{" "}
              <Link href={localizedPath("en", "christmasStencils")}>free Christmas stencils</Link> print at any size. Have a different sewing pattern as a
              PDF? See <Link href={localizedPath("en", "patternGuide")}>how to print a pattern at actual size</Link>.
            </p>
          </section>

          <h2>Frequently asked questions</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </article>
      </TreeSkirtApp>
    </>
  );
}
