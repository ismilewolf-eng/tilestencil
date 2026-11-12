import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { QuickAnswer } from "@/components/QuickAnswer";
import { StockingPatternApp } from "@/components/StockingPatternApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

// 2026-11-10: wording people search (Search Console): "pdf free download", "with cuff", "large".
// 2026-11-12: also "for adults", "simple", "modern": answered in "Which size and style" and the FAQ.
const TITLE = "Free Christmas Stocking Pattern PDF – With Cuff, Small to Large";
const DESCRIPTION =
  "Free PDF download: printable Christmas stocking pattern with cuff and hanging loop, in small (12 in), medium (16 in) and large (20 in). Prints at actual size on US Letter or A4.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "christmas stocking pattern",
    "christmas stocking sewing pattern",
    "free christmas stocking pattern",
    "christmas stocking template",
    "printable christmas stocking pattern",
    "stocking pattern pdf",
    "christmas stocking outline",
    "simple christmas stocking pattern",
    "christmas stocking pattern for adults",
    "modern christmas stocking pattern",
  ],
  alternates: {
    canonical: "/christmas-stocking-pattern",
    languages: languageAlternates("stockingPattern"),
  },
  openGraph: {
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    url: "/christmas-stocking-pattern",
  },
};

const howToSteps = [
  {
    name: "Print the pattern at actual size",
    text: "Choose a size and your paper, download the PDF and print it at 100% (Actual Size). Measure the 1 inch square on the pattern to check the scale.",
  },
  {
    name: "Tape the sheets together",
    text: "Trim each sheet on its corner marks, overlap the edges in sheet order and tape them. Cut out the stocking, cuff and loop on the solid lines.",
  },
  {
    name: "Cut the fabric",
    text: "Fold the outer fabric right sides together and cut two stockings at once so one is flipped. Do the same with the lining. Cut two cuffs and one loop.",
  },
  {
    name: "Sew the outer stocking and the lining",
    text: "Sew each pair right sides together along the dashed line, leaving the top open. Clip the curves at the heel and toe and turn the outer stocking right side out.",
  },
  {
    name: "Add the cuff and loop, then finish",
    text: "Sew the cuffs into a ring, fold it in half and pin it inside the top with the loop. Slip the lining in, sew around the top, then turn the cuff out over the stocking.",
  },
];

const faqItems = [
  {
    question: "How big is a Christmas stocking?",
    answer:
      "Most stockings are 16 to 18 inches tall, top to heel. This pattern comes in Small (12 in / 31 cm) for children, pets or a row on a mantel, Medium (16 in / 41 cm), which is the classic size, and Large (20 in / 51 cm) for a big stocking that holds a lot.",
  },
  {
    question: "Which size is right for adults?",
    answer:
      "Medium (16 in / 41 cm) is the size most shop-bought adult stockings are, and it suits a mantel with several stockings side by side. Choose Large (20 in / 51 cm) if you fill stockings generously or want one that stands out. Small (12 in / 31 cm) is for children, pets and decoration.",
  },
  {
    question: "Is this a simple pattern for beginners?",
    answer:
      "Yes. There are three pieces (stocking, cuff and loop), every seam is a straight line or one gentle curve, and there are no darts, zips or pleats. A first stocking takes about an hour; the lining can be left out to make it simpler still.",
  },
  {
    question: "How do I make it look modern?",
    answer:
      "The shape is a classic stocking with a rounded toe, so the look comes from the fabric. For a modern stocking use one plain fabric such as linen, canvas, wool felt or bouclé in a neutral or a single deep colour, cut the cuff from the same fabric instead of faux fur, and use a leather or twill-tape loop.",
  },
  {
    question: "Is seam allowance included?",
    answer:
      "Yes. The solid line is the cutting line and the dashed line is the sewing line, 3/8 inch (1 cm) inside it. The cuff and the hanging loop have the same allowance.",
  },
  {
    question: "How do I print the pattern at the right size?",
    answer:
      "Print at 100% or Actual Size, not Fit to page or Shrink to fit. Each sheet has a 1 inch square and a 5 cm bar on the stocking; measure one before you cut fabric. If it is off, check the scale setting in your printer dialog and print again.",
  },
  {
    question: "How much fabric do I need?",
    answer:
      "For the Medium stocking, half a yard (18 × 44 in) of outer fabric is enough for the front and back, and the same again for the lining. The two cuffs need a piece about 15 × 9 in; felt or faux fur works without hemming. The Small stocking fits on a fat quarter each, and the Large needs 5/8 yard each.",
  },
  {
    question: "Can I use the stocking template without sewing?",
    answer:
      "Yes. Cut the shapes from felt and glue or blanket-stitch the edges, or use the one-page outline as a template for card, kids' crafts and colouring pages. For a stencil to paint or cut on a Cricut, use the Christmas stocking design in the free stencil gallery.",
  },
  {
    question: "Why does the pattern say to flip one piece?",
    answer:
      "A stocking has a front and a back that mirror each other. Folding the fabric right sides together and cutting both layers at once gives you the mirrored pair, so the toe points the same way when they are sewn together.",
  },
];

export default function ChristmasStockingPatternPage() {
  return (
    <>
      <HowToJsonLd
        name="How to sew a Christmas stocking from a free printable pattern"
        description="Print the stocking pattern at actual size, cut the outer fabric, lining, cuff and loop, then sew and turn the stocking."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <StockingPatternApp>
        <article className="app-guide">
          <QuickAnswer heading="Free Christmas stocking pattern">
            <p>
              This free Christmas stocking pattern prints on a home printer, on US Letter or A4, at actual size. No sign-up. Choose Small (12 in), Medium
              (16 in) or Large (20 in); the Medium pattern takes 5 sheets.
            </p>
            <p>
              Every size includes the stocking, a fold-over cuff and a hanging loop, with 3/8 in (1 cm) seam allowance already added. Solid lines are for
              cutting and dashed lines for sewing.
            </p>
            <p>Want a plain shape for colouring, felt or card? Download the one-page outline instead.</p>
          </QuickAnswer>

          <section>
            <h2>Which size and style to make</h2>
            <ul>
              <li>
                <b>For adults:</b> Medium (16 in) is the usual adult size. Large (20 in) holds more and looks generous on a wide mantel.
              </li>
              <li>
                <b>For children and pets:</b> Small (12 in) fits a few small gifts and hangs well in a row or on a stair rail.
              </li>
              <li>
                <b>A simple first stocking:</b> use felt for both layers and skip the lining. Felt does not fray, so you only sew the outline and add the
                cuff.
              </li>
              <li>
                <b>A modern stocking:</b> one plain fabric (linen, canvas or wool felt), a cuff cut from the same fabric, and no trim.
              </li>
              <li>
                <b>A traditional stocking:</b> red velvet or plaid flannel with a white faux-fur cuff.
              </li>
            </ul>
          </section>

          <section>
            <h2>What you need</h2>
            <ul>
              <li>
                <b>Outer fabric:</b> quilting cotton, flannel, velvet or wool felt. Half a yard for a Medium stocking, a fat quarter for Small, 5/8 yard for
                Large.
              </li>
              <li>
                <b>Lining:</b> the same amount of plain cotton. It hides the seams and makes the stocking hold its shape.
              </li>
              <li>
                <b>Cuff:</b> felt, faux fur or a contrasting cotton. Faux fur sheds when cut; cut it from the back with small snips through the backing only.
              </li>
              <li>
                <b>Tools:</b> scissors or a rotary cutter, pins or clips, a sewing machine (or needle and thread), and tape for joining the pattern sheets.
              </li>
            </ul>
          </section>

          <section>
            <h2>How to sew the stocking</h2>
            <ol>
              {howToSteps.map((step) => (
                <li key={step.name}>
                  <b>{step.name}.</b> {step.text}
                </li>
              ))}
            </ol>
            <p>
              Sewing a name on? Embroider or appliqué it on the cuff before you sew the cuff into a ring; it is much easier while the piece is still flat.
            </p>
          </section>

          <section>
            <h2>Other ways to use the template</h2>
            <ul>
              <li>
                <b>Felt stockings without a machine:</b> cut two layers of felt on the sewing line (the dashed line) and blanket-stitch the edges by hand.
              </li>
              <li>
                <b>Paper and card:</b> print the one-page outline for kids to colour, or trace it onto card for gift tags and garlands.
              </li>
              <li>
                <b>Painted signs and vinyl:</b> the{" "}
                <Link href={`${localizedPath("en", "christmasStencils")}#stocking`}>stocking stencil in the Christmas gallery</Link> has bridges for cutting and
                prints at any size with the{" "}
                <Link href={localizedPath("en", "stencilGuide")}>large stencil printer</Link>.
              </li>
            </ul>
            <p>
              Have another sewing pattern as a PDF that needs to print at full size? See{" "}
              <Link href={localizedPath("en", "patternGuide")}>how to print a pattern at actual size</Link>.
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
      </StockingPatternApp>
    </>
  );
}
