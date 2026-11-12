/**
 * "Paste a list, print the sheets" tools (2026-11-12): address labels laid out for standard label
 * sheets, and numbered raffle tickets. Pure layout and parsing; the PDFs are in sheets-pdf.ts.
 */

const IN = 25.4;

// ---------------------------------------------------------------- address labels

export interface LabelFormat {
  id: string;
  /** Shown to the user: the label size and how many per sheet. */
  name: string;
  /** Product numbers this layout matches, for the "compatible with" line. */
  fits: string;
  paper: "letter" | "a4";
  pageW: number;
  pageH: number;
  cols: number;
  rows: number;
  labelW: number;
  labelH: number;
  marginLeft: number;
  marginTop: number;
  pitchX: number;
  pitchY: number;
}

const letter = { paper: "letter" as const, pageW: 8.5 * IN, pageH: 11 * IN };
const a4 = { paper: "a4" as const, pageW: 210, pageH: 297 };

/** Die-cut positions published for these sheets; all dimensions in millimetres. */
export const LABEL_FORMATS: LabelFormat[] = [
  { id: "5160", name: "1 × 2⅝ in · 30 per sheet", fits: "Avery 5160, 5260, 8160, 8460", ...letter, cols: 3, rows: 10, labelW: 2.625 * IN, labelH: 1 * IN, marginLeft: 0.1875 * IN, marginTop: 0.5 * IN, pitchX: 2.75 * IN, pitchY: 1 * IN },
  { id: "5161", name: "1 × 4 in · 20 per sheet", fits: "Avery 5161, 5261, 8161", ...letter, cols: 2, rows: 10, labelW: 4 * IN, labelH: 1 * IN, marginLeft: 0.15625 * IN, marginTop: 0.5 * IN, pitchX: 4.1875 * IN, pitchY: 1 * IN },
  { id: "5163", name: "2 × 4 in · 10 per sheet", fits: "Avery 5163, 5263, 8163", ...letter, cols: 2, rows: 5, labelW: 4 * IN, labelH: 2 * IN, marginLeft: 0.15625 * IN, marginTop: 0.5 * IN, pitchX: 4.1875 * IN, pitchY: 2 * IN },
  { id: "5167", name: "½ × 1¾ in · 80 per sheet", fits: "Avery 5167, 5267, 8167 (return address)", ...letter, cols: 4, rows: 20, labelW: 1.75 * IN, labelH: 0.5 * IN, marginLeft: 0.28125 * IN, marginTop: 0.5 * IN, pitchX: 2.0625 * IN, pitchY: 0.5 * IN },
  { id: "l7160", name: "63.5 × 38.1 mm · 21 per sheet", fits: "Avery L7160, J8160", ...a4, cols: 3, rows: 7, labelW: 63.5, labelH: 38.1, marginLeft: 7.25, marginTop: 15.15, pitchX: 66, pitchY: 38.1 },
  { id: "l7163", name: "99.1 × 38.1 mm · 14 per sheet", fits: "Avery L7163, J8163", ...a4, cols: 2, rows: 7, labelW: 99.1, labelH: 38.1, marginLeft: 4.65, marginTop: 15.15, pitchX: 101.6, pitchY: 38.1 },
];

export const labelFormat = (id: string) => LABEL_FORMATS.find((f) => f.id === id) ?? LABEL_FORMATS[0];
export const perSheet = (f: LabelFormat) => f.cols * f.rows;

/** Top-left corner of label `index` (0-based, row by row) on its sheet. */
export function labelPosition(f: LabelFormat, index: number): { x: number; y: number } {
  const slot = index % perSheet(f);
  return { x: f.marginLeft + (slot % f.cols) * f.pitchX, y: f.marginTop + Math.floor(slot / f.cols) * f.pitchY };
}

/** Sheets needed for `count` labels when the first `skip` positions of sheet one are already used. */
export const sheetCount = (f: LabelFormat, count: number, skip = 0) => (count === 0 ? 0 : Math.ceil((count + skip) / perSheet(f)));

const HEADER = /^(first|last|full)?\s*name$|address|street|^city$|^state$|zip|postal|^country$/i;

/** Cells of one spreadsheet row as label lines: a trailing city / state / ZIP is put back on one line. */
export function rowToLines(cells: string[]): string[] {
  const c = cells.map((cell) => cell.trim()).filter(Boolean);
  if (c.length >= 5) return [...c.slice(0, -3), `${c[c.length - 3]}, ${c[c.length - 2]} ${c[c.length - 1]}`];
  if (c.length === 4) return [c[0], c[1], `${c[2]}, ${c[3]}`];
  return c;
}

/** One CSV record per array entry; handles quoted cells with commas, quotes and line breaks. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/\r\n?/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim()));
}

function rowsToLabels(rows: string[][]): string[][] {
  const body = rows.length > 1 && rows[0].every((c) => !/\d/.test(c)) && rows[0].some((c) => HEADER.test(c.trim())) ? rows.slice(1) : rows;
  return body.map(rowToLines).filter((lines) => lines.length > 0);
}

/**
 * Pasted text to labels. Three shapes are understood:
 *  - rows copied from a spreadsheet (tabs between cells), one address per row;
 *  - addresses typed on several lines each, with a blank line between addresses;
 *  - one address per line with commas between the parts.
 */
export function parseAddresses(text: string): string[][] {
  const src = text.replace(/\r\n?/g, "\n").replace(/ /g, " ");
  const lines = src.split("\n");
  const filled = lines.filter((l) => l.trim());
  if (filled.length === 0) return [];
  if (filled.filter((l) => l.includes("\t")).length >= Math.max(1, filled.length * 0.6)) {
    return rowsToLabels(filled.map((l) => l.split("\t")));
  }
  if (/\n[ \t]*\n/.test(src.trim())) {
    return src
      .trim()
      .split(/\n[ \t]*\n+/)
      .map((block) => block.split("\n").map((l) => l.trim()).filter(Boolean))
      .filter((block) => block.length > 0);
  }
  // No blank lines: a short block is one address; a long one is a list with one address per line.
  if (filled.length <= 6 && !filled.every((l) => (l.match(/,/g) ?? []).length >= 2)) return [filled.map((l) => l.trim())];
  return rowsToLabels(filled.map((l) => l.split(",")));
}

/** Characters the built-in PDF fonts cannot draw (anything outside Windows-1252). */
const CP1252_EXTRA = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
export function unprintable(labels: string[][]): string[] {
  const bad = new Set<string>();
  for (const ch of labels.flat().join("")) if (ch.charCodeAt(0) > 255 && !CP1252_EXTRA.includes(ch)) bad.add(ch);
  return [...bad];
}

export const PT_MM = 25.4 / 72;
export const LINE_SPACING = 1.22;

/**
 * Largest font size (pt) at which every line fits the box. `widthAt1pt` returns a line's width in
 * mm at 1 pt, so the PDF can pass exact font metrics and the preview an estimate.
 */
export function fitFontPt(lines: string[], boxW: number, boxH: number, maxPt: number, widthAt1pt: (line: string) => number, minPt = 5): number {
  if (lines.length === 0) return maxPt;
  const widest = Math.max(...lines.map(widthAt1pt), 0.0001);
  const byWidth = boxW / widest;
  const byHeight = boxH / (lines.length * LINE_SPACING * PT_MM);
  return Math.max(minPt, Math.min(maxPt, Math.floor(Math.min(byWidth, byHeight) * 2) / 2));
}

/** Rough Helvetica width for the on-screen preview (the PDF uses the font's real metrics). */
export const estimateWidthAt1pt = (line: string) => {
  let units = 0;
  for (const ch of line) units += /[ilj.,;:'!|ft ]/.test(ch) ? 0.3 : /[mwMW@]/.test(ch) ? 0.86 : /[A-Z0-9]/.test(ch) ? 0.66 : 0.53;
  return units * PT_MM;
};

export const LABEL_PAD_MM = 2.5;
export const LABEL_MAX_PT: Record<"small" | "medium" | "large", number> = { small: 9, medium: 11, large: 14 };
export const LABEL_FREE = 30;
export const LABEL_MAX = 3000;

// ---------------------------------------------------------------- raffle tickets

export interface TicketSpec {
  title: string;
  line2: string;
  line3: string;
  price: string;
  prefix: string;
  start: number;
  count: number;
  /** Lines on the stub for the buyer to fill in. */
  stubFields: string[];
}

export interface TicketLayout {
  pageW: number;
  pageH: number;
  cols: number;
  rows: number;
  ticketW: number;
  ticketH: number;
  marginX: number;
  marginY: number;
  /** Width of the tear-off stub at the left of each ticket. */
  stubW: number;
}

/** Eight tickets a sheet, edge to edge inside the margins so one cut serves two tickets. */
export function ticketLayout(paper: "letter" | "a4"): TicketLayout {
  const { pageW, pageH } = paper === "letter" ? letter : a4;
  const marginX = 9;
  const marginY = 10;
  const cols = 2;
  const rows = 4;
  const ticketW = (pageW - 2 * marginX) / cols;
  const ticketH = (pageH - 2 * marginY) / rows;
  return { pageW, pageH, cols, rows, ticketW, ticketH, marginX, marginY, stubW: ticketW * 0.36 };
}

export const TICKETS_PER_SHEET = 8;
export const TICKET_FREE = 100;
export const TICKET_MAX = 5000;

export function ticketPosition(layout: TicketLayout, index: number): { x: number; y: number } {
  const slot = index % (layout.cols * layout.rows);
  return { x: layout.marginX + (slot % layout.cols) * layout.ticketW, y: layout.marginY + Math.floor(slot / layout.cols) * layout.ticketH };
}

/** "No. 0042": numbers are padded to the width of the last one, with at least three digits. */
export function ticketNumber(spec: Pick<TicketSpec, "prefix" | "start" | "count">, index: number): string {
  const digits = Math.max(3, String(spec.start + spec.count - 1).length);
  return `${spec.prefix}${String(spec.start + index).padStart(digits, "0")}`;
}

export function ticketProblem(spec: Pick<TicketSpec, "start" | "count">): string | null {
  if (!Number.isInteger(spec.count) || spec.count < 1) return "Enter how many tickets you need (at least 1).";
  if (spec.count > TICKET_MAX) return `That is more than ${TICKET_MAX.toLocaleString("en-US")} tickets. Make them in batches, each starting where the last one ended.`;
  if (!Number.isInteger(spec.start) || spec.start < 0 || spec.start > 9_999_999) return "The first ticket number must be a whole number from 0 to 9,999,999.";
  return null;
}
