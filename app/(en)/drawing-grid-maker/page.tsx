import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { GridDrawingApp } from "@/components/GridDrawingApp";
import { QuickAnswer } from "@/components/QuickAnswer";
import { languageAlternates, localizedPath } from "@/lib/locale";

const TITLE = "Drawing Grid Maker – Add a Grid to Any Photo, Free";
const DESCRIPTION =
  "Add a numbered drawing grid to any photo for the grid method, and see how big to draw each square on your paper, canvas or wall. Free PNG or PDF, no upload.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "drawing grid maker",
    "grid maker",
    "grid drawing",
    "grid for drawing",
    "drawing grid",
    "add grid to image",
    "grid overlay",
    "grid method drawing",
    "grid generator",
  ],
  alternates: {
    canonical: "/drawing-grid-maker",
    languages: languageAlternates("gridDrawing"),
  },
  openGraph: {
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
    url: "/drawing-grid-maker",
  },
};

const howToSteps = [
  {
    name: "Choose a reference photo",
    text: "Pick the photo you want to copy. It is drawn on the page in your browser and never uploaded.",
  },
  {
    name: "Set the number of squares",
    text: "Choose how many squares go across: 6 to 8 for a first drawing, 10 or more for faces and fine detail. Rows follow from the photo's height so every square is the same shape.",
  },
  {
    name: "Enter the size of your surface",
    text: "Type the width and height of your paper, canvas or wall. The grid maker tells you how many squares to draw and how big each one is, rounded to a size a ruler can mark.",
  },
  {
    name: "Draw the grid and copy square by square",
    text: "Rule the grid lightly on your surface, then copy what is in each square of the photo into the same square of your drawing. Erase the lines when you finish.",
  },
];

const faqItems = [
  {
    question: "What is the grid method in drawing?",
    answer:
      "You cover a reference photo with a grid of squares and draw the same number of squares on your paper or canvas. Then you copy the picture one square at a time, which keeps proportions right because each small square is easy to judge on its own. Painters have used grids to scale up drawings since the Renaissance, and mural painters still do.",
  },
  {
    question: "How do I add a grid to a photo?",
    answer:
      "Open this page, choose your photo, and set how many squares go across. The grid appears on the photo straight away, with the squares named A1, A2, B1 and so on. Download it as a PNG to keep on your phone or tablet, or print it on one page. It works the same on a phone, and the photo never leaves your device.",
  },
  {
    question: "How big should the squares be on my canvas?",
    answer:
      "Divide the width of your canvas by the number of squares across. A 16-inch-wide canvas with 8 squares across needs 2-inch squares. If the photo is a different shape from the canvas, the height may run out first; the grid maker checks both sides, picks the size that fits, and rounds it down to a size you can measure.",
  },
  {
    question: "Can I print the grid?",
    answer:
      "Yes. Print the photo with its grid on one US Letter or A4 page, or print the empty grid at the full size of your drawing across several pages. Tape the pages together with the corner marks and trace the lines, or lay it under thin paper.",
  },
  {
    question: "Is using a grid cheating?",
    answer:
      "No. A grid only helps you place shapes; you still decide every line, value and colour. It is a standard technique in art classes and for murals, and many artists drop it once their eye for proportions improves.",
  },
  {
    question: "Is my photo uploaded?",
    answer: "No. The photo is read and drawn by your browser on this page, and the PNG and PDF files are made on your device.",
  },
];

export default function DrawingGridMakerPage() {
  return (
    <>
      <HowToJsonLd
        name="How to draw a picture with the grid method"
        description="Add a grid to a reference photo, draw the same grid at the right size on your surface, and copy the picture square by square."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GridDrawingApp>
        <article className="app-guide">
          <QuickAnswer heading="How to draw with a grid">
            <p>
              Choose your reference photo and pick how many squares go across: 6 to 8 for a first drawing, more for faces. The grid maker draws the
              squares on the photo and names them A1, A2, B1 and so on.
            </p>
            <p>
              Enter the size of your paper, canvas or wall. You get the number of squares to draw and the size of each one, rounded to what a ruler
              can mark, so the whole grid fits.
            </p>
            <p>
              Rule that grid lightly in pencil, then copy what you see in each square of the photo into the same square of your drawing. Erase the
              lines when you finish.
            </p>
          </QuickAnswer>

          <section>
            <h2>How many squares to use</h2>
            <ul>
              <li>
                <b>4 to 6 across</b> for landscapes, still lifes and simple shapes. Big squares are quick to draw and leave room to work freely.
              </li>
              <li>
                <b>8 to 12 across</b> for portraits and pets. Faces need smaller squares around the eyes and mouth, where a small slip shows.
              </li>
              <li>
                <b>15 or more</b> for very detailed work or a large wall. Diagonal lines are an alternative: they add guide points inside each square
                without making the grid finer.
              </li>
            </ul>
          </section>

          <section>
            <h2>Getting the grid onto your surface</h2>
            <ul>
              <li>
                <b>Paper:</b> rule the squares lightly with a hard pencil, or print the empty grid at full size and lay it under thin paper on a
                window or light box.
              </li>
              <li>
                <b>Canvas:</b> mark the square size along all four edges, join the marks with a long ruler, and keep the lines faint. Pencil or
                watercolour pencil disappears under paint.
              </li>
              <li>
                <b>Walls and murals:</b> enter the wall size in the grid maker, then snap the lines with a chalk line or draw them along a level. Big
                squares, such as one foot or 30 cm, are fine for a wall.
              </li>
            </ul>
            <p>
              Want to trace the picture instead of drawing it freehand? Print the photo itself at full size with the{" "}
              <Link href={localizedPath("en", "posterGuide")}>multi-page poster printer</Link>, or turn it into a{" "}
              <Link href={localizedPath("en", "stencilGuide")}>wall stencil</Link>.
            </p>
          </section>

          <section>
            <h2>Tips for an accurate copy</h2>
            <ul>
              <li>Work one square at a time and look at where each line enters and leaves the square.</li>
              <li>Keep the square names on both the photo and the drawing, so you never copy into the wrong square.</li>
              <li>Switch the photo to black and white to judge light and dark before you think about colour.</li>
              <li>Turn the photo and the drawing upside down now and then. You see shapes instead of things, which keeps you honest.</li>
            </ul>
          </section>

          <h2>Frequently asked questions</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </article>
      </GridDrawingApp>
    </>
  );
}
