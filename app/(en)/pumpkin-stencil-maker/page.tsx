import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { StencilExampleSection } from "@/components/StencilExample";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Pumpkin Stencil Maker – Turn Any Photo into a Carving Template",
  description:
    "Make a custom pumpkin carving stencil from a photo of your pet, family, or favourite character. Adjust the black-and-white threshold, set the size to fit your pumpkin, and print it free. No upload.",
  keywords: [
    "pumpkin stencil maker",
    "pumpkin stencil generator",
    "custom pumpkin stencil",
    "photo to pumpkin stencil",
    "picture to pumpkin stencil",
    "pumpkin carving stencils",
  ],
  alternates: {
    canonical: "/pumpkin-stencil-maker",
    languages: languageAlternates("pumpkinStencil"),
  },
  openGraph: {
    locale: "en_US",
    title: "Pumpkin Stencil Maker – turn any photo into a carving template",
    description: "Make a custom pumpkin carving stencil from any photo and print it at the size of your pumpkin.",
    url: "/pumpkin-stencil-maker",
  },
};

const howToSteps = [
  {
    name: "Pick a photo",
    text: "A pet, a face, a logo, or a character with a plain background works best. The photo stays in your browser.",
  },
  {
    name: "Tune the stencil",
    text: "Drag the threshold slider until the preview shows bold shapes. On a pumpkin, black areas are what you carve out or scrape, so keep them large and connected.",
  },
  {
    name: "Size it to your pumpkin",
    text: "Measure the flattest side of the pumpkin and enter that width, usually 15–25 cm (6–10 in) for a medium pumpkin.",
  },
  {
    name: "Print, tape, transfer, carve",
    text: "Print at Actual Size, tape the stencil to the pumpkin, poke along the lines with a pin tool, then carve.",
  },
];

const faqItems = [
  {
    question: "How do I make a pumpkin stencil from a picture?",
    answer:
      "Choose your picture on this page, move the threshold slider until the black-and-white preview shows clear, chunky shapes, enter the width of your pumpkin, and download the PDF. Print it at 100% and tape it to the pumpkin.",
  },
  {
    question: "What size should a pumpkin stencil be?",
    answer:
      "Measure across the flattest face of the pumpkin with a soft tape measure. Most medium pumpkins take a 15–20 cm (6–8 in) stencil; large carving pumpkins can take 25–30 cm (10–12 in). Leave a margin so the design does not wrap too far around the curve.",
  },
  {
    question: "Which photos carve well?",
    answer:
      "Photos with strong light and shadow: a pet facing the camera, a profile silhouette, or a simple logo. Small details such as whiskers or strands of hair are too thin to carve, so lower the threshold until they disappear.",
  },
  {
    question: "How do I transfer the stencil to the pumpkin?",
    answer:
      "Tape the printed stencil to the pumpkin, then push a pin or poking tool through the paper every few millimetres along each edge. Remove the paper and connect the dots with your carving saw. Dusting flour over the holes makes them easier to see.",
  },
  {
    question: "Is this pumpkin stencil maker free?",
    answer:
      "Yes. There is no sign-up, watermark, or page limit, and your photo is processed entirely in your browser.",
  },
];

const intro = {
  eyebrow: "CUSTOM PUMPKIN STENCIL MAKER",
  heading: "Turn any photo into a pumpkin carving stencil.",
  copy: "Choose a photo, adjust the black-and-white stencil with a live preview, set the width of your pumpkin, and print a carving template free. Your photo never leaves this browser.",
};

export default function EnglishPumpkinStencilPage() {
  return (
    <>
      <HowToJsonLd
        name="How to make a custom pumpkin carving stencil from a photo"
        description="Convert a photo into a pumpkin carving stencil sized to your pumpkin and print it at actual size."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp route="pumpkinStencil" locale="en" intro={intro} defaults={{ renderMode: "template", bridges: true, bridgeMm: 3, widthCm: 18, heightCm: 18 }}>
        <article className="app-guide">
          <StencilExampleSection locale="en" name="pumpkin" />
          <h2>Why make your own pumpkin stencil</h2>
          <p>
            Free pumpkin stencil galleries all offer the same cats, bats, and witches. A stencil made from your own photo
            (your dog, your kid in costume, your team logo) is the one people stop to look at. This tool turns that photo into
            bold black-and-white shapes and prints it at the size of your pumpkin.
          </p>
          <p>
            Just want a quick classic face? Grab one of our{" "}
            <Link href={localizedPath("en", "halloweenStencils")}>free Halloween stencils</Link>: jack-o&apos;-lantern faces,
            bats, black cats, and skulls with bridges already added.
          </p>

          <h2>Tips for a stencil that actually carves</h2>
          <ul>
            <li>
              <strong>Keep shapes chunky.</strong> Anything thinner than about 5 mm (¼ in) on the printout will snap when
              you carve. Lower the threshold to drop fine detail.
            </li>
            <li>
              <strong>Islands are handled for you.</strong> The middle of an eye or a letter O would fall out when carved,
              so automatic bridges leave a thin strip of pumpkin connecting it to the rest. Use 3–4 mm bridges on a
              pumpkin; thinner ones can snap.
            </li>
            <li>
              <strong>Carve or scrape?</strong> Black areas are usually cut through. For a shaded portrait, scrape the skin
              off grey areas instead; the thin flesh glows softly when lit.
            </li>
            <li>
              <strong>Go bigger on large pumpkins.</strong> If the design is wider than one sheet of paper, TileStencil
              splits it across pages with overlap marks so it still lines up.
            </li>
          </ul>

          <h2>Tools you will need</h2>
          <ul>
            <li>A pumpkin carving kit with a pin or poking tool and a small serrated saw</li>
            <li>Tape, and a soft tape measure for sizing</li>
            <li>A linoleum cutter or clay loop if you want to scrape shaded areas</li>
          </ul>

          <p>
            Want to stencil something other than a pumpkin? Use the general <Link href={localizedPath("en", "photoToStencil")}>photo to stencil maker</Link> for walls,
            shirts, wood, and signs.
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
