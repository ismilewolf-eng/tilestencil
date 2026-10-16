import type { Metadata } from "next";
import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Large Wall Stencil Maker – Print a Mural Stencil at Full Size",
  description:
    "Make your own large wall stencil from any image: set the real width of the wall, and TileStencil splits the stencil across A4, A3, or Letter pages with alignment marks. No projector needed.",
  keywords: ["large wall stencil", "wall mural stencil", "diy wall mural", "print large stencil", "mural projector alternative"],
  alternates: { canonical: "/print-large-stencil", languages: languageAlternates("stencilGuide") },
  openGraph: {
    locale: "en_US",
    title: "Large Wall Stencil Maker – print a mural stencil at full size",
    description: "Any image to a full-size wall stencil, tiled across normal printer paper with alignment marks.",
    url: "/print-large-stencil",
  },
};

export default function EnglishPrintLargeStencilPage() {
  return (
    <StencilLanding
      locale="en"
      intro={{
        eyebrow: "LARGE WALL STENCIL MAKER",
        heading: "Make a wall-size stencil on your home printer.",
        copy: "Enter the real width of the wall or mural, adjust the black-and-white stencil with a live preview, and print it across numbered A4, A3, or Letter pages with overlap and alignment marks. No projector needed.",
      }}
      defaults={{ renderMode: "template", widthCm: 120, heightCm: 80 }}
      howToName="How to make a large wall stencil without a projector"
      howToDescription="Scale any image to the size of a wall and print it as a tiled stencil on standard paper."
      howToSteps={[
        { name: "Measure the wall area", text: "Measure the width and height you want the mural to cover and enter them in cm or inches." },
        { name: "Turn the image into a stencil", text: "Use the black-and-white template and move the threshold until the shapes are bold and simple enough to paint." },
        { name: "Print the tiles", text: "Print every page at 100% Actual Size. Each page is numbered by row and column." },
        { name: "Assemble and transfer", text: "Trim one overlap edge, tape the pages together, fix the sheet to the wall, and trace or pounce the outline before painting." },
      ]}
      sections={[
        {
          heading: "Why print instead of projecting",
          body: "A projector needs a dark room, a steady stand, and an outlet near the wall, and the image distorts if it is not square to the surface. A tiled print is exactly to scale, can be repositioned as many times as you like, and works in daylight on any wall. TileStencil works in millimetres internally, so 2 metres on screen is 2 metres on the wall.",
        },
        {
          heading: "Ways to get the outline onto the wall",
          items: [
            <><strong>Trace with transfer paper</strong>: put graphite or chalk transfer paper behind the taped sheet and go over the lines with a pen.</>,
            <><strong>Pounce</strong>: perforate the lines with a pounce wheel, tape the sheet up, and dab charcoal powder through the holes. Ideal for big, simple shapes.</>,
            <><strong>Cut-out stencil</strong>: turn on bridges, cut the black areas out of the taped sheet or poster board, and paint straight through it.</>,
          ],
        },
        {
          heading: "Tips for big murals",
          items: [
            "Use A3 if your printer supports it: fewer pages means fewer seams.",
            "Keep a 5–10 mm overlap so small trimming errors can be absorbed at the seams.",
            "Tape the sheets from the back with wide clear tape and the front with low-tack painter's tape.",
            "Check level with a spirit level or laser line before tracing.",
            <>Lettering on a wall? Use the <Link href={localizedPath("en", "letterStencils")}>letter stencil generator</Link>.</>,
          ],
        },
      ]}
      example="wall"
      faqItems={[
        {
          question: "How do I make a large stencil for a wall?",
          answer: "Choose your image here, set the width and height of the wall area, switch to the black-and-white template, and print the PDF at Actual Size. Tape the numbered pages together using the overlap marks, then trace, pounce, or cut it out.",
        },
        {
          question: "How many pages will a wall stencil need?",
          answer: "The tool shows the page count live. For example, a 120 × 80 cm mural with the default margins and overlap takes 21 A4 pages in portrait, or 9 A3 pages in landscape.",
        },
        {
          question: "Can I do this without a projector?",
          answer: "Yes. That is the point of tiled printing: the paper itself is the projector, exactly to scale, and you can reposition it before committing to paint.",
        },
        {
          question: "Is it free?",
          answer: "Yes. Making and printing the tiled stencil is free with no account, and your image stays in your browser.",
        },
      ]}
    />
  );
}
