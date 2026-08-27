export type MeasurementUnit = "cm" | "in";
export type PaperSize = "a4" | "a3" | "letter";
export type PageOrientation = "portrait" | "landscape";

export interface PaperDimensions {
  widthMm: number;
  heightMm: number;
  label: string;
}

export interface TilePlanInput {
  targetWidthMm: number;
  targetHeightMm: number;
  paperSize: PaperSize;
  orientation: PageOrientation;
  marginMm: number;
  overlapMm: number;
}

export interface TileRegion {
  index: number;
  row: number;
  column: number;
  label: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  pageXmm: number;
  pageYmm: number;
}

export interface TilePlan {
  paper: PaperDimensions;
  orientation: PageOrientation;
  targetWidthMm: number;
  targetHeightMm: number;
  marginMm: number;
  overlapMm: number;
  printableWidthMm: number;
  printableHeightMm: number;
  strideXmm: number;
  strideYmm: number;
  columns: number;
  rows: number;
  tiles: TileRegion[];
}

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PAPER_SIZES: Record<PaperSize, PaperDimensions> = {
  a4: { widthMm: 210, heightMm: 297, label: "A4" },
  a3: { widthMm: 297, heightMm: 420, label: "A3" },
  letter: { widthMm: 215.9, heightMm: 279.4, label: "US Letter" },
};

const MM_PER_INCH = 25.4;

export function toMillimeters(value: number, unit: MeasurementUnit): number {
  return unit === "cm" ? value * 10 : value * MM_PER_INCH;
}

export function fromMillimeters(valueMm: number, unit: MeasurementUnit): number {
  return unit === "cm" ? valueMm / 10 : valueMm / MM_PER_INCH;
}

export function getPaperDimensions(
  paperSize: PaperSize,
  orientation: PageOrientation,
): PaperDimensions {
  const base = PAPER_SIZES[paperSize];
  if (orientation === "portrait") {
    return { ...base };
  }

  return {
    widthMm: base.heightMm,
    heightMm: base.widthMm,
    label: base.label,
  };
}

function ensureFinitePositive(value: number, field: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${field} must be greater than 0.`);
  }
}

function getTileCount(totalMm: number, printableMm: number, overlapMm: number): number {
  if (totalMm <= printableMm) {
    return 1;
  }

  return Math.ceil((totalMm - overlapMm) / (printableMm - overlapMm));
}

export function indexToLetters(index: number): string {
  let value = index + 1;
  let output = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    output = String.fromCharCode(65 + remainder) + output;
    value = Math.floor((value - 1) / 26);
  }

  return output;
}

export function calculateTilePlan(input: TilePlanInput): TilePlan {
  ensureFinitePositive(input.targetWidthMm, "Final width");
  ensureFinitePositive(input.targetHeightMm, "Final height");

  if (!Number.isFinite(input.marginMm) || input.marginMm < 0) {
    throw new Error("Margin cannot be negative.");
  }

  if (!Number.isFinite(input.overlapMm) || input.overlapMm < 0) {
    throw new Error("Overlap cannot be negative.");
  }

  const paper = getPaperDimensions(input.paperSize, input.orientation);
  const printableWidthMm = paper.widthMm - input.marginMm * 2;
  const printableHeightMm = paper.heightMm - input.marginMm * 2;

  ensureFinitePositive(printableWidthMm, "Printable width");
  ensureFinitePositive(printableHeightMm, "Printable height");

  if (input.overlapMm >= printableWidthMm || input.overlapMm >= printableHeightMm) {
    throw new Error("Overlap must be smaller than both printable page dimensions.");
  }

  const strideXmm = printableWidthMm - input.overlapMm;
  const strideYmm = printableHeightMm - input.overlapMm;
  const columns = getTileCount(input.targetWidthMm, printableWidthMm, input.overlapMm);
  const rows = getTileCount(input.targetHeightMm, printableHeightMm, input.overlapMm);
  const tiles: TileRegion[] = [];

  for (let row = 0; row < rows; row += 1) {
    const yMm = row * strideYmm;
    const heightMm = Math.min(printableHeightMm, input.targetHeightMm - yMm);

    for (let column = 0; column < columns; column += 1) {
      const xMm = column * strideXmm;
      const widthMm = Math.min(printableWidthMm, input.targetWidthMm - xMm);
      const index = row * columns + column;

      tiles.push({
        index,
        row,
        column,
        label: `${indexToLetters(row)}${column + 1}`,
        xMm,
        yMm,
        widthMm,
        heightMm,
        pageXmm: input.marginMm,
        pageYmm: input.marginMm,
      });
    }
  }

  return {
    paper,
    orientation: input.orientation,
    targetWidthMm: input.targetWidthMm,
    targetHeightMm: input.targetHeightMm,
    marginMm: input.marginMm,
    overlapMm: input.overlapMm,
    printableWidthMm,
    printableHeightMm,
    strideXmm,
    strideYmm,
    columns,
    rows,
    tiles,
  };
}

export function getPixelCrop(
  tile: TileRegion,
  imageWidthPx: number,
  imageHeightPx: number,
  targetWidthMm: number,
  targetHeightMm: number,
): PixelCrop {
  ensureFinitePositive(imageWidthPx, "Image width");
  ensureFinitePositive(imageHeightPx, "Image height");
  ensureFinitePositive(targetWidthMm, "Final width");
  ensureFinitePositive(targetHeightMm, "Final height");

  const clamp = (value: number, maximum: number): number =>
    Math.min(maximum, Math.max(0, Number(value.toFixed(8))));
  const x = clamp((tile.xMm / targetWidthMm) * imageWidthPx, imageWidthPx);
  const y = clamp((tile.yMm / targetHeightMm) * imageHeightPx, imageHeightPx);
  const right = clamp(
    ((tile.xMm + tile.widthMm) / targetWidthMm) * imageWidthPx,
    imageWidthPx,
  );
  const bottom = clamp(
    ((tile.yMm + tile.heightMm) / targetHeightMm) * imageHeightPx,
    imageHeightPx,
  );

  return {
    x,
    y,
    width: Number((right - x).toFixed(8)),
    height: Number((bottom - y).toFixed(8)),
  };
}

export function formatMeasurement(valueMm: number, unit: MeasurementUnit, fractionDigits = 1): string {
  const value = fromMillimeters(valueMm, unit);
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value)} ${unit}`;
}
