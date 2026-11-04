import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { GingerbreadHouseApp } from "@/components/GingerbreadHouseApp";
import { QuickAnswer } from "@/components/QuickAnswer";
import { languageAlternates, localizedPath } from "@/lib/locale";

const TITLE = "Free Gingerbread House Template – Printable PDF in Any Size";
const DESCRIPTION =
  "Free printable gingerbread house template: front, side walls and roof at actual size on US Letter or A4. Classic 6 × 8 in, Small, Large or any size.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "gingerbread house template",
    "gingerbread house template printable",
    "free gingerbread house template",
    "gingerbread house template pdf",
    "cardboard gingerbread house template",
    "gingerbread house pattern",
    "gingerbread house dimensions",
  ],
  alternates: {
    canonical: "/gingerbread-house-template",
    languages: languageAlternates("gingerbreadHouse"),
  },
  openGraph: {
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    url: "/gingerbread-house-template",
  },
};

const howToSteps = [
  {
    name: "Print the template at actual size",
    text: "Pick a size, your paper and gingerbread or cardboard, download the PDF and print it at 100% (Actual Size). Measure the 1 inch square on the roof piece, then cut the paper pieces out.",
  },
  {
    name: "Roll and cut the dough",
    text: "Roll the dough 1/4 inch (6 mm) thick straight onto parchment. Lay each paper piece on top and cut around it with a sharp knife, twice for every piece. Cut the door and windows now if you want them.",
  },
  {
    name: "Chill, bake and trim",
    text: "Chill the cut pieces for 15 minutes so they keep their shape, then bake at 350°F (175°C) until the edges are firm, about 12 to 15 minutes. While they are still warm, lay the template back on and trim any edges that spread.",
  },
  {
    name: "Build the walls",
    text: "Once the pieces are completely cool, pipe thick royal icing along the edges. Stand the front and back up and set the two side walls between them, so the side walls sit inside. Prop them with cans and let them set for at least an hour.",
  },
  {
    name: "Add the roof and decorate",
    text: "Pipe icing along the top of the walls and the gable edges, press both roof panels on so they meet at the peak, and hold them for a minute. Let the house set for a few hours before adding candy.",
  },
];

const faqItems = [
  {
    question: "What size should a gingerbread house be?",
    answer:
      "A Classic house about 6 inches wide and 8 inches deep, with 4 1/2 inch walls and a peak 8 inches high, is a good first build: big enough to decorate and it bakes on two half-sheet pans. The Small house (4 × 5 in) suits children or a set of mini houses, and the Large (7 1/2 × 9 in, 9 1/2 inch peak) makes a centrepiece. Choose Custom to type your own width, depth, wall height and roof height.",
  },
  {
    question: "How thick should gingerbread be for a house?",
    answer:
      "Roll construction gingerbread about 1/4 inch (6 mm) thick. Thinner pieces break when you stand them up, and much thicker pieces spread and bake unevenly. The template allows for 1/4 inch dough: the side walls are cut half an inch shorter than the depth of the house, so they fit between the front and back.",
  },
  {
    question: "How do I print the template at the right size?",
    answer:
      "Print at 100% or Actual Size, not Fit to page. The roof piece has a 1 inch square and a 5 cm bar; measure one before cutting dough. On all three ready-made sizes every piece fits on one sheet, so there is nothing to tape. Bigger custom houses split the largest pieces across sheets with corner marks for lining them up.",
  },
  {
    question: "How much dough do I need?",
    answer:
      "The Small house uses about 115 square inches of rolled dough (one 13 × 18 inch pan), the Classic about 235 square inches (two pans) and the Large about 325 square inches (three pans), counting two of every piece. Leave an inch between pieces on the pan because gingerbread spreads a little. The tool shows the number of pans for any custom size.",
  },
  {
    question: "Can I make the house from cardboard?",
    answer:
      "Yes. Choose Cardboard and the side walls are adjusted for 1/8 inch board, such as cereal boxes or thin corrugated card. Trace the pieces onto the board, cut them with a craft knife and glue them with a hot glue gun. A cardboard house can be painted, covered in brown paper, or used as a frame for graham crackers.",
  },
  {
    question: "Do I have to cut out the door and windows?",
    answer:
      "No. They are dashed on the template because they are optional; switch off Door and windows for plain walls. If you cut them, keep the door piece and bake it too, then stand it open with icing.",
  },
];

const presets = [
  { name: "Small", footprint: "4 × 5 in", walls: "3 1/2 in", peak: "6 in", sheets: "1 sheet", pans: "1 pan" },
  { name: "Classic", footprint: "6 × 8 in", walls: "4 1/2 in", peak: "8 in", sheets: "3 sheets", pans: "2 pans" },
  { name: "Large", footprint: "7 1/2 × 9 in", walls: "5 1/2 in", peak: "9 1/2 in", sheets: "3 sheets", pans: "3 pans" },
];

export default function GingerbreadHouseTemplatePage() {
  return (
    <>
      <HowToJsonLd
        name="How to make a gingerbread house from a free printable template"
        description="Print the gingerbread house template at actual size, cut each piece twice from 1/4 inch dough, bake and trim, then build the walls and roof with royal icing."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GingerbreadHouseApp>
        <article className="app-guide">
          <QuickAnswer heading="Free gingerbread house template">
            <p>
              This free gingerbread house template prints at actual size on a home printer, on US Letter or A4. No sign-up. It has three pieces, each cut
              twice: the front and back with the gable, the side walls, and the roof.
            </p>
            <p>
              The Classic house is 6 × 8 inches with 4 1/2 inch walls and an 8 inch peak; its three pieces print on three sheets with no taping. The Small
              (4 × 5 in) fits on one sheet and the Large (7 1/2 × 9 in) on three. Or type your own size, and the template is drawn to match.
            </p>
            <p>The side walls are cut shorter by the thickness of the dough (1/4 in) or cardboard (1/8 in), so the corners close without gaps.</p>
          </QuickAnswer>

          <section>
            <h2>Gingerbread house sizes</h2>
            <div className="pg-table-wrap">
              <table className="pg-table pg-table-figures gb-size-table">
                <thead>
                  <tr>
                    <th scope="col">Size</th>
                    <th scope="col">Footprint</th>
                    <th scope="col">Walls</th>
                    <th scope="col">Peak</th>
                    <th scope="col">Prints on</th>
                    <th scope="col">Dough</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((row) => (
                    <tr key={row.name}>
                      <th scope="row">{row.name}</th>
                      <td data-label="Footprint">{row.footprint}</td>
                      <td data-label="Walls">{row.walls}</td>
                      <td data-label="Peak">{row.peak}</td>
                      <td data-label="Prints on">{row.sheets}</td>
                      <td data-label="Dough">{row.pans}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              The sheet counts are the same on US Letter and A4, and no size needs taping. Pans are 13 × 18 inch half-sheet pans. The roof overhangs
              every wall by 1/2 inch.
            </p>
          </section>

          <section>
            <h2>How to make the gingerbread house</h2>
            <ol>
              {howToSteps.map((step) => (
                <li key={step.name}>
                  <b>{step.name}.</b> {step.text}
                </li>
              ))}
            </ol>
            <p>
              Decorate the walls and roof panels while they are still flat if you can: piping windows, shingles and icicles is much easier before the house
              stands up.
            </p>
          </section>

          <section>
            <h2>Cardboard gingerbread house</h2>
            <p>
              For a house that lasts every year, or a classroom project without baking, choose Cardboard. The template allows for 1/8 inch board. Trace the
              pieces onto cereal-box card or thin corrugated cardboard, cut with a craft knife on a mat, and join the walls with hot glue before adding the
              roof. Paint it brown, or glue on graham crackers and decorate with icing as usual.
            </p>
            <p>
              Want a giant house for a display window or a yard? Type a custom size of up to 24 inches wide; the larger pieces are split across sheets that
              you tape together. To enlarge any other design, see{" "}
              <Link href={localizedPath("en", "patternGuide")}>how to print a pattern at actual size</Link>.
            </p>
          </section>

          <h2>Frequently asked questions</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </article>
      </GingerbreadHouseApp>
    </>
  );
}
