import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Photo to Stencil Maker – Free, Printable at Actual Size",
  description:
    "Turn a photo into a black-and-white stencil in your browser. Adjust the threshold with a live preview, then print it at the exact size you need across A4, A3, or Letter pages. No upload, no sign-up.",
  keywords: [
    "photo to stencil",
    "image to stencil",
    "turn photo into stencil",
    "stencil maker",
    "free stencil maker",
    "make a stencil from a picture",
  ],
  alternates: {
    canonical: "/photo-to-stencil",
    languages: languageAlternates("photoToStencil"),
  },
  openGraph: {
    locale: "en_US",
    title: "Photo to Stencil Maker – free and printable at actual size",
    description: "Convert a photo to an adjustable black-and-white stencil and print it across multiple pages at true scale.",
    url: "/photo-to-stencil",
  },
};

const howToSteps = [
  {
    name: "Choose a photo",
    text: "Pick a JPG or PNG with a clear subject and a plain background. The image is processed in your browser and never uploaded.",
  },
  {
    name: "Adjust the stencil threshold",
    text: "Move the threshold slider while watching the preview until the outline reads clearly. Use Invert if you want the subject cut out instead of the background.",
  },
  {
    name: "Set the finished size",
    text: "Enter the width you want on the wall, shirt, cake, wood, or pumpkin in centimetres or inches. TileStencil splits it across A4, A3, or US Letter pages.",
  },
  {
    name: "Print at 100% and cut",
    text: "Print the PDF at Actual Size, tape the pages using the numbered grid and overlap marks, then cut out the black areas with a craft knife.",
  },
];

const faqItems = [
  {
    question: "How do I turn a photo into a stencil for free?",
    answer:
      "Open this page, choose your photo, and drag the threshold slider until the black-and-white preview shows a clean outline. Set the size you need and export the PDF. It is free, needs no account, and the photo never leaves your browser.",
  },
  {
    question: "What kind of photo makes a good stencil?",
    answer:
      "High-contrast photos with one main subject work best: a face lit from one side, a pet on a plain background, a logo, or a silhouette. Busy backgrounds turn into speckles. Crop close to the subject before you start.",
  },
  {
    question: "What does the threshold slider do?",
    answer:
      "Every pixel brighter than the threshold becomes white and every darker pixel becomes black. A lower value gives thinner, simpler shapes; a higher value keeps more shadow detail. There is no single right number, so judge it by the preview.",
  },
  {
    question: "Why are there floating pieces that fall out when I cut?",
    answer:
      "Closed shapes such as the centre of an O or the pupil of an eye are islands in a single-layer stencil. Add small bridges with a marker before cutting, or use the stencil only for tracing and painting freehand.",
  },
  {
    question: "Can I make a stencil bigger than my printer paper?",
    answer:
      "Yes. That is what TileStencil is built for. Enter the finished size, for example 120 cm wide for a wall, and it splits the stencil into numbered pages with overlap and alignment marks so the pieces line up after printing.",
  },
];

const intro = {
  eyebrow: "FREE PHOTO TO STENCIL MAKER",
  heading: "Turn a photo into a stencil, then print it at the size you need.",
  copy: "Choose a photo, adjust the black-and-white threshold with a live preview, and export a printable stencil across A4, A3, or US Letter pages. Everything runs in your browser.",
};

export default function EnglishPhotoToStencilPage() {
  return (
    <>
      <HowToJsonLd
        name="How to turn a photo into a printable stencil"
        description="Convert a photo to a black-and-white stencil and print it at actual size across multiple pages."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp locale="en" intro={intro} defaults={{ renderMode: "template", widthCm: 40, heightCm: 30 }}>
        <article className="app-guide">
          <h2>What this stencil maker does</h2>
          <p>
            Most online stencil makers stop at a black-and-white image. You still have to work out how to print it at 60 cm
            wide on a home printer. TileStencil does both steps: it converts the photo, then splits the result into numbered
            pages at the exact physical size, with overlap and trim marks for assembly.
          </p>

          <h2>Getting a clean stencil from a photo</h2>
          <ul>
            <li>
              <strong>Start with contrast.</strong> Side lighting on a face, or a dark object on a light wall, gives the
              clearest shapes.
            </li>
            <li>
              <strong>Crop first.</strong> Remove background clutter before you choose the file; the threshold treats every
              pixel the same way.
            </li>
            <li>
              <strong>Watch the eyes and edges.</strong> Move the slider until eyes, mouth, and outline are readable at a
              glance. If the face fills with black, lower the threshold.
            </li>
            <li>
              <strong>Use Invert for cut-out style.</strong> Invert swaps black and white, which helps when you want to paint
              the subject rather than the background.
            </li>
          </ul>

          <h2>Common uses</h2>
          <ul>
            <li>Spray paint and airbrush stencils for walls, signs, and furniture</li>
            <li>Wood burning and scroll saw outlines traced onto boards</li>
            <li>T-shirt and tote bag stencils for fabric paint</li>
            <li>Cake and cookie stencils printed at the exact pan size</li>
            <li>
              Halloween pumpkins: see the <Link href={localizedPath("en", "pumpkinStencil")}>pumpkin stencil maker</Link> for sizing tips
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
