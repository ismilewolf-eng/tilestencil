import type { Metadata } from "next";
import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { languageAlternates, localizedPath } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Spray Paint Stencil Maker – Make Your Own from Any Photo",
  description:
    "Turn a photo or logo into a spray paint stencil with automatic bridges, then print it at full size across normal paper or export an SVG to cut from mylar. Tips for two-layer stencils and crisp edges.",
  keywords: ["spray paint stencil", "make a spray paint stencil", "custom spray paint stencil", "graffiti stencil maker", "mylar stencil"],
  alternates: { canonical: "/spray-paint-stencil-maker", languages: languageAlternates("sprayPaintStencil") },
  openGraph: {
    locale: "en_US",
    title: "Spray Paint Stencil Maker – make your own from any photo",
    description: "Photo or logo to a cut-ready spray paint stencil, printed at full size or exported as SVG.",
    url: "/spray-paint-stencil-maker",
  },
};

export default function EnglishSprayPaintStencilPage() {
  return (
    <StencilLanding route="sprayPaintStencil"
      locale="en"
      intro={{
        eyebrow: "SPRAY PAINT STENCIL MAKER",
        heading: "Make your own spray paint stencil from any photo or logo.",
        copy: "Adjust the stencil with a live preview, let automatic bridges hold the islands in place, then print it at full size across normal paper or export an SVG to cut from mylar.",
      }}
      defaults={{ renderMode: "template", bridges: true, bridgeMm: 3, widthCm: 40, heightCm: 30 }}
      howToName="How to make a spray paint stencil from a photo"
      howToDescription="Convert a photo or logo into a single- or two-layer spray paint stencil and print or cut it at full size."
      howToSteps={[
        { name: "Pick a high-contrast image", text: "Logos, silhouettes, and portraits lit from one side work best. Crop tight to the subject." },
        { name: "Set the threshold and bridges", text: "Move the threshold until the shape reads clearly. Keep bridges on at 3 mm or more so thin parts survive repeated spraying." },
        { name: "Size it for the surface", text: "Enter the finished width. Anything bigger than one sheet is split into numbered pages with overlap marks." },
        { name: "Cut, mask, spray", text: "Cut the black areas from poster board or mylar, fix the stencil with repositionable adhesive, and spray light coats." },
      ]}
      sections={[
        {
          heading: "What makes a stencil work for spray paint",
          body: "Spray paint finds every gap. A stencil that looks fine on screen can bleed or fall apart in use, so the tool removes specks too small to cut cleanly and connects every island (the middle of an O, the white of an eye) to the rest of the sheet with a bridge. In the stencil, black is what you cut out and where paint will land.",
        },
        {
          heading: "Choose the material",
          items: [
            <><strong>Printer paper or cardstock</strong>: fine for one use; seal the front with a coat of clear spray first so it does not soak through.</>,
            <><strong>Poster board or file folders</strong>: cheap and stiff enough for a few passes.</>,
            <><strong>Mylar (7–10 mil)</strong>: reusable for hundreds of sprays; cut it by hand with a hot knife or on a Cricut or laser using the <Link href={localizedPath("en", "cricutStencil")}>SVG export</Link>.</>,
            <><strong>Adhesive stencil vinyl</strong>: the crispest edges on walls, glass, and furniture, but only good for one application.</>,
          ],
        },
        {
          heading: "Make a two-layer stencil with two thresholds",
          items: [
            "Export once at a low threshold: this layer holds only the darkest shadows.",
            "Export again at a higher threshold: this layer adds the mid-tones.",
            "Spray the lighter colour through the mid-tone layer first, let it dry, then line up the shadow layer and spray the dark colour. The same image and size keep the two layers in register.",
          ],
        },
        {
          heading: "Spraying tips for crisp edges",
          items: [
            "Use repositionable spray adhesive on the back of the stencil so paint cannot creep underneath.",
            "Hold the can 15–25 cm away and build up two or three light coats instead of one heavy one.",
            "Spray straight on, not at an angle, especially near bridges.",
            "Lift the stencil while the last coat is still slightly tacky.",
          ],
        },
      ]}
      example="spray-paint"
      faqItems={[
        {
          question: "How do I make a spray paint stencil from a picture?",
          answer: "Choose the picture on this page, move the threshold until the black-and-white preview shows clean shapes, keep automatic bridges on, and enter the size you want. Print the PDF at Actual Size and cut out the black areas, or export the SVG to cut it on a machine.",
        },
        {
          question: "How thick should the bridges be for spray paint?",
          answer: "About 3 mm for paper and poster board, and 3–4 mm for mylar you plan to reuse. Thinner bridges look nicer but tear after a few uses.",
        },
        {
          question: "Can I make a big stencil for a wall or a car?",
          answer: "Yes. Enter the full width, for example 150 cm, and the PDF is split across as many sheets as needed with page numbers and overlap marks. Tape the sheets together, then transfer the outline to your stencil material.",
        },
        {
          question: "Is it free?",
          answer: "Making the stencil and printing the tiled PDF are free with no account. A cut-ready SVG for cutting machines costs $1.99 per image.",
        },
      ]}
    />
  );
}
