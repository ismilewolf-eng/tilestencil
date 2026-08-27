import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Print Large Banner Letters & Signs Across Multiple Pages",
  description:
    "Split long party banners, classroom welcome signs, store promotional slogans, and large letter displays across standard A4 or US Letter sheets with guided alignment marks.",
  keywords: [
    "print banner letters",
    "large banner multi page print",
    "print sign across pages",
    "classroom banner tiling PDF",
    "party welcome sign print at home",
    "tile long banner image",
  ],
  alternates: {
    canonical: "/print-banner-letters",
    languages: languageAlternates("bannerGuide"),
  },
  openGraph: {
    title: "Print Large Banner Letters & Signs Across Multiple Pages",
    description: "Tile multi-meter banner images and big letters across standard printer paper with ease.",
    url: "/print-banner-letters",
  },
};

const howToSteps = [
  {
    name: "Prepare your banner graphic and target length",
    text: "Export your slogan or banner design as JPG or PNG and measure the total length needed (e.g. 200 cm or 80 inches).",
  },
  {
    name: "Select landscape orientation and overlap",
    text: "Choose A4 or Letter Landscape orientation, and add an 8–10mm overlap for smooth horizontal letter alignment.",
  },
  {
    name: "Export PDF and assemble sequentially",
    text: "Print at 100% Actual Size, trim one side of each sheet along the margin line, and tape sheets in sequence (A1, A2, A3...).",
  },
];

const faqItems = [
  {
    question: "Should I use Portrait or Landscape orientation for long banners?",
    answer: "Landscape is strongly recommended for wide, narrow banners. It maximizes the horizontal coverage per sheet, minimizing vertical cut seams and speeding up assembly.",
  },
  {
    question: "How do I prevent letter strokes from misaligning across page seams?",
    answer: "Set an overlap of roughly 8–10mm (0.3–0.4 in). Cut only the left border of the right-hand sheet and overlap it directly onto the registration guide of the left-hand sheet.",
  },
  {
    question: "How are pages numbered in multi-page banner prints?",
    answer: "Each page features a clear coordinate header (e.g. A1 for row 1 col 1, A2 for row 1 col 2). Simply line them up in numerical order on a long table or floor.",
  },
];

export default function EnglishPrintBannerLettersPage() {
  return (
    <>
      <HowToJsonLd
        name="How to Print Large Banner Letters & Signs on Standard Paper"
        description="Create wide multi-sheet banners and signs on home printers with exact physical scale and overlap guides."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="en"
        route="bannerGuide"
        kicker="SIGNS & EVENT BANNERS"
        title="Print large banner letters and signs across standard paper sheets."
        lead="Make birthday banners, classroom bulletin board headlines, store announcements, or event backdrops using a regular home or office printer."
      >
        <section>
          <h2>Create huge banner graphics without expensive print shops</h2>
          <p>
            Whether created in Canva, Photoshop, or Word, you can turn any wide banner image into a multi-sheet tiled PDF by specifying the real-world width you want (e.g. 2 meters or 6 feet).
          </p>
          <ul>
            <li><strong>Classrooms & Schools:</strong> Welcome back banners, reading corners, alphabet lines.</li>
            <li><strong>Birthdays & Parties:</strong> Huge custom name signs and celebration garlands.</li>
            <li><strong>Pop-up Shops:</strong> Grand opening signs, discount headers, event booth signs.</li>
            <li><strong>Stages & Backdrops:</strong> Community hall and conference slogan boards.</li>
          </ul>
        </section>

        <section>
          <h2>Three easy steps to a clean banner</h2>
          <ol>
            <li><strong>Enter Real Length:</strong> Put in the total desired width, and TileStencil will compute the matching height and page count automatically.</li>
            <li><strong>Pick Landscape Mode:</strong> Landscape orientation requires fewer sheets and fewer seams for wide banners.</li>
            <li><strong>Trim One Side & Tape:</strong> Trim only the leading edge of each tile and join sequentially from behind.</li>
          </ol>
        </section>

        <section className="guide-faq">
          <h2>Frequently Asked Questions (FAQ)</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </section>

        <aside className="guide-callout">
          <p>Need full 1:1 scale templates for woodworking, sewing, or leathercraft?</p>
          <Link href="/print-pattern-actual-size">See the 1:1 craft pattern printing guide →</Link>
        </aside>

        <Link className="guide-cta" href="/">
          Open TileStencil and print your banner
        </Link>
      </GuideShell>
    </>
  );
}
