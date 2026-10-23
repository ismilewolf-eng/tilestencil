import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { StencilExampleSection } from "@/components/StencilExample";
import { QuickAnswer } from "@/components/QuickAnswer";
import { TileStencilApp } from "@/components/TileStencilApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Cricut Stencil Maker – Turn a Photo into a Cut-Ready SVG",
  description:
    "Make a stencil for Cricut, Silhouette, or a laser cutter from any photo. Automatic bridges keep the centres from falling out, and the SVG is sized in millimetres so it imports at the right size. Free preview, $1.99 per SVG, no upload.",
  keywords: [
    "cricut stencil",
    "stencil for cricut",
    "svg for cricut",
    "laser cut stencil",
    "convert image to svg for cricut",
    "svg stencil",
  ],
  alternates: {
    canonical: "/cricut-stencil-maker",
    languages: languageAlternates("cricutStencil"),
  },
  openGraph: {
    locale: "en_US",
    title: "Cricut Stencil Maker – turn a photo into a cut-ready SVG",
    description: "Photo to cut-ready stencil SVG with automatic bridges, sized for Cricut and laser cutters.",
    url: "/cricut-stencil-maker",
  },
};

const howToSteps = [
  {
    name: "Choose a photo or design",
    text: "Pick a JPG or PNG with a clear subject. It is processed in your browser and never uploaded.",
  },
  {
    name: "Tune the stencil",
    text: "Drag the threshold until the shapes read clearly. Automatic bridges hold the centres of letters, eyes, and rings in place so nothing falls out of the cut sheet.",
  },
  {
    name: "Set the finished size",
    text: "Enter the width you want to cut, for example 20 cm for a tote bag or 60 cm for a sign. The SVG is written in millimetres at that size.",
  },
  {
    name: "Export SVG and cut",
    text: "Choose Export SVG, then upload it in Cricut Design Space (Upload → Upload Image), Silhouette Studio, or LightBurn and cut it from stencil vinyl, mylar, or card.",
  },
];

const faqItems = [
  {
    question: "How much does the SVG cost?",
    answer:
      "Previews, adjustments, and printing a tiled PDF are free. The cut-ready SVG is $1.99 per image, paid once by PayPal or debit/credit card with no account and no subscription; after that you can re-export the same image as often as you like. There is a 14-day money-back guarantee.",
  },
  {
    question: "How do I make a stencil for my Cricut from a photo?",
    answer:
      "Choose the photo on this page, adjust the threshold until the black-and-white preview looks right, enter the size you want, and click Export SVG. In Cricut Design Space, use Upload → Upload Image and pick the SVG; it comes in as a cut-ready image with every bridge already in place.",
  },
  {
    question: "Will the SVG import at the right size in Cricut Design Space?",
    answer:
      "The file states its size in millimetres, which Design Space and most cutting software read correctly. Check the width shown after import, and if it differs, type the width you entered here; the proportions stay locked.",
  },
  {
    question: "What material should I cut a stencil from?",
    answer:
      "Stencil vinyl or adhesive vinyl for one-off projects on shirts, glass, and wood; 5–7 mil mylar for reusable stencils you will spray or sponge many times; cardstock for quick tests. Use 2 mm bridges for vinyl and 3–4 mm for mylar or card.",
  },
  {
    question: "Does it work with laser cutters?",
    answer:
      "Yes. The SVG contains closed paths, so LightBurn, xTool Creative Space, and Glowforge treat each shape as a cut line. Set the layer to cut rather than engrave.",
  },
  {
    question: "Why don't parts of my design fall out after cutting?",
    answer:
      "That is what the bridges are for. Any piece completely surrounded by cut lines would drop out, so TileStencil connects each one to the rest of the sheet with a thin strip along the shortest path. Turn bridges off to see those pieces highlighted in red.",
  },
];

const intro = {
  eyebrow: "CRICUT & LASER STENCIL MAKER",
  heading: "Turn any photo into a stencil your Cricut can cut.",
  copy: "TileStencil makes a cut-ready SVG stencil with bridges from any photo, so the centres of letters and eyes stay attached. Choose a photo, tune the stencil with a live preview, and export a cut-ready SVG with bridges already in place, sized in millimetres for Cricut, Silhouette, and laser cutters. Everything runs in your browser.",
};

export default function EnglishCricutStencilPage() {
  return (
    <>
      <HowToJsonLd
        name="How to make a Cricut stencil SVG from a photo"
        description="Convert a photo into a cut-ready stencil SVG with automatic bridges for Cricut and laser cutters."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp route="cricutStencil" locale="en" intro={intro} defaults={{ renderMode: "template", bridges: true, widthCm: 20, heightCm: 20 }}>
        <article className="app-guide">
          <QuickAnswer heading="How to make a cut-ready Cricut stencil SVG with bridges from a photo">
            <ol>
              <li>Choose your photo in the tool above. It is processed in your browser, not uploaded.</li>
              <li>Drag the threshold until the black-and-white preview reads clearly. Bridges are on by default: any piece that would fall out, like the middle of an O or an eye, is joined to the sheet automatically (2 mm for vinyl, 3–4 mm for mylar or card).</li>
              <li>Enter the finished width, for example 20 cm for a tote bag.</li>
              <li>Click Export SVG and, in Cricut Design Space, use Upload → Upload Image. The file is sized in millimetres and cuts as-is.</li>
            </ol>
            <p>Preview and a printable tiled PDF are free; the SVG is $1.99 per image, paid once with no account or subscription.</p>
          </QuickAnswer>
          <StencilExampleSection locale="en" name="cricut" />
          <h2>Why this beats tracing in Design Space</h2>
          <p>
            Cricut Design Space can remove a background, but it does not know which parts of a stencil will fall out once
            they are cut. Islands such as the inside of an O or the white of an eye either drop out or have to be bridged by
            hand. TileStencil finds them and adds bridges automatically, removes specks too small to weed, and exports closed
            paths at the exact size, so the file is ready to cut as soon as it is uploaded.
          </p>

          <h2>Good projects to start with</h2>
          <ul>
            <li>Pet portraits and family photos on tote bags and T-shirts (fabric paint through stencil vinyl)</li>
            <li>Signs and house numbers painted on wood</li>
            <li>Glass etching with etching cream</li>
            <li>Wall and furniture stencils cut from reusable mylar</li>
            <li>
              Lettering: use the <Link href={localizedPath("en", "letterStencils")}>letter stencil generator</Link> and
              export its SVG the same way
            </li>
          </ul>

          <h2>Cutting tips</h2>
          <ul>
            <li>Mirror is not needed for stencils: cut the design the right way round.</li>
            <li>Weed the black areas out; they are where paint goes through.</li>
            <li>Use transfer tape to move vinyl stencils so the bridges and small pieces stay in position.</li>
            <li>For big designs, print a tiled paper version first to check placement before cutting material.</li>
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
