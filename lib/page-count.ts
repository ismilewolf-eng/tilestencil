import { calculateTilePlan, type PaperSize, type PageOrientation } from "@/lib/geometry";

/** The tool's starting margin and overlap (TileStencilApp starts at 0.8 cm and 0.5 cm). */
export const DEFAULT_MARGIN_MM = 8;
export const DEFAULT_OVERLAP_MM = 5;

export interface SheetCount {
  columns: number;
  rows: number;
  sheets: number;
  orientation: PageOrientation;
}

/** Sheets needed for a finished size at the default margin and overlap, in whichever orientation needs fewer. */
export function sheetsFor(widthMm: number, heightMm: number, paperSize: PaperSize): SheetCount {
  const options = (["portrait", "landscape"] as const).map((orientation) => {
    const plan = calculateTilePlan({
      targetWidthMm: widthMm,
      targetHeightMm: heightMm,
      paperSize,
      orientation,
      marginMm: DEFAULT_MARGIN_MM,
      overlapMm: DEFAULT_OVERLAP_MM,
    });
    return { columns: plan.columns, rows: plan.rows, sheets: plan.columns * plan.rows, orientation };
  });
  return options[0].sheets <= options[1].sheets ? options[0] : options[1];
}
