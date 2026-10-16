import type { Metadata } from "next";
import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Airbrush Stencil Maker – Positive and Negative Stencils from Any Image",
  description:
    "Make airbrush stencils and friskets from any image: switch between positive and negative with one click, add bridges for reusable stencils, and print or export an SVG to cut from acetate or mylar.",
  keywords: ["airbrush stencils", "airbrush stencil maker", "airbrush templates", "make airbrush stencils", "airbrush frisket"],
  alternates: { canonical: "/airbrush-stencil-maker", languages: languageAlternates("airbrushStencil") },
  openGraph: {
    locale: "en_US",
    title: "Airbrush Stencil Maker – positive and negative stencils from any image",
    description: "Image to airbrush stencil or frisket, with invert, bridges, and SVG export.",
    url: "/airbrush-stencil-maker",
  },
};

export default function EnglishAirbrushStencilPage() {
  return (
    <StencilLanding
      locale="en"
      intro={{
        eyebrow: "AIRBRUSH STENCIL MAKER",
        heading: "Make positive and negative airbrush stencils from any image.",
        copy: "Flip between a stencil and a mask with Invert, keep bridges for reusable stencils, and print at exact size or export an SVG to cut from acetate, mylar, or frisket film.",
      }}
      defaults={{ renderMode: "template", bridges: true, bridgeMm: 2, widthCm: 18, heightCm: 13 }}
      howToName="How to make an airbrush stencil from an image"
      howToDescription="Convert an image into a positive or negative airbrush stencil and cut it from acetate, mylar, or frisket film."
      howToSteps={[
        { name: "Choose the image", text: "Clean graphics, flames, skulls, lettering, and portraits with strong shadows work well." },
        { name: "Decide positive or negative", text: "Black areas are cut out. Use Invert to swap which parts get paint and which stay masked." },
        { name: "Set the size", text: "Enter the finished width on the shirt, helmet, model, or canvas." },
        { name: "Cut and spray", text: "Cut from acetate or mylar for reusable stencils, or from frisket film for a one-off mask, then spray in light passes." },
      ]}
      sections={[
        {
          heading: "Positive vs. negative stencils",
          body: "A positive stencil has the design cut out, so paint goes onto the design. A negative stencil (often called a mask or frisket) covers the design, so paint goes around it. The Invert switch flips one into the other from the same image, which also lets you build a design in two passes: background first through the mask, details second through the stencil.",
        },
        {
          heading: "Materials",
          items: [
            <><strong>Acetate or mylar (3–7 mil)</strong>: reusable; thin enough to lie flat on curves. Use bridges.</>,
            <><strong>Frisket film</strong>: low-tack adhesive, perfect for one-off masks on illustration board; bridges can be off because the pieces stick in place.</>,
            <><strong>Transfer tape or vinyl</strong>: for helmets, cars, and other hard surfaces.</>,
            <>Cutting a lot? Export the SVG and cut on a Cricut, Silhouette, or laser: see the <Link href={localizedPath("en", "cricutStencil")}>Cricut stencil maker</Link>.</>,
          ],
        },
        {
          heading: "Airbrushing tips",
          items: [
            "Lift the edge of a loose stencil slightly off the surface for a soft edge; press it flat for a hard edge.",
            "Spray at a low pressure (15–25 psi) and at a right angle to the stencil to limit overspray under the edges.",
            "Clean acetate stencils with airbrush cleaner between colours so paint does not build up on bridges.",
          ],
        },
      ]}
      faqItems={[
        {
          question: "How do I make my own airbrush stencils?",
          answer: "Choose an image on this page, set the threshold until the shapes are clean, decide positive or negative with Invert, and enter the size. Print the PDF and cut the black areas from acetate or frisket film, or export an SVG and cut it on a machine.",
        },
        {
          question: "Do I need bridges for an airbrush stencil?",
          answer: "For reusable acetate or mylar stencils, yes: without bridges the centres of letters and enclosed shapes fall out. For adhesive frisket film you can turn bridges off, because each piece stays where you place it.",
        },
        {
          question: "What thickness of acetate is best?",
          answer: "3–5 mil is easy to cut by hand and bends around helmets and models; 7 mil lasts longer on flat work such as shirts and canvases.",
        },
        {
          question: "Is it free?",
          answer: "Making the stencil and printing it are free with no account. A cut-ready SVG for cutting machines costs $1.99 per image.",
        },
      ]}
    />
  );
}
