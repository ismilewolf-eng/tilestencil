import type { Metadata } from "next";
import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Wood Burning Stencil Maker – Turn Any Photo into a Pyrography Pattern",
  description:
    "Make a wood burning stencil from a photo: clean outlines with a live preview, printed at the exact size of your board. Includes three ways to transfer the pattern to wood.",
  keywords: ["wood burning stencils", "pyrography patterns", "wood burning patterns", "photo to wood burning pattern", "wood burning templates"],
  alternates: { canonical: "/wood-burning-stencil-maker", languages: languageAlternates("woodBurningStencil") },
  openGraph: {
    locale: "en_US",
    title: "Wood Burning Stencil Maker – turn any photo into a pyrography pattern",
    description: "Photo to clean wood burning outlines, printed at the size of your board.",
    url: "/wood-burning-stencil-maker",
  },
};

export default function EnglishWoodBurningStencilPage() {
  return (
    <StencilLanding
      locale="en"
      intro={{
        eyebrow: "WOOD BURNING STENCIL MAKER",
        heading: "Turn any photo into a wood burning pattern at the size of your board.",
        copy: "Get clean, high-contrast outlines with a live preview, print the pattern at exact size, and transfer it to wood with graphite paper, heat, or a pin. Free, and your photo never leaves your browser.",
      }}
      defaults={{ renderMode: "template", widthCm: 18, heightCm: 13 }}
      howToName="How to make and transfer a wood burning stencil from a photo"
      howToDescription="Convert a photo into a pyrography pattern, print it at the size of the board, and transfer it to wood."
      howToSteps={[
        { name: "Choose the photo", text: "Pets, portraits, and landscapes with strong light and shadow give the clearest burn lines." },
        { name: "Tune the outline", text: "Lower the threshold for a simple outline to trace; raise it to keep shading you will fill with the burner." },
        { name: "Measure the board", text: "Enter the width of the area you will burn, leaving a margin for the edge of the board." },
        { name: "Print and transfer", text: "Print at Actual Size, then transfer with graphite paper, a laser-print heat transfer, or pinpricks, and start burning the outlines." },
      ]}
      sections={[
        {
          heading: "Outline or shading?",
          body: "Wood burning patterns come in two styles. A low threshold gives bold outlines that are easy to trace and burn with a writing tip. A higher threshold keeps the darker areas as solid shapes you can shade with a shading tip. Cutting islands do not matter here because nothing is cut out, so bridges are off by default.",
        },
        {
          heading: "Three ways to transfer the pattern to wood",
          items: [
            <><strong>Graphite transfer paper</strong>: place it under the printout and trace the lines with a ballpoint pen. The easiest and cleanest method for beginners.</>,
            <><strong>Heat transfer</strong>: print a mirrored copy on a laser printer (turn on Mirror or Flip in the print dialog), place it face down on the wood, and press with a transfer tip or an iron. Inkjet prints do not transfer.</>,
            <><strong>Pinprick and pencil</strong>: tape the printout down, prick along the lines with a pin, then join the dots in pencil. Works on curved or rough surfaces.</>,
          ],
        },
        {
          heading: "Getting a clean burn",
          items: [
            "Sand the board to 220 grit before transferring so the lines sit on a smooth surface.",
            "Pale, close-grained woods such as basswood, birch, and maple show the most detail.",
            "Burn the outlines first at low heat, then go back for shading.",
            <>For a cut-out version (for example a scroll saw project), see <Link href={localizedPath("en", "scrollSawGuide")}>printing scroll saw patterns</Link>.</>,
          ],
        },
      ]}
      faqItems={[
        {
          question: "How do I turn a photo into a wood burning pattern?",
          answer: "Choose the photo on this page, switch to the black-and-white template if it is not already on, and move the threshold until the outlines look the way you want to burn them. Enter the size of your board and print the PDF at Actual Size, then transfer it to the wood.",
        },
        {
          question: "What size should the pattern be?",
          answer: "Measure the area you want to burn and leave at least 1–2 cm of margin from the edge of the board. The pattern prints at exactly the width you enter; larger pieces are split across several pages with alignment marks.",
        },
        {
          question: "Do I need to mirror the image?",
          answer: "Only for heat transfer, because the toner is pressed face down onto the wood. Turn on Mirror or Flip in your printer dialog for that method. Graphite paper and pinpricks use the pattern the right way round.",
        },
        {
          question: "Is this wood burning stencil maker free?",
          answer: "Yes. Making and printing the pattern is free with no account, and the photo is processed only in your browser.",
        },
      ]}
    />
  );
}
