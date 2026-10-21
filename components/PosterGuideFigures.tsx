/**
 * Diagrams for the poster printing guide (/print-image-on-multiple-pages). Plain SVG drawn from the
 * same tile geometry the tool exports, so sheet counts and layouts match the real PDF. Colours and
 * type come from the pg-* classes in globals.css; text sizes are in viewBox units.
 */
import { calculateTilePlan, type TilePlan } from "@/lib/geometry";
import { DEFAULT_MARGIN_MM, DEFAULT_OVERLAP_MM, sheetsFor } from "@/lib/page-count";

const MM_PER_INCH = 25.4;

/** The plan the guide quotes: the tool's default margin and overlap, in whichever orientation needs fewer sheets. */
export function bestPlan(widthMm: number, heightMm: number, paperSize: "letter" | "a4"): TilePlan {
  const { orientation } = sheetsFor(widthMm, heightMm, paperSize);
  return calculateTilePlan({
    targetWidthMm: widthMm,
    targetHeightMm: heightMm,
    paperSize,
    orientation,
    marginMm: DEFAULT_MARGIN_MM,
    overlapMm: DEFAULT_OVERLAP_MM,
  });
}

/* ---------- Poster sizes to scale ---------- */

const UNITS_PER_INCH = 6;
const POSTER_INCHES = [
  { size: "11 × 17", widthIn: 11, heightIn: 17 },
  { size: "18 × 24", widthIn: 18, heightIn: 24 },
  { size: "24 × 36", widthIn: 24, heightIn: 36 },
];

type Placed = { size: string; widthIn: number; heightIn: number; left: number; baseline: number };

function SizeLabels({ x, baseline, size, count, narrow }: { x: number; baseline: number; size: string; count: string; narrow: boolean }) {
  return (
    <>
      <text className={narrow ? "pg-size pg-size-sm" : "pg-size"} x={x} y={baseline + (narrow ? 26 : 30)} textAnchor="middle">
        {size}
      </text>
      <text className={narrow ? "pg-count pg-count-sm" : "pg-count"} x={x} y={baseline + (narrow ? 48 : 56)} textAnchor="middle">
        {count}
      </text>
    </>
  );
}

/** One poster to scale, split into the sheets it takes, with its size and sheet count underneath. */
function ScaledPoster({ poster, narrow }: { poster: Placed; narrow: boolean }) {
  const scale = UNITS_PER_INCH / MM_PER_INCH;
  const width = poster.widthIn * UNITS_PER_INCH;
  const height = poster.heightIn * UNITS_PER_INCH;
  const top = poster.baseline - height;
  const plan = bestPlan(poster.widthIn * MM_PER_INCH, poster.heightIn * MM_PER_INCH, "letter");
  return (
    <g>
      {plan.tiles.map((tile) => (
        <rect
          key={tile.label}
          className={(tile.row + tile.column) % 2 ? "pg-tile pg-tile-alt" : "pg-tile"}
          x={poster.left + tile.xMm * scale}
          y={top + tile.yMm * scale}
          width={tile.widthMm * scale}
          height={tile.heightMm * scale}
        />
      ))}
      <rect className="pg-poster-edge" x={poster.left} y={top} width={width} height={height} />
      <SizeLabels x={poster.left + width / 2} baseline={poster.baseline} size={poster.size} count={`${plan.tiles.length} sheets`} narrow={narrow} />
    </g>
  );
}

function LetterSheet({ left, baseline, narrow }: { left: number; baseline: number; narrow: boolean }) {
  const width = 8.5 * UNITS_PER_INCH;
  const height = 11 * UNITS_PER_INCH;
  return (
    <g>
      <rect className="pg-sheet-ref" x={left} y={baseline - height} width={width} height={height} />
      <SizeLabels x={left + width / 2} baseline={baseline} size="8.5 × 11" count="1 sheet" narrow={narrow} />
    </g>
  );
}

export function PosterSizesFigure() {
  const summary = POSTER_INCHES.map(
    (poster) => `${poster.size} in: ${bestPlan(poster.widthIn * MM_PER_INCH, poster.heightIn * MM_PER_INCH, "letter").tiles.length} sheets`,
  ).join(", ");
  const label = `Posters drawn to scale next to one US Letter sheet. ${summary}.`;
  // Wide screens: one row. Phones: the three smaller ones, then 24 × 36 on a row of its own, so the labels stay readable.
  const wide: Placed[] = POSTER_INCHES.map((poster, index) => ({ ...poster, left: [140, 265, 432][index], baseline: 226 }));
  const narrow: Placed[] = POSTER_INCHES.map((poster, index) => ({
    ...poster,
    left: [112, 194, 88][index],
    baseline: [154, 154, 452][index],
  }));

  return (
    <figure className="pg-figure">
      <svg className="pg-svg pg-svg-sizes" viewBox="0 0 600 290" role="img" aria-label={label}>
        <LetterSheet left={36.5} baseline={226} narrow={false} />
        {wide.map((poster) => (
          <ScaledPoster key={poster.size} poster={poster} narrow={false} />
        ))}
      </svg>
      <svg className="pg-svg pg-svg-sizes-narrow" viewBox="0 0 320 510" role="img" aria-label={label}>
        <LetterSheet left={20} baseline={154} narrow />
        {narrow.map((poster) => (
          <ScaledPoster key={poster.size} poster={poster} narrow />
        ))}
      </svg>
      <figcaption>
        Drawn to scale in inches: one US Letter sheet, then the sheets each poster takes at the tool's default margin and overlap.
      </figcaption>
    </figure>
  );
}

/* ---------- Print dialog ---------- */

const DIALOG_LABEL =
  "A print dialog with the paper size set to US Letter and Scale set to Actual size. Fit to printable area and Custom are not selected.";

export function PrintDialogFigure() {
  return (
    <figure className="pg-figure">
      <svg className="pg-svg pg-svg-dialog" viewBox="0 0 520 300" role="img" aria-label={DIALOG_LABEL}>
        <rect className="pg-window" x="6" y="6" width="508" height="288" rx="14" />
        <text className="pg-window-title" x="32" y="46">Print</text>
        <line className="pg-hairline" x1="6" x2="514" y1="66" y2="66" />

        <text className="pg-field" x="32" y="106">Paper size</text>
        <rect className="pg-select" x="180" y="84" width="230" height="34" rx="8" />
        <text className="pg-select-text" x="196" y="107">US Letter</text>
        <path className="pg-caret" d="M386 97 l6 6 l6 -6" />

        <text className="pg-field" x="32" y="161">Scale</text>
        <rect className="pg-choice" x="172" y="134" width="320" height="44" rx="10" />
        <circle className="pg-radio pg-radio-on" cx="198" cy="156" r="9" />
        <circle className="pg-radio-dot" cx="198" cy="156" r="4.5" />
        <text className="pg-choice-text" x="218" y="162">Actual size</text>
        <path className="pg-check" d="M452 156 l7 7 l14 -16" />

        <circle className="pg-radio" cx="198" cy="206" r="9" />
        <text className="pg-option-text" x="218" y="212">Fit to printable area</text>

        <circle className="pg-radio" cx="198" cy="252" r="9" />
        <text className="pg-option-text" x="218" y="258">Custom</text>
        <rect className="pg-input" x="300" y="236" width="62" height="32" rx="7" />
        <text className="pg-input-text" x="314" y="258">100</text>
        <text className="pg-option-text" x="370" y="258">%</text>
      </svg>
      {/* Phones: labels above the controls, so the text can be drawn larger. */}
      <svg className="pg-svg pg-svg-dialog-narrow pg-narrow" viewBox="0 0 300 316" role="img" aria-label={DIALOG_LABEL}>
        <rect className="pg-window" x="4" y="4" width="292" height="308" rx="12" />
        <text className="pg-window-title" x="20" y="36">Print</text>
        <line className="pg-hairline" x1="4" x2="296" y1="50" y2="50" />

        <text className="pg-field" x="20" y="78">Paper size</text>
        <rect className="pg-select" x="20" y="88" width="260" height="34" rx="8" />
        <text className="pg-select-text" x="34" y="111">US Letter</text>
        <path className="pg-caret" d="M256 101 l6 6 l6 -6" />

        <text className="pg-field" x="20" y="152">Scale</text>
        <rect className="pg-choice" x="14" y="162" width="272" height="42" rx="10" />
        <circle className="pg-radio pg-radio-on" cx="38" cy="183" r="9" />
        <circle className="pg-radio-dot" cx="38" cy="183" r="4.5" />
        <text className="pg-choice-text" x="56" y="189">Actual size</text>
        <path className="pg-check" d="M246 183 l7 7 l14 -16" />

        <circle className="pg-radio" cx="38" cy="230" r="9" />
        <text className="pg-option-text" x="56" y="236">Fit to printable area</text>

        <circle className="pg-radio" cx="38" cy="274" r="9" />
        <text className="pg-option-text" x="56" y="280">Custom</text>
        <rect className="pg-input" x="122" y="259" width="56" height="30" rx="7" />
        <text className="pg-input-text" x="134" y="280">100</text>
        <text className="pg-option-text" x="186" y="280">%</text>
      </svg>
      <figcaption>
        The names differ between programs, but the choice is the same: Actual size, or 100%. Any "fit" option shrinks every sheet a
        little, and the seams stop lining up.
      </figcaption>
    </figure>
  );
}

/* ---------- One printed sheet ---------- */

/** A landscape scene shared by the sheet diagrams, in the coordinates of the area it is clipped to. */
function Scene({ left, top, width, height }: { left: number; top: number; width: number; height: number }) {
  const x = (share: number) => left + width * share;
  const y = (share: number) => top + height * share;
  return (
    <>
      <rect className="pg-pic-sky" x={left} y={top} width={width} height={height} />
      <circle className="pg-pic-sun" cx={x(0.62)} cy={y(0.36)} r={height * 0.2} />
      <path
        className="pg-pic-hill"
        d={`M${x(0)} ${y(0.66)} C ${x(0.2)} ${y(0.5)}, ${x(0.38)} ${y(0.52)}, ${x(0.55)} ${y(0.64)} S ${x(0.86)} ${y(0.52)}, ${x(1)} ${y(0.58)} L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`}
      />
      <path
        className="pg-pic-hill-near"
        d={`M${x(0)} ${y(0.84)} C ${x(0.24)} ${y(0.72)}, ${x(0.5)} ${y(0.8)}, ${x(0.7)} ${y(0.76)} S ${x(0.92)} ${y(0.7)}, ${x(1)} ${y(0.74)} L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`}
      />
    </>
  );
}

type Box = { left: number; top: number; right: number; bottom: number };

/** The corner marks the PDF prints just outside each corner of the picture. */
function CornerMarks({ left, top, right, bottom, length = 12, gap = 3 }: Box & { length?: number; gap?: number }) {
  const lines: Array<[number, number, number, number]> = [
    [left - gap - length, top, left - gap, top],
    [left, top - gap - length, left, top - gap],
    [right + gap, top, right + gap + length, top],
    [right, top - gap - length, right, top - gap],
    [left - gap - length, bottom, left - gap, bottom],
    [left, bottom + gap, left, bottom + gap + length],
    [right + gap, bottom, right + gap + length, bottom],
    [right, bottom + gap, right, bottom + gap + length],
  ];
  return (
    <>
      {lines.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} className="pg-mark" x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </>
  );
}

function Callout({ x, y, n, r = 12 }: { x: number; y: number; n: number; r?: number }) {
  return (
    <g>
      <circle className="pg-callout" cx={x} cy={y} r={r} />
      <text className="pg-callout-text" x={x} y={y + r * 0.42} textAnchor="middle">{n}</text>
    </g>
  );
}

/** A sheet's picture area with its scene, overlap strip and corner marks. */
function SheetPicture({ clipId, box, strip, markLength }: { clipId: string; box: Box; strip: number; markLength: number }) {
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x={box.left} y={box.top} width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <Scene left={box.left - width * 0.9} top={box.top} width={width * 2.7} height={height} />
        <rect className="pg-overlap" x={box.left} y={box.top} width={strip} height={height} />
        <line className="pg-overlap-edge" x1={box.left + strip} x2={box.left + strip} y1={box.top} y2={box.bottom} />
      </g>
      <CornerMarks {...box} length={markLength} gap={markLength / 4} />
    </>
  );
}

export function SheetAnatomyFigure({ sheetCount }: { sheetCount: number }) {
  const label = `Sheet A2 of a ${sheetCount}-sheet PDF: a reminder to print at 100% across the top, which sheet it joins, corner marks at the picture's corners, a 5 mm overlap strip down the left edge of the picture, and its name and page number at the bottom.`;
  return (
    <figure className="pg-figure pg-figure-aside">
      {/* Margins are drawn wider than 8 mm so the printed text stays readable in the diagram. */}
      <svg className="pg-svg pg-svg-sheet" viewBox="0 0 400 322" role="img" aria-label={label}>
        <rect className="pg-paper-under" x="16" y="18" width="380" height="294" rx="3" />
        <rect className="pg-paper" x="10" y="12" width="380" height="294" rx="3" />
        <text className="pg-sheet-text" x="200" y="28" textAnchor="middle">Print at 100% / Actual Size — do not fit to page</text>
        <text className="pg-sheet-text" x="200" y="44" textAnchor="middle">Align with left: A1</text>
        <SheetPicture clipId="pg-clip-sheet" box={{ left: 38, top: 52, right: 362, bottom: 276 }} strip={14} markLength={12} />
        <text className="pg-sheet-text" x="200" y="294" textAnchor="middle">
          Tile A2 · Page 2/{sheetCount} · overlap 5.0 mm
        </text>
        <Callout x={45} y={164} n={4} />
        <Callout x={378} y={68} n={2} />
        <Callout x={284} y={45} n={3} />
        <Callout x={334} y={290} n={1} />
      </svg>
      {/* Phones: the tiny printed lines become bars; the legend quotes them. */}
      <svg className="pg-svg pg-svg-sheet-narrow pg-narrow" viewBox="0 0 300 240" role="img" aria-label={label}>
        <rect className="pg-paper-under" x="13" y="13" width="284" height="220" rx="3" />
        <rect className="pg-paper" x="8" y="8" width="284" height="220" rx="3" />
        <rect className="pg-text-bar" x="70" y="16" width="160" height="4" rx="2" />
        <rect className="pg-text-bar" x="110" y="27" width="80" height="4" rx="2" />
        <SheetPicture clipId="pg-clip-sheet-narrow" box={{ left: 28, top: 40, right: 272, bottom: 200 }} strip={12} markLength={9} />
        <rect className="pg-text-bar" x="80" y="212" width="140" height="4" rx="2" />
        <Callout x={34} y={120} n={4} r={13} />
        <Callout x={284} y={56} n={2} r={13} />
        <Callout x={212} y={34} n={3} r={13} />
        <Callout x={240} y={214} n={1} r={13} />
      </svg>
      <figcaption>
        <p className="pg-legend-lead">Across the top, every sheet repeats "Print at 100% / Actual Size — do not fit to page".</p>
        <ol className="pg-legend">
          <li>
            <strong>"Tile A2 · Page 2/{sheetCount}"</strong> along the bottom: A2 is row A, column 2. Rows are letters from the top,
            columns are numbers from the left.
          </li>
          <li>
            <strong>Corner marks</strong> show where the picture starts and ends. You cut along them.
          </li>
          <li>
            <strong>"Align with left: A1"</strong> says where it goes: to the right of A1. Sheets lower down also name the sheet above.
          </li>
          <li>
            <strong>The overlap:</strong> the first 5 mm of A2 repeats the last 5 mm of A1, so you can match the picture across the seam.
          </li>
        </ol>
      </figcaption>
    </figure>
  );
}

/* ---------- Trim and tape ---------- */

type TrimLayout = {
  viewBox: string;
  margin: number;
  overlap: number;
  markLength: number;
  cutHeading: { x: number; y: number };
  joinHeading: { x: number; y: number };
  cutPaper: { x: number; y: number; w: number; h: number };
  a1Paper: { x: number; y: number; w: number; h: number };
  tape: { w: number; h: number; offsets: [number, number] };
  /** Sheet names: inside the bottom margin (wide) or as labels outside the sheets (phones). */
  names: "margin" | "outside";
  suffix: string;
  className: string;
};

const TRIM_WIDE: TrimLayout = {
  viewBox: "0 0 400 432",
  margin: 14,
  overlap: 10,
  markLength: 7,
  cutHeading: { x: 20, y: 20 },
  joinHeading: { x: 20, y: 236 },
  cutPaper: { x: 110, y: 54, w: 180, h: 139 },
  a1Paper: { x: 24, y: 254, w: 180, h: 139 },
  tape: { w: 26, h: 16, offsets: [30, 92] },
  names: "margin",
  suffix: "",
  className: "pg-svg pg-svg-trim",
};

const TRIM_NARROW: TrimLayout = {
  viewBox: "0 0 300 384",
  margin: 12,
  overlap: 9,
  markLength: 6,
  cutHeading: { x: 8, y: 18 },
  joinHeading: { x: 8, y: 196 },
  cutPaper: { x: 75, y: 54, w: 150, h: 116 },
  a1Paper: { x: 10, y: 228, w: 150, h: 116 },
  tape: { w: 22, h: 14, offsets: [24, 74] },
  names: "outside",
  suffix: "-narrow",
  className: "pg-svg pg-svg-trim-narrow pg-narrow",
};

function TrimTapeDrawing({ layout }: { layout: TrimLayout }) {
  const { margin, overlap, cutPaper, a1Paper, suffix } = layout;
  const cutPicture = { left: cutPaper.x + margin, top: cutPaper.y + margin, right: cutPaper.x + cutPaper.w - margin, bottom: cutPaper.y + cutPaper.h - margin };
  const a1Picture = { left: a1Paper.x + margin, top: a1Paper.y + margin, right: a1Paper.x + a1Paper.w - margin, bottom: a1Paper.y + a1Paper.h - margin };
  const seam = a1Picture.right - overlap;
  const a2 = { x: seam, y: a1Paper.y, w: a1Paper.w - margin, h: a1Paper.h };
  const a2Picture = { left: seam, top: a1Picture.top, right: a2.x + a2.w - margin, bottom: a1Picture.bottom };
  // One scene spans both sheets, so the hill runs straight across the seam.
  const scene = { left: a1Picture.left, top: a1Picture.top, width: a2Picture.right - a1Picture.left, height: a1Picture.bottom - a1Picture.top };
  const cutScene = { left: cutPicture.left - (seam - a1Picture.left), top: cutPicture.top, width: scene.width, height: cutPicture.bottom - cutPicture.top };
  const rect = (box: Box) => ({ x: box.left, y: box.top, width: box.right - box.left, height: box.bottom - box.top });
  const hatchId = `pg-hatch${suffix}`;
  const m = layout.markLength;

  return (
    <svg
      className={layout.className}
      viewBox={layout.viewBox}
      role="img"
      aria-label="Top: sheet A2 with its left margin shaded and a dashed cut line along the corner marks. Bottom: the trimmed A2 laid over A1, covering the repeated 5 mm strip, with tape across the seam on the back."
    >
      <defs>
        <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line className="pg-hatch-line" x1="0" y1="0" x2="0" y2="6" />
        </pattern>
        <clipPath id={`pg-clip-cut${suffix}`}>
          <rect {...rect(cutPicture)} />
        </clipPath>
        <clipPath id={`pg-clip-a1${suffix}`}>
          <rect {...rect(a1Picture)} />
        </clipPath>
        <clipPath id={`pg-clip-a2${suffix}`}>
          <rect {...rect(a2Picture)} />
        </clipPath>
      </defs>

      <text className="pg-step-text" x={layout.cutHeading.x} y={layout.cutHeading.y}>CUT THE LEFT MARGIN OFF A2</text>
      <rect className="pg-paper" x={cutPaper.x} y={cutPaper.y} width={cutPaper.w} height={cutPaper.h} rx="2" />
      <g clipPath={`url(#pg-clip-cut${suffix})`}>
        <Scene {...cutScene} />
        <rect className="pg-overlap" x={cutPicture.left} y={cutPicture.top} width={overlap} height={cutPicture.bottom - cutPicture.top} />
      </g>
      <rect fill={`url(#${hatchId})`} x={cutPaper.x} y={cutPaper.y} width={margin} height={cutPaper.h} />
      <CornerMarks {...cutPicture} length={m} gap={2} />
      <line className="pg-cut" x1={cutPicture.left} x2={cutPicture.left} y1={cutPaper.y - 10} y2={cutPaper.y + cutPaper.h + 10} />
      <g className="pg-scissors" transform={`translate(${cutPicture.left} ${cutPaper.y - 16})`}>
        <circle cx="-5" cy="-6" r="3.6" />
        <circle cx="5" cy="-6" r="3.6" />
        <path d="M-3 -3 L 3 9 M 3 -3 L -3 9" />
      </g>
      {layout.names === "margin" ? (
        <text className="pg-sheet-text" x={cutPaper.x + cutPaper.w / 2} y={cutPaper.y + cutPaper.h - 4} textAnchor="middle">Tile A2</text>
      ) : (
        <text className="pg-sheet-label" x={cutPaper.x + cutPaper.w + 10} y={cutPaper.y + cutPaper.h / 2 + 5}>A2</text>
      )}

      <text className="pg-step-text" x={layout.joinHeading.x} y={layout.joinHeading.y}>LAY A2 OVER A1, TAPE THE BACK</text>
      <rect className="pg-paper" x={a1Paper.x} y={a1Paper.y} width={a1Paper.w} height={a1Paper.h} rx="2" />
      <g clipPath={`url(#pg-clip-a1${suffix})`}>
        <Scene {...scene} />
      </g>
      <CornerMarks {...a1Picture} length={m} gap={2} />

      <rect className="pg-paper-shadow" x={a2.x + 3} y={a2.y + 3} width={a2.w} height={a2.h} rx="2" />
      <rect className="pg-paper" x={a2.x} y={a2.y} width={a2.w} height={a2.h} rx="2" />
      <g clipPath={`url(#pg-clip-a2${suffix})`}>
        <Scene {...scene} />
        <rect className="pg-overlap" x={a2Picture.left} y={a2Picture.top} width={overlap} height={a2Picture.bottom - a2Picture.top} />
      </g>
      <line className="pg-mark" x1={a2Picture.right + 2} y1={a2Picture.top} x2={a2Picture.right + 2 + m} y2={a2Picture.top} />
      <line className="pg-mark" x1={a2Picture.right} y1={a2Picture.top - 2} x2={a2Picture.right} y2={a2Picture.top - 2 - m} />
      <line className="pg-mark" x1={a2Picture.right + 2} y1={a2Picture.bottom} x2={a2Picture.right + 2 + m} y2={a2Picture.bottom} />
      <line className="pg-mark" x1={a2Picture.right} y1={a2Picture.bottom + 2} x2={a2Picture.right} y2={a2Picture.bottom + 2 + m} />
      {layout.names === "margin" ? (
        <>
          <text className="pg-sheet-text" x={a1Paper.x + a1Paper.w / 2 - 8} y={a1Paper.y + a1Paper.h - 4} textAnchor="middle">Tile A1</text>
          <text className="pg-sheet-text" x={a2.x + a2.w / 2} y={a2.y + a2.h - 4} textAnchor="middle">Tile A2</text>
        </>
      ) : (
        <>
          <text className="pg-sheet-label" x={a1Paper.x} y={a1Paper.y - 8}>A1</text>
          <text className="pg-sheet-label" x={a2.x + 4} y={a2.y - 8}>A2</text>
        </>
      )}

      {layout.tape.offsets.map((offset) => (
        <rect key={offset} className="pg-tape" x={seam - layout.tape.w / 2} y={a1Paper.y + offset} width={layout.tape.w} height={layout.tape.h} rx="2" />
      ))}

      <path
        className="pg-dimension"
        d={`M${seam} ${a1Paper.y + a1Paper.h + 8} v8 M${seam} ${a1Paper.y + a1Paper.h + 12} H${a1Picture.right} M${a1Picture.right} ${a1Paper.y + a1Paper.h + 8} v8`}
      />
      <text className="pg-dimension-text" x={seam + overlap / 2} y={a1Paper.y + a1Paper.h + 32} textAnchor="middle">5 mm overlap</text>
    </svg>
  );
}

export function TrimTapeFigure() {
  return (
    <figure className="pg-figure">
      <TrimTapeDrawing layout={TRIM_WIDE} />
      <TrimTapeDrawing layout={TRIM_NARROW} />
      <figcaption>Dashed boxes are tape on the back. Margins and the overlap are drawn wider than they print.</figcaption>
    </figure>
  );
}
