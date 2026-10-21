import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { PosterSizesFigure, PrintDialogFigure, SheetAnatomyFigure, TrimTapeFigure } from "@/components/PosterGuideFigures";
import { QuickAnswer } from "@/components/QuickAnswer";
import { TileStencilApp } from "@/components/TileStencilApp";
import { formatLength } from "@/lib/grid";
import { languageAlternates, localizedPath } from "@/lib/locale";
import { DEFAULT_MARGIN_MM, sheetsFor, type SheetCount } from "@/lib/page-count";

const MM_PER_INCH = 25.4;
const inches = (value: number) => value * MM_PER_INCH;
/** Keeps a measurement such as "24 × 36 in" on one line. */
const nb = (text: string) => text.replace(/ /g, "\u00a0");

const usPoster = sheetsFor(inches(24), inches(36), "letter");
const midPoster = sheetsFor(inches(18), inches(24), "letter");
const a1Poster = sheetsFor(594, 841, "a4");
/** 18 × 24 in leaves a thin last row on Letter; an inch less saves it. */
const trimmedPoster = sheetsFor(inches(18), inches(23), "letter");

/** The picture area of a full sheet, between its corner marks, at the default margin. */
const letterPicture = { short: 215.9 - DEFAULT_MARGIN_MM * 2, long: 279.4 - DEFAULT_MARGIN_MM * 2 };
const a4Picture = { short: 210 - DEFAULT_MARGIN_MM * 2, long: 297 - DEFAULT_MARGIN_MM * 2 };

export const metadata: Metadata = {
  title: "How to Print a Big Picture on Multiple Pages",
  description:
    "Print one picture across Letter or A4 sheets: make a numbered PDF, print at 100%, trim and tape. Free tool, sheet counts by poster size, and other methods.",
  keywords: [
    "how to print a big picture on multiple pages",
    "how to print a poster at home",
    "print image on multiple pages",
    "print poster on multiple pages",
    "tile print a picture",
  ],
  alternates: {
    canonical: "/print-image-on-multiple-pages",
    languages: languageAlternates("posterGuide"),
  },
  openGraph: {
    locale: "en_US",
    title: "How to print a big picture on multiple pages",
    description: "Make a numbered PDF, print every sheet at 100%, then trim and tape. Free, in your browser.",
    url: "/print-image-on-multiple-pages",
  },
};

/** Long side of common pictures, for the "how big can it go" table. */
const PICTURES = [
  { name: "Image saved from social media", detail: "1080 px wide", pixels: 1080 },
  { name: "Full HD wallpaper", detail: "1920 × 1080 px", pixels: 1920 },
  { name: "12 MP phone photo", detail: "4032 × 3024 px", pixels: 4032 },
  { name: "24 MP camera photo", detail: "6000 × 4000 px", pixels: 6000 },
  { name: "48 MP phone photo, full resolution", detail: "8064 × 6048 px", pixels: 8064 },
];

function printSide(pixels: number, ppi: number): string {
  const sideIn = pixels / ppi;
  return `${nb(`${Math.round(sideIn)} in`)} ${nb(`(${Math.round(sideIn * 2.54)} cm)`)}`;
}

const POSTER_SIZES = [
  { name: "11 × 17 in", note: "Tabloid", widthMm: inches(11), heightMm: inches(17) },
  { name: "18 × 24 in", note: "Medium poster", widthMm: inches(18), heightMm: inches(24) },
  { name: "24 × 36 in", note: "Large poster", widthMm: inches(24), heightMm: inches(36) },
  { name: "27 × 40 in", note: "Movie poster", widthMm: inches(27), heightMm: inches(40) },
  { name: "A2", note: "42 × 59.4 cm", widthMm: 420, heightMm: 594 },
  { name: "A1", note: "59.4 × 84.1 cm", widthMm: 594, heightMm: 841 },
  { name: "A0", note: "84.1 × 118.9 cm", widthMm: 841, heightMm: 1189 },
];

function SheetCell({ count }: { count: SheetCount }) {
  return (
    <td>
      <strong>{count.sheets}</strong>
      <span className="pg-cell-note">
        {count.columns} × {count.rows} · {count.orientation}
      </span>
    </td>
  );
}

const howToSteps = [
  {
    name: "Check the picture is big enough",
    text: "Divide the picture's width in pixels by the poster's width in inches. About 100 pixels per inch looks sharp from 3 feet away, and 150 at arm's length.",
  },
  {
    name: "Pick the poster size",
    text: `Choose the finished size and the paper. A 24 × 36 in poster takes ${usPoster.sheets} US Letter sheets with the default margin and overlap.`,
  },
  {
    name: "Make the tiled PDF",
    text: "Choose the picture in TileStencil, type the finished width, pick US Letter, A4 or A3 paper, and export the numbered PDF.",
  },
  {
    name: "Print at Actual Size",
    text: "Print every sheet at Actual Size or 100%, never Fit to page, and measure sheet A1 between its corner marks to check.",
  },
  {
    name: "Trim and tape",
    text: "Cut the left and top margins off each sheet along the corner marks, lay each sheet over its neighbor until the picture lines up, and tape the seams from the back.",
  },
];

const faqItems = [
  {
    question: "How many sheets of paper do I need for a poster?",
    answer: `It depends on the size and the paper. With the tool's default margin and overlap, an 18 × 24 in poster takes ${midPoster.sheets} US Letter sheets, a 24 × 36 in poster takes ${usPoster.sheets}, and an A1 poster takes ${a1Poster.sheets} A4 sheets. The tool shows the exact count as you type.`,
  },
  {
    question: "Can I print a picture on multiple pages without Adobe Acrobat?",
    answer: "Yes. The tool on this page makes the tiled PDF in your browser, and Windows Paint and many printer drivers can split a picture too. Any browser can print the PDF at 100%.",
  },
  {
    question: "Does my printer need to print borderless?",
    answer: "No. The PDF keeps a margin your printer can handle, and you trim it off along the corner marks. The overlap hides small trimming errors.",
  },
  {
    question: "What paper is best for a tiled poster?",
    answer: "Plain paper is fine for patterns and stencils. For a picture on the wall, heavier matte paper (28–32 lb, about 105–120 g/m²) stays flatter under ink. Glossy photo paper makes the seams catch the light.",
  },
  {
    question: "Is it free, and is my picture uploaded?",
    answer: "Making and printing the tiled PDF is free, with no account and no watermark. The picture is read and split inside your browser and never uploaded. Only the optional SVG export for cutting machines is paid ($1.99 per image).",
  },
  {
    question: "How is this different from The Rasterbator or Block Posters?",
    answer: "All three split a picture across sheets. The Rasterbator is known for turning the picture into large halftone dots; this tool prints the picture as it is, and you type the finished size in inches or centimeters instead of a number of sheets.",
  },
];

export default function EnglishPrintImageOnMultiplePagesPage() {
  return (
    <>
      <HowToJsonLd
        name="How to print a big picture on multiple pages"
        description="Print one picture as a poster across several sheets of US Letter or A4 paper on a home printer."
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp
        locale="en"
        route="posterGuide"
        intro={{
          eyebrow: "POSTER PRINTING GUIDE",
          heading: "How to print a big picture on multiple pages",
          copy: "Choose your picture below and type how big you want the poster. You get a PDF of numbered pages: print every page at 100% (Actual Size), trim one edge of each sheet, and tape them together from the back.",
          guideLink: { href: "#guide", label: "Step-by-step guide with diagrams ↓" },
        }}
        defaults={{ unit: "in", widthCm: 60.96, heightCm: 91.44, paperSize: "letter", orientation: "landscape" }}
      >
        <article className="app-guide pg-guide" id="guide">
          <QuickAnswer heading="The short version">
            <ol>
              <li>Make a tiled PDF: choose the picture, type the finished size and pick your paper. The tool above does it for free.</li>
              <li>
                Print every page at <strong>Actual Size</strong> or <strong>100%</strong>, never "Fit to page".
              </li>
              <li>Lay the sheets out by name: A1 is the top-left sheet, A2 goes to its right and B1 goes below it.</li>
              <li>Cut the left and top margins off each sheet along the corner marks.</li>
              <li>Lay each sheet over its neighbor until the picture lines up, then tape the seam from the back.</li>
            </ol>
            <p>
              A {nb("24 × 36 in")} poster takes {usPoster.sheets} US Letter sheets; an A1 poster takes {a1Poster.sheets} A4 sheets.
            </p>
          </QuickAnswer>

          <nav className="pg-toc" aria-label="On this page">
            <p className="pg-toc-label" aria-hidden="true">
              ON THIS PAGE
            </p>
            <a href="#what-you-need">What you need</a>
            <a href="#step-1">1 · Check the picture</a>
            <a href="#step-2">2 · Pick the size</a>
            <a href="#step-3">3 · Make the PDF</a>
            <a href="#step-4">4 · Print at 100%</a>
            <a href="#step-5">5 · Trim and tape</a>
            <a href="#other-ways">Other ways</a>
            <a href="#problems">Problems</a>
            <a href="#faq">FAQ</a>
          </nav>

          <section className="pg-section" id="what-you-need" aria-labelledby="what-you-need-title">
            <h2 id="what-you-need-title">What you need</h2>
            <ul className="pg-bullets">
              <li>
                <strong>The picture</strong> as a JPG or PNG: the original file, not a screenshot. Pictures sent through chat apps are
                usually shrunk.
              </li>
              <li>
                <strong>Any home printer</strong> and plain US Letter or A4 paper.
              </li>
              <li>
                <strong>A craft knife, metal ruler and cutting mat</strong>, or a paper trimmer. Scissors work, but the edges wander.
              </li>
              <li>
                <strong>Clear tape</strong> for the back. A glue stick and foam board if you want the poster stiff.
              </li>
            </ul>
          </section>

          <section className="pg-section" id="step-1" aria-labelledby="step-1-title">
            <h2 id="step-1-title">Step 1: Check the picture is big enough</h2>
            <p>
              Printing bigger doesn't add detail; the same pixels get spread over more paper. Divide the picture's width in pixels by
              the poster's width in inches to get pixels per inch (ppi). About 100 ppi looks sharp from 3 feet away, which is how most
              wall posters are seen, and 150 ppi still looks sharp at arm's length.
            </p>
            <div className="pg-table-wrap">
              <table className="pg-table pg-table-figures">
                <caption>Longest poster side for common pictures</caption>
                <thead>
                  <tr>
                    <th scope="col">Picture</th>
                    <th scope="col">
                      Sharp from 2 ft<span className="pg-cell-note">150 ppi</span>
                    </th>
                    <th scope="col">
                      Sharp from 3 ft<span className="pg-cell-note">100 ppi</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PICTURES.map((picture) => (
                    <tr key={picture.name}>
                      <th scope="row">
                        {picture.name}
                        <span className="pg-cell-note">{picture.detail}</span>
                      </th>
                      <td>{printSide(picture.pixels, 150)}</td>
                      <td>{printSide(picture.pixels, 100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Text and line art show soft edges sooner than photos, so hold them to the 150 ppi column. If the picture is too small for
              the size you want, find a bigger original rather than enlarging it in an app.
            </p>
          </section>

          <section className="pg-section" id="step-2" aria-labelledby="step-2-title">
            <h2 id="step-2-title">Step 2: Pick the size, and see how many sheets it takes</h2>
            <p>
              Every extra sheet is another seam to line up, so pick the smallest size that works on your wall. These counts use the
              tool's default margin (8 mm, about 5/16 in) and overlap (5 mm, about 3/16 in), with the sheets turned whichever way needs
              fewer.
            </p>
            <PosterSizesFigure />
            <div className="pg-table-wrap">
              <table className="pg-table pg-table-figures">
                <caption>Sheets for common poster sizes</caption>
                <thead>
                  <tr>
                    <th scope="col">Poster size</th>
                    <th scope="col">US Letter sheets</th>
                    <th scope="col">A4 sheets</th>
                  </tr>
                </thead>
                <tbody>
                  {POSTER_SIZES.map((size) => (
                    <tr key={size.name}>
                      <th scope="row">
                        {size.name}
                        <span className="pg-cell-note">{size.note}</span>
                      </th>
                      <SheetCell count={sheetsFor(size.widthMm, size.heightMm, "letter")} />
                      <SheetCell count={sheetsFor(size.widthMm, size.heightMm, "a4")} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pg-note">
              Layout is sheets across × down. A3 paper roughly halves the count if your printer takes it, and the tool shows the exact
              number as you type.
            </p>
            <p>
              Check the preview before you export: if the last row or column only holds a thin strip of picture, a slightly smaller
              poster saves the whole row. An {nb("18 × 24 in")} poster takes {midPoster.sheets} US Letter sheets; at {nb("18 × 23 in")} it
              takes {trimmedPoster.sheets}.
            </p>
          </section>

          <section className="pg-section" id="step-3" aria-labelledby="step-3-title">
            <h2 id="step-3-title">Step 3: Make the tiled PDF</h2>
            <ol className="pg-list">
              <li>
                Choose your picture in the <a href="#workspace">tool at the top of this page</a>, or drag it in. It stays on your
                computer; nothing is uploaded.
              </li>
              <li>Type the finished width. The height follows the picture's shape.</li>
              <li>
                Pick the paper you'll print on (US Letter, A4 or A3) and try both portrait and landscape: the page count updates as you
                go.
              </li>
              <li>
                Leave the margin as it is unless your printer cuts off more than that, and keep the overlap. It is the strip you line the
                sheets up with.
              </li>
              <li>
                Click <strong>Export tiled PDF</strong>.
              </li>
            </ol>
            <p>Every sheet tells you where it goes:</p>
            <SheetAnatomyFigure sheetCount={usPoster.sheets} />
          </section>

          <section className="pg-section" id="step-4" aria-labelledby="step-4-title">
            <h2 id="step-4-title">Step 4: Print every sheet at Actual Size (100%)</h2>
            <p>
              This is the step that ruins most tiled posters. If the print dialog fits the PDF to the page, every sheet shrinks a
              little: the poster comes out smaller and the seams stop lining up. Choose <strong>Actual size</strong> or{" "}
              <strong>100%</strong>, and check that the paper size matches the PDF.
            </p>
            <PrintDialogFigure />
            <dl className="pg-where">
              <div className="pg-where-item">
                <dt>Adobe Acrobat Reader</dt>
                <dd>
                  Page Sizing &amp; Handling → <strong>Actual size</strong>
                </dd>
              </div>
              <div className="pg-where-item">
                <dt>Chrome and Edge</dt>
                <dd>
                  More settings → Scale → <strong>Actual size</strong>, or Custom at 100
                </dd>
              </div>
              <div className="pg-where-item">
                <dt>Mac Preview</dt>
                <dd>
                  Scale → <strong>100%</strong>
                </dd>
              </div>
              <div className="pg-where-item">
                <dt>Your printer's own settings</dt>
                <dd>Turn off "Fit to page", borderless and poster options, so the printer doesn't scale it again.</dd>
              </div>
            </dl>
            <p>
              Print sheet A1 first and measure between its corner marks. With the default margin, the picture on a full US Letter sheet
              is {nb(`${formatLength(letterPicture.short, "in").replace(/ in$/, "")} × ${formatLength(letterPicture.long, "in")}`)}{" "}
              {nb(`(${letterPicture.short.toFixed(1)} × ${letterPicture.long.toFixed(1)} mm)`)}, and on A4 it is{" "}
              {nb(`${a4Picture.short} × ${a4Picture.long} mm`)}. If yours is smaller, something is still scaling it.
            </p>
          </section>

          <section className="pg-section" id="step-5" aria-labelledby="step-5-title">
            <h2 id="step-5-title">Step 5: Trim and tape the sheets together</h2>
            <div className="pg-split">
              <TrimTapeFigure />
              <ol className="pg-list">
                <li>Lay the sheets face up in order: row A across the top (A1, A2, A3…), row B under it.</li>
                <li>
                  Cut the left margin off every sheet except those in column 1, cutting along the corner marks. Then cut the top margin
                  off every sheet except those in row A.
                </li>
                <li>
                  Join each row first. Lay A2 over A1 so its cut edge sits 5 mm (about 3/16 in) inside A1's corner marks, nudge it until
                  the picture runs straight across, and tape the seam on the back. Carry on with A3.
                </li>
                <li>Join the rows the same way: lay row B over row A, line up the picture, and tape.</li>
                <li>Trim the white border around the outside last, if you want the picture to run to the edge.</li>
              </ol>
            </div>
            <h3>Tips for clean seams</h3>
            <ul className="pg-bullets">
              <li>A sharp blade and a metal ruler give a straighter edge than scissors. Change the blade as soon as it starts to drag.</li>
              <li>Tape short pieces across the seam first, then one long strip along it.</li>
              <li>For a stiff poster, glue it to foam board one sheet at a time with a glue stick, starting from A1.</li>
            </ul>
          </section>

          <section className="pg-section" id="other-ways" aria-labelledby="other-ways-title">
            <h2 id="other-ways-title">Other ways to print a picture on multiple pages</h2>
            <p>
              You don't need a website for this. Windows, Adobe Acrobat Reader and many printer drivers can split a picture across pages
              too. They are close at hand, but give you less say over the final size.
            </p>
            <div className="pg-table-wrap">
              <table className="pg-table pg-table-stack">
                <caption>Ways to split one picture across sheets</caption>
                <thead>
                  <tr>
                    <th scope="col">Method</th>
                    <th scope="col">How you set the size</th>
                    <th scope="col">Overlap and sheet names</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      This page<span className="pg-cell-note">Any browser</span>
                    </th>
                    <td data-label="Size">Exact size, in inches or cm</td>
                    <td data-label="Overlap and names">Yes</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Windows Paint<span className="pg-cell-note">Windows 10 and 11</span>
                    </th>
                    <td data-label="Size">Pages across and down</td>
                    <td data-label="Overlap and names">No</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Acrobat Reader's Poster option<span className="pg-cell-note">Windows and Mac, PDFs only</span>
                    </th>
                    <td data-label="Size">Percentage of the page</td>
                    <td data-label="Overlap and names">Yes</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Printer's poster mode<span className="pg-cell-note">Windows, some printers</span>
                    </th>
                    <td data-label="Size">Fixed grids: 2 × 2, 3 × 3…</td>
                    <td data-label="Overlap and names">Some printers</td>
                  </tr>
                  <tr>
                    <th scope="row">Mac Preview, Word, Google Docs, Canva</th>
                    <td colSpan={2}>Can't split one picture across sheets</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Windows Paint</h3>
            <ol className="pg-list">
              <li>
                Right-click the picture and choose <strong>Open with → Paint</strong>.
              </li>
              <li>
                Go to <strong>File → Print → Page setup</strong>.
              </li>
              <li>Choose your paper size and orientation.</li>
              <li>
                Under <strong>Scaling</strong>, choose <strong>Fit to</strong> and enter how many pages across and down. 2 by 2 gives four
                sheets.
              </li>
              <li>Click OK, then print.</li>
            </ol>
            <p>
              Paint adds no overlap, sheet names or cut marks, and the printer's margins leave a white strip on every sheet to cut away,
              so the poster ends up a little smaller than the grid suggests.
            </p>

            <h3>Adobe Acrobat Reader's Poster option</h3>
            <ol className="pg-list">
              <li>
                Save the picture as a PDF first. On Windows, print it to <strong>Microsoft Print to PDF</strong>; on a Mac, open it in
                Preview and choose <strong>File → Export as PDF</strong>.
              </li>
              <li>Open the PDF in Acrobat Reader and press Ctrl+P (Cmd+P on a Mac).</li>
              <li>
                Under <strong>Page Sizing &amp; Handling</strong>, click <strong>Poster</strong>.
              </li>
              <li>
                Raise <strong>Tile Scale</strong> until the preview covers the number of sheets you want, set the{" "}
                <strong>Overlap</strong>, and tick <strong>Cut marks</strong> and <strong>Labels</strong>.
              </li>
            </ol>
            <p>
              If nothing tiles, untick <strong>Tile only large pages</strong>. The size is a percentage of the PDF page rather than
              inches, so an exact size takes some trial and error. There is a longer comparison in{" "}
              <Link href={localizedPath("en", "acrobatAlternative")}>printing posters without Acrobat</Link>.
            </p>

            <h3>Your printer's poster mode</h3>
            <p>
              Many Windows printer drivers have one under <strong>Printing preferences</strong>:
            </p>
            <ul className="pg-bullets">
              <li>
                <strong>Canon:</strong> Page Setup → Page Layout → Poster. Click Specify to change the 2 × 2 grid.
              </li>
              <li>
                <strong>Epson:</strong> Page Layout → Multi-Page → Poster Printing, in 2 × 1, 2 × 2, 3 × 3 or 4 × 4.
              </li>
              <li>
                <strong>Brother:</strong> Basic → Multiple Page → 1 in 2x2 Pages. Some models go up to 5x5.
              </li>
              <li>
                <strong>HP:</strong> some drivers have poster or tiling options under Layout or Advanced; many recent models don't.
              </li>
            </ul>
            <p>
              You only get the fixed grids, so the poster is whatever size the grid makes, and these options are usually missing on a
              Mac.
            </p>

            <h3>Mac Preview, Word, Google Docs and Canva</h3>
            <p>
              None of them can split one picture across sheets: anything bigger than the page is cropped or shrunk to fit. Save the
              picture or design as a PNG or JPG first (in Canva: <strong>Share → Download</strong>), then use the tool above or
              Acrobat's Poster option. Microsoft Publisher used to have a poster option, but Microsoft retired Publisher and removed it
              from Microsoft 365 on October 13, 2026.
            </p>
          </section>

          <section className="pg-section" id="problems" aria-labelledby="problems-title">
            <h2 id="problems-title">When the poster comes out wrong</h2>
            <dl className="pg-problems">
              <div className="pg-problem">
                <dt>Smaller than the size you typed</dt>
                <dd>
                  Something is scaling it. Choose Actual size or 100%, turn off any "fit" option in the printer's own settings, and
                  measure sheet A1 between its corner marks.
                </dd>
              </div>
              <div className="pg-problem">
                <dt>White lines or steps at the seams</dt>
                <dd>
                  A margin wasn't trimmed right up to the corner marks, or the sheets were matched by their paper edges. Match the
                  repeated strip of picture instead.
                </dd>
              </div>
              <div className="pg-problem">
                <dt>Edges of the picture missing</dt>
                <dd>
                  Your printer can't print as close to the edge as the margin you set. Make the margin 10 mm (0.4 in) and export again.
                </dd>
              </div>
              <div className="pg-problem">
                <dt>Sheets don't match in color</dt>
                <dd>Print all the sheets in one go on the same paper, and turn off photo enhancement or auto-fix in the printer settings.</dd>
              </div>
              <div className="pg-problem">
                <dt>Paper wavy or curled</dt>
                <dd>
                  Plain paper soaks up heavy ink. Use 28–32 lb (105–120 g/m²) or matte paper, and let the sheets dry flat before taping.
                </dd>
              </div>
              <div className="pg-problem">
                <dt>Blurry or blocky</dt>
                <dd>
                  The picture has too few pixels for that size. Check the table in <a href="#step-1">step 1</a> and use the original
                  file.
                </dd>
              </div>
            </dl>
          </section>

          <section className="pg-section" id="home-or-shop" aria-labelledby="home-or-shop-title">
            <h2 id="home-or-shop-title">Print at home or at a print shop?</h2>
            <p>
              A tiled print costs some paper and ink and is ready in minutes, but the seams stay visible up close. If the poster is going
              in a frame or on show at an event, a print shop or online poster service will print it on one sheet with no seams. Tiling
              at home is at its best for things you will trace, cut or paint over, like{" "}
              <Link href={localizedPath("en", "patternGuide")}>sewing patterns</Link> and{" "}
              <Link href={localizedPath("en", "stencilGuide")}>wall stencils</Link>, and for trying a size on the wall before you order
              the real print.
            </p>
          </section>

          <section className="pg-section" id="faq" aria-labelledby="faq-title">
            <h2 id="faq-title">Frequently asked questions</h2>
            {faqItems.map((item) => (
              <div className="guide-faq-item" key={item.question}>
                <h3 className="guide-faq-question">{item.question}</h3>
                <p className="guide-faq-answer">{item.answer}</p>
              </div>
            ))}
          </section>
        </article>
      </TileStencilApp>
    </>
  );
}
