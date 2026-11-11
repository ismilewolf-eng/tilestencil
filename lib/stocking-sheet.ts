/**
 * The "print-shop" version of the stocking pattern: the whole pattern on one large sheet, so
 * nothing has to be trimmed and taped. Sheets are the sizes copy shops print as standard:
 * 24 × 36 in and 36 × 48 in engineering prints in North America, A1 and A0 elsewhere.
 */
import type { PaperSize } from "@/lib/geometry";
import { stockingPattern, type StockingSize } from "@/lib/stocking";

export interface SheetFormat {
  /** What to ask the print shop for. */
  label: string;
  /** File name part. */
  slug: string;
  /** Page size as laid out (already turned to suit the pattern). */
  widthMm: number;
  heightMm: number;
}

const IN = 25.4;
export const SHEET_MARGIN_MM = 12;
/** Room under the pattern for the print note. */
export const SHEET_FOOTER_MM = 10;

const FORMATS: Record<"letter" | "a4", Array<[string, string, number, number]>> = {
  letter: [
    ["24 × 36 in", "24x36in", 24 * IN, 36 * IN],
    ["36 × 48 in", "36x48in", 36 * IN, 48 * IN],
  ],
  a4: [
    ["A1", "a1", 594, 841],
    ["A0", "a0", 841, 1189],
  ],
};

/** The smallest standard sheet the pattern fits on, turned whichever way fits. */
export function sheetFormat(size: StockingSize, paperSize: PaperSize): SheetFormat {
  const pattern = stockingPattern(size);
  const needW = pattern.widthMm + 2 * SHEET_MARGIN_MM;
  const needH = pattern.heightMm + 2 * SHEET_MARGIN_MM + SHEET_FOOTER_MM;
  const formats = FORMATS[paperSize === "letter" ? "letter" : "a4"];
  for (const [label, slug, short, long] of formats) {
    if (needW <= long && needH <= short) return { label, slug, widthMm: long, heightMm: short };
    if (needW <= short && needH <= long) return { label, slug, widthMm: short, heightMm: long };
  }
  const [label, slug, short, long] = formats[formats.length - 1];
  return { label, slug, widthMm: long, heightMm: short };
}

export const sheetFileName = (size: StockingSize, format: SheetFormat) => `christmas-stocking-${size}-print-shop-${format.slug}.pdf`;
