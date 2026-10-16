import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Printable Letter Stencils – Any Word, Any Size, Free",
  description:
    "Type any word or number and print stencil letters at the exact size you need, from 5 cm to over a metre tall, split across A4, A3, or Letter pages. Three stencil fonts, free, no sign-up.",
  keywords: [
    "letter stencils printable",
    "printable alphabet stencils",
    "large letter stencils",
    "number stencils printable",
    "stencil letters",
    "stencil font generator",
  ],
  alternates: {
    canonical: "/letter-stencils",
    languages: languageAlternates("letterStencils"),
  },
  openGraph: {
    locale: "en_US",
    title: "Printable Letter Stencils – any word, any size, free",
    description: "Type a word, pick a stencil font, and print letters at actual size across multiple pages.",
    url: "/letter-stencils",
  },
};

const howToSteps = [
  {
    name: "Type your text",
    text: "Enter a word, name, house number, or short phrase. Use new lines to stack words.",
  },
  {
    name: "Pick a stencil font",
    text: "Choose one of three stencil typefaces. Each one already has the small bridges that keep the centres of letters like A, B, O, and 8 attached.",
  },
  {
    name: "Set the finished size",
    text: "Enter the total width or height you want on the sign, wall, crate, or road. The letters scale exactly and split across A4, A3, or US Letter pages when they are larger than one sheet.",
  },
  {
    name: "Print, tape, cut",
    text: "Print at Actual Size, tape the pages using the grid labels, then cut the black letter shapes out of the paper or transfer them to stencil film or cardboard.",
  },
];

const faqItems = [
  {
    question: "Can I export letter stencils as an SVG for Cricut, Silhouette, or a laser cutter?",
    answer:
      "Yes. Choose Export SVG under the PDF button. The file contains closed cut paths with the bridges already in place, sized in millimetres to the width you entered, so it imports at the right size into Cricut Design Space, Silhouette Studio, LightBurn, or Inkscape. The SVG costs $1.99 per design, paid once; printing the PDF stays free.",
  },
  {
    question: "How do I print large letter stencils?",
    answer:
      "Type your text on this page, choose a stencil font, and enter the total width you need, for example 90 cm for a garden sign. TileStencil splits the lettering across standard printer pages with overlap and trim marks. Print at 100% and tape the sheets together.",
  },
  {
    question: "Why do stencil letters have gaps in them?",
    answer:
      "Letters such as A, B, D, O, P, R, and the numbers 0, 4, 6, 8, and 9 have closed centres. In a cut stencil those centres would fall out, so stencil fonts break the outline with small bridges that hold them in place.",
  },
  {
    question: "What size letters can I make?",
    answer:
      "Any size. Small letters fit on one page; for big lettering such as a parking bay number or a barn sign, enter the full size and the PDF is tiled across as many pages as needed.",
  },
  {
    question: "What should I cut the stencil from?",
    answer:
      "For one use, the printed paper taped down with painter's tape is enough. For repeated spraying, trace the letters onto mylar stencil film, cardstock, or thin plastic and cut them with a craft knife.",
  },
  {
    question: "Can I use these letter stencils commercially?",
    answer:
      "Yes. The fonts are released under the SIL Open Font License, which allows printing signs and products. Your text never leaves your browser.",
  },
];

const intro = {
  eyebrow: "PRINTABLE LETTER STENCILS",
  heading: "Type any word and print stencil letters at the exact size you need.",
  copy: "Pick a stencil font, set the finished width, and download a PDF that splits large lettering across A4, A3, or US Letter pages. Free, no sign-up, nothing uploaded.",
};

export default function EnglishLetterStencilsPage() {
  return (
    <>
      <HowToJsonLd
        name="How to print large letter stencils at home"
        description="Generate stencil lettering in any size and print it across multiple pages at actual size."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp locale="en" intro={intro} source="text" defaults={{ renderMode: "template", widthCm: 60, heightCm: 20 }}>
        <article className="app-guide">
          <h2>Letter stencils without downloading a whole alphabet</h2>
          <p>
            Most printable alphabet stencils are a PDF of A–Z at one fixed size, so you print 26 pages to use five letters,
            then scale them on a photocopier. Here you type the exact word, and it comes out spaced, centred, and at the size
            you entered.
          </p>

          <h2>Popular uses</h2>
          <ul>
            <li>House numbers and mailbox names</li>
            <li>Garden, farm, and shop signs painted on wood</li>
            <li>Shipping crates, toolboxes, and storage bins</li>
            <li>Parking bay numbers and floor markings (enter the full size in centimetres)</li>
            <li>Wall quotes and nursery names</li>
          </ul>

          <h2>Tips for crisp painted letters</h2>
          <ul>
            <li>Use spray adhesive or painter&apos;s tape so paint does not creep under the edges.</li>
            <li>Dab paint with a stencil brush or sponge; do not brush sideways.</li>
            <li>Peel the stencil while the paint is still slightly wet for the cleanest edge.</li>
            <li>
              Want a shape or photo instead of text? Use the <Link href={localizedPath("en", "photoToStencil")}>photo to stencil maker</Link>.
            </li>
          </ul>

          <h2>Frequently asked questions</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </article>
      </TileStencilApp>
    </>
  );
}
