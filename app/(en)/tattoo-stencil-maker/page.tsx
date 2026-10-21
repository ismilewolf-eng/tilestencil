import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { StencilExampleSection } from "@/components/StencilExample";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Tattoo Stencil Maker – Print a Design at Exact Size",
  description:
    "Turn a tattoo design or photo into a clean black-and-white stencil, set the exact size for the placement, and print it for transfer paper or tracing. Free and private: nothing is uploaded.",
  keywords: [
    "tattoo stencil maker",
    "printable tattoo stencils",
    "tattoo stencil print",
    "make tattoo stencil from picture",
    "tattoo transfer stencil",
  ],
  alternates: {
    canonical: "/tattoo-stencil-maker",
    languages: languageAlternates("tattooStencil"),
  },
  openGraph: {
    locale: "en_US",
    title: "Tattoo Stencil Maker – print a design at exact size",
    description: "Convert a design into a clean stencil and print it at the exact placement size.",
    url: "/tattoo-stencil-maker",
  },
};

const howToSteps = [
  {
    name: "Choose the design",
    text: "Select a drawing, flash sheet, or photo. Line art on a white background converts most cleanly. The file stays in your browser.",
  },
  {
    name: "Clean it up with the threshold",
    text: "Drag the threshold until the lines are solid and the background is pure white. Lower values drop faint shading; higher values keep more of it.",
  },
  {
    name: "Set the exact size",
    text: "Measure the placement on the body and enter that width, for example 8 cm for a wrist piece or 25 cm for a forearm. Larger back pieces split across pages with alignment marks.",
  },
  {
    name: "Print and transfer",
    text: "Print at Actual Size on inkjet tattoo transfer paper, or print on plain paper and trace it onto thermal paper or the skin with a stencil pen.",
  },
];

const faqItems = [
  {
    question: "How do I make a tattoo stencil from a picture?",
    answer:
      "Choose the picture here, move the threshold slider until only the lines you want to keep are black, enter the width of the placement, and export the PDF. Print it at 100% scale onto transfer paper, or onto plain paper for tracing.",
  },
  {
    question: "Can I print a tattoo stencil with a normal printer?",
    answer:
      "Yes. Inkjet tattoo transfer paper is made for regular inkjet printers. Thermal stencil printers give a sharper line, but you can also print on plain paper and trace onto thermal paper by hand. Always choose Actual Size so the design is not shrunk.",
  },
  {
    question: "How do I get the size right?",
    answer:
      "Measure the area on the body with a soft tape and enter that width. Print a test on plain paper and hold it in place before using transfer paper; it is cheaper to adjust the size now than after the stencil is on the skin.",
  },
  {
    question: "Is my design uploaded anywhere?",
    answer:
      "No. Conversion and PDF creation happen entirely in your browser, so unreleased custom designs stay on your device.",
  },
];

const intro = {
  eyebrow: "TATTOO STENCIL MAKER",
  heading: "Turn a design into a clean tattoo stencil at the exact size.",
  copy: "Choose a drawing or photo, clean up the lines with the threshold slider, enter the placement size, and print it for transfer paper or tracing. Nothing is uploaded.",
};

export default function EnglishTattooStencilPage() {
  return (
    <>
      <HowToJsonLd
        name="How to make and print a tattoo stencil at exact size"
        description="Convert a design to a black-and-white tattoo stencil and print it at the placement size."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp route="tattooStencil" locale="en" intro={intro} defaults={{ renderMode: "template", widthCm: 10, heightCm: 10 }}>
        <article className="app-guide">
          <StencilExampleSection locale="en" name="tattoo" />
          <h2>From design to stencil in one step</h2>
          <p>
            A stencil only needs the lines. Grey shading, paper texture, and phone-camera shadows all smudge on transfer
            paper. The threshold slider removes them: everything lighter than the cut-off turns white, everything darker
            becomes a solid line, and the preview shows exactly what will print.
          </p>

          <h2>Getting a clean line</h2>
          <ul>
            <li>
              <strong>Scan or photograph flat.</strong> Shoot the drawing straight on in daylight so the background is even.
            </li>
            <li>
              <strong>Start low, then raise.</strong> Begin with a low threshold for outlines only, then raise it until
              thin lines connect without the paper turning grey.
            </li>
            <li>
              <strong>Print a size test.</strong> A plain-paper print held against the placement catches sizing mistakes
              before you use transfer paper.
            </li>
            <li>
              <strong>Mirror if your transfer method needs it.</strong> Some hand-tracing methods need a reversed image; flip
              the file in any photo app before loading it.
            </li>
          </ul>

          <p>
            Making a stencil for paint, fabric, or wood instead? Use the general{" "}
            <Link href={localizedPath("en", "photoToStencil")}>photo to stencil maker</Link>.
          </p>

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
