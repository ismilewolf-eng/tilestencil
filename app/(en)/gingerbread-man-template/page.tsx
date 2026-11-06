import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd } from "@/components/JsonLd";
import { GingerbreadManApp } from "@/components/GingerbreadManApp";
import { QuickAnswer } from "@/components/QuickAnswer";
import { languageAlternates, localizedPath } from "@/lib/locale";

const TITLE = "Free Gingerbread Man Template – Printable in Any Size, Up to Life-Size";
const DESCRIPTION =
  "Free printable gingerbread man template: 4 in cookie, 7 in craft, 14 in poster, 3 ft door or any size, with or without face and buttons. US Letter or A4.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "gingerbread man template",
    "gingerbread man template printable",
    "gingerbread man outline",
    "large gingerbread man template",
    "life size gingerbread man template",
    "gingerbread man cookie template",
    "gingerbread man cut out",
  ],
  alternates: {
    canonical: "/gingerbread-man-template",
    languages: languageAlternates("gingerbreadMan"),
  },
  openGraph: {
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    url: "/gingerbread-man-template",
  },
};

const faqItems = [
  {
    question: "What size gingerbread man template should I print?",
    answer:
      "For cookies, 4 inches tall is a classic size that fits four to a sheet. A 7 inch figure fills a page and suits paper crafts, felt ornaments and coloring. For bulletin boards, 14 inches is easy to see across a classroom, and a 3 foot gingerbread man covers most of a classroom door. Choose Custom for any height from 2 inches to 6 feet.",
  },
  {
    question: "How do I print a big gingerbread man for a door or wall?",
    answer:
      "Choose Door or type a custom height, then download the PDF and print it at 100% (Actual Size). The figure is split across numbered sheets with corner marks; trim each sheet on the marks, overlap the edges and tape them together in order. A 3 foot figure takes 14 US Letter sheets. Trace it onto brown kraft paper or poster board and cut it out.",
  },
  {
    question: "Can I use the template to cut gingerbread cookies?",
    answer:
      "Yes. Print the 4 inch size, cut one figure out of card stock and lay it on the rolled dough, then cut around it with a small sharp knife. Chill the cut cookies for 10 minutes before baking so the arms and legs keep their shape. Choose the outline without face and buttons if you want to pipe your own.",
  },
  {
    question: "Is there a version without the face and buttons?",
    answer:
      "Yes. Untick Face and buttons to print a plain outline, which works better for kids to decorate, for tracing onto fabric or felt, and for cookie templates.",
  },
  {
    question: "How do I check that it printed at the right size?",
    answer:
      "Every PDF has a 1 inch square and a 5 cm bar. Measure one after printing. If it is smaller, the printer was set to Fit to page or Shrink; change the scale to 100% or Actual Size and print again.",
  },
];

export default function GingerbreadManTemplatePage() {
  return (
    <>
      <FaqJsonLd items={faqItems} />
      <GingerbreadManApp>
        <article className="app-guide">
          <QuickAnswer heading="Free gingerbread man template">
            <p>
              This free gingerbread man template prints on a home printer, on US Letter or A4, at the size you choose. No sign-up. Four 4 inch figures fit
              on one sheet; a 7 inch figure fills a page.
            </p>
            <p>
              Bigger sizes, such as 14 inches for a bulletin board or 3 feet for a classroom door, print across several sheets at actual size so you can
              tape them together. Print it with a face and three buttons, or as a plain outline to decorate.
            </p>
          </QuickAnswer>

          <section>
            <h2>Gingerbread man sizes</h2>
            <div className="pg-table-wrap">
              <table className="pg-table pg-table-figures">
                <thead>
                  <tr>
                    <th scope="col">Size</th>
                    <th scope="col">Height</th>
                    <th scope="col">US Letter</th>
                    <th scope="col">Good for</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Cookie</th>
                    <td data-label="Height">4 in (10 cm)</td>
                    <td data-label="US Letter">4 per sheet</td>
                    <td data-label="Good for">Cookie templates, gift tags, garlands</td>
                  </tr>
                  <tr>
                    <th scope="row">Craft</th>
                    <td data-label="Height">7 in (18 cm)</td>
                    <td data-label="US Letter">1 per sheet</td>
                    <td data-label="Good for">Coloring, felt ornaments, paper dolls</td>
                  </tr>
                  <tr>
                    <th scope="row">Poster</th>
                    <td data-label="Height">14 in (36 cm)</td>
                    <td data-label="US Letter">3 sheets</td>
                    <td data-label="Good for">Bulletin boards, window displays</td>
                  </tr>
                  <tr>
                    <th scope="row">Door</th>
                    <td data-label="Height">3 ft (91 cm)</td>
                    <td data-label="US Letter">14 sheets</td>
                    <td data-label="Good for">Classroom doors, walls, yard cutouts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Ideas for the template</h2>
            <ul>
              <li>
                <b>Classroom door:</b> print the 3 foot size, trace it onto brown kraft paper and let the class add buttons, icing and their names, or
                make one small figure per student with the 7 inch size.
              </li>
              <li>
                <b>Gingerbread man story:</b> print a sheet of 4 inch figures for retelling the story, and hide them around the school for a gingerbread
                hunt.
              </li>
              <li>
                <b>Felt ornaments:</b> cut two layers of brown felt from the 4 or 7 inch outline, stitch around the edge with white thread and stuff
                lightly.
              </li>
              <li>
                <b>Yard and porch decorations:</b> print a custom size of up to 6 feet, transfer it to plywood with carbon paper and cut it with a
                jigsaw.
              </li>
            </ul>
            <p>
              Making a whole gingerbread scene? The <Link href={localizedPath("en", "gingerbreadHouse")}>gingerbread house template</Link> prints the walls
              and roof at any size, and the <Link href={localizedPath("en", "christmasStencils")}>free Christmas stencils</Link> include a gingerbread man
              stencil with bridges for painting.
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
      </GingerbreadManApp>
    </>
  );
}
