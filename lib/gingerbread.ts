/**
 * Gingerbread house template (2026-11-04, English only): a front/back gable wall, a side wall and a
 * roof panel for any house size, in millimetres. Each piece is cut twice. Pieces small enough for one
 * sheet are packed onto as few sheets as possible (no taping); bigger pieces are split with the same
 * tile plan as every other export on the site.
 */
import { calculateTilePlan, getPaperDimensions, type PageOrientation, type PaperSize, type TilePlan, type TileRegion } from "@/lib/geometry";

export type Point = [number, number];
export type HousePreset = "small" | "classic" | "large" | "custom";
export type Material = "gingerbread" | "cardboard";
export type Unit = "in" | "cm";

export interface HouseSize {
  widthMm: number; // front wall, side to side
  depthMm: number; // front to back
  wallMm: number; // side wall height, floor to eaves
  riseMm: number; // eaves to the roof peak
}

const IN = 25.4;

export const HOUSE_PRESETS: Array<{ id: Exclude<HousePreset, "custom">; label: string; note: string; size: HouseSize }> = [
  { id: "small", label: "Small", note: "4 × 5 in", size: { widthMm: 4 * IN, depthMm: 5 * IN, wallMm: 3.5 * IN, riseMm: 2.5 * IN } },
  { id: "classic", label: "Classic", note: "6 × 8 in", size: { widthMm: 6 * IN, depthMm: 8 * IN, wallMm: 4.5 * IN, riseMm: 3.5 * IN } },
  { id: "large", label: "Large", note: "7½ × 9 in", size: { widthMm: 7.5 * IN, depthMm: 9 * IN, wallMm: 5.5 * IN, riseMm: 4 * IN } },
];

/** Rolled gingerbread is about 1/4 in thick; cereal-box card or thin corrugated about 1/8 in. */
export const THICKNESS_MM: Record<Material, number> = { gingerbread: 6.35, cardboard: 3 };
/** Roof overhang past every wall. */
export const OVERHANG_MM = 12.7;

/** Allowed custom sizes, in millimetres (2–24 in wide, and so on). */
export const LIMITS: Record<keyof HouseSize, [number, number]> = {
  widthMm: [2 * IN, 24 * IN],
  depthMm: [2 * IN, 30 * IN],
  wallMm: [2 * IN, 18 * IN],
  riseMm: [1 * IN, 14 * IN],
};

export const PAGE_MARGIN_MM = 8;
const OVERLAP_MM = 5;
const GAP_MM = 8;

export interface Piece {
  id: "front" | "side" | "roof";
  title: string;
  cut: string;
  dims: string;
  widthMm: number;
  heightMm: number;
  outline: Point[];
  /** Optional cut-outs (door, windows), drawn dashed. */
  openings: Point[][];
  labelAt: Point;
  /** Top-left of the 1 in check square, only on the roof. */
  checkAt?: Point;
}

export function formatLength(mm: number, unit: Unit): string {
  if (unit === "cm") return `${(Math.round(mm / 5) / 2).toString()} cm`;
  // Inches to the nearest 1/4.
  const quarters = Math.round(mm / (IN / 4));
  const whole = Math.floor(quarters / 4);
  const frac = ["", "1/4", "1/2", "3/4"][quarters % 4];
  return whole === 0 ? `${frac} in` : frac ? `${whole} ${frac} in` : `${whole} in`;
}

const fmtPair = (a: number, b: number, unit: Unit) => `${formatLength(a, unit).replace(/ (in|cm)$/, "")} × ${formatLength(b, unit)}`;

function arch(cx: number, top: number, width: number, bottom: number, steps = 10): Point[] {
  const r = width / 2;
  const pts: Point[] = [[cx - r, bottom]];
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI - (Math.PI * i) / steps;
    pts.push([cx + r * Math.cos(a), top + r - r * Math.sin(a)]);
  }
  pts.push([cx + r, bottom]);
  return pts;
}

const square = (x: number, y: number, w: number, h: number): Point[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

export function sideWallLengthMm(size: HouseSize, material: Material): number {
  return size.depthMm - 2 * THICKNESS_MM[material];
}

export function roofPanelMm(size: HouseSize): { slopeMm: number; lengthMm: number } {
  return { slopeMm: Math.hypot(size.widthMm / 2, size.riseMm) + OVERHANG_MM, lengthMm: size.depthMm + 2 * OVERHANG_MM };
}

/** The three templates, each cut twice. Openings are optional cut-outs. */
export function housePieces(size: HouseSize, material: Material, unit: Unit, openings = true): Piece[] {
  const { widthMm: W, wallMm: H, riseMm: R } = size;
  const side = sideWallLengthMm(size, material);
  const roof = roofPanelMm(size);

  const doorW = Math.min(W * 0.28, H * 0.42);
  const doorH = H * 0.62;
  const front: Piece = {
    id: "front",
    title: "FRONT & BACK",
    cut: "Cut 2 · door on one only",
    dims: `${formatLength(W, unit)} wide · ${formatLength(R + H, unit)} to the peak`,
    widthMm: W,
    heightMm: R + H,
    outline: [
      [0, R],
      [W / 2, 0],
      [W, R],
      [W, R + H],
      [0, R + H],
    ],
    openings: openings ? [arch(W / 2, R + H - doorH, doorW, R + H)] : [],
    labelAt: [W / 2, R + H * 0.12],
  };

  const win = Math.min(H * 0.28, side * 0.17);
  const sideWall: Piece = {
    id: "side",
    title: "SIDE WALLS",
    cut: "Cut 2",
    dims: fmtPair(side, H, unit),
    widthMm: side,
    heightMm: H,
    outline: square(0, 0, side, H),
    openings: openings ? [square(side * 0.27 - win / 2, H * 0.5, win, win), square(side * 0.73 - win / 2, H * 0.5, win, win)] : [],
    labelAt: [side / 2, H * 0.14],
  };

  const roofPanel: Piece = {
    id: "roof",
    title: "ROOF",
    cut: "Cut 2",
    dims: fmtPair(roof.slopeMm, roof.lengthMm, unit),
    widthMm: roof.slopeMm,
    heightMm: roof.lengthMm,
    outline: square(0, 0, roof.slopeMm, roof.lengthMm),
    openings: [],
    labelAt: [roof.slopeMm / 2, roof.lengthMm * 0.5],
    checkAt: [Math.max(4, (roof.slopeMm - 52) / 2), 8],
  };

  return [front, sideWall, roofPanel];
}

/** A piece turned a quarter turn clockwise (paper templates have no grain). Labels stay upright. */
export function rotatePiece(piece: Piece): Piece {
  const h = piece.heightMm;
  const turn = ([x, y]: Point): Point => [h - y, x];
  return {
    ...piece,
    widthMm: piece.heightMm,
    heightMm: piece.widthMm,
    outline: piece.outline.map(turn),
    openings: piece.openings.map((poly) => poly.map(turn)),
    labelAt: turn(piece.labelAt),
    // The square is redrawn from its new corner; keep it inside the panel.
    checkAt: piece.checkAt ? [8, Math.max(4, (piece.widthMm - 52) / 2)] : undefined,
  };
}

export interface SheetItem {
  piece: Piece;
  /** Part of the piece on this sheet, in piece coordinates. */
  src: { x: number; y: number; w: number; h: number };
  pageX: number;
  pageY: number;
  part?: { n: number; of: number };
}

export interface Sheet {
  orientation: PageOrientation;
  widthMm: number;
  heightMm: number;
  items: SheetItem[];
  /** Set when this sheet is one tile of a piece too big for one sheet. */
  tile?: { region: TileRegion; plan: TilePlan };
}

function printable(paperSize: PaperSize, orientation: PageOrientation) {
  const paper = getPaperDimensions(paperSize, orientation);
  return { paper, w: paper.widthMm - 2 * PAGE_MARGIN_MM, h: paper.heightMm - 2 * PAGE_MARGIN_MM };
}

const fits = (p: Piece, w: number, h: number) => p.widthMm <= w + 0.01 && p.heightMm <= h + 0.01;

/** Shelf packing in a fixed order; null when a piece doesn't fit a page at all. */
function shelfPack(pieces: Piece[], paperSize: PaperSize, orientation: PageOrientation): Sheet[] | null {
  const { paper, w, h } = printable(paperSize, orientation);
  const sheets: Sheet[] = [];
  let sheet: Sheet | null = null;
  let x = 0;
  let y = 0;
  let rowH = 0;
  for (const piece of pieces) {
    if (!fits(piece, w, h)) return null;
    const newSheet = () => {
      sheet = { orientation, widthMm: paper.widthMm, heightMm: paper.heightMm, items: [] };
      sheets.push(sheet);
      x = 0;
      y = 0;
      rowH = 0;
    };
    if (!sheet) newSheet();
    if (x > 0 && x + piece.widthMm > w + 0.01) {
      x = 0;
      y += rowH + GAP_MM;
      rowH = 0;
    }
    if (y + piece.heightMm > h + 0.01) newSheet();
    sheet!.items.push({ piece, src: { x: 0, y: 0, w: piece.widthMm, h: piece.heightMm }, pageX: PAGE_MARGIN_MM + x, pageY: PAGE_MARGIN_MM + y });
    x += piece.widthMm + GAP_MM;
    rowH = Math.max(rowH, piece.heightMm);
  }
  return sheets;
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [item, ...rest]));
}

/** Smallest tiling of one oversized piece, trying both turns and both sheet orientations. */
function tilePiece(piece: Piece, paperSize: PaperSize): Sheet[] {
  let best: Sheet[] | null = null;
  for (const candidate of [piece, rotatePiece(piece)]) {
    for (const orientation of ["portrait", "landscape"] as PageOrientation[]) {
      const plan = calculateTilePlan({
        targetWidthMm: candidate.widthMm,
        targetHeightMm: candidate.heightMm,
        paperSize,
        orientation,
        marginMm: PAGE_MARGIN_MM,
        overlapMm: OVERLAP_MM,
      });
      const sheets: Sheet[] = plan.tiles.map((region, i) => ({
        orientation,
        widthMm: plan.paper.widthMm,
        heightMm: plan.paper.heightMm,
        tile: { region, plan },
        items: [
          {
            piece: candidate,
            src: { x: region.xMm, y: region.yMm, w: region.widthMm, h: region.heightMm },
            pageX: region.pageXmm,
            pageY: region.pageYmm,
            part: { n: i + 1, of: plan.tiles.length },
          },
        ],
      }));
      if (!best || sheets.length < best.length) best = sheets;
    }
  }
  return best!;
}

/**
 * Sheets for the whole template: pieces that fit one sheet are packed (trying every order, turn and
 * page orientation), and any piece too big for a sheet is tiled on its own.
 */
export function houseSheets(pieces: Piece[], paperSize: PaperSize): Sheet[] {
  const one = (p: Piece) =>
    (["portrait", "landscape"] as PageOrientation[]).some((o) => {
      const { w, h } = printable(paperSize, o);
      return fits(p, w, h) || fits(rotatePiece(p), w, h);
    });
  const small = pieces.filter(one);
  const big = pieces.filter((p) => !one(p));

  let packed: Sheet[] = [];
  if (small.length) {
    let best: Sheet[] | null = null;
    for (const order of permutations(small)) {
      for (let mask = 0; mask < 1 << order.length; mask++) {
        const turned = order.map((p, i) => (mask & (1 << i) ? rotatePiece(p) : p));
        for (const orientation of ["portrait", "landscape"] as PageOrientation[]) {
          const sheets = shelfPack(turned, paperSize, orientation);
          if (sheets && (!best || sheets.length < best.length)) best = sheets;
        }
      }
    }
    packed = best ?? [];
  }
  return [...packed, ...big.flatMap((p) => tilePiece(p, paperSize))];
}

/** Rolled area for two of every piece, in square inches. */
export function doughAreaSqIn(pieces: Piece[]): number {
  const area = (poly: Point[]) => Math.abs(poly.reduce((sum, [x, y], i) => {
    const [nx, ny] = poly[(i + 1) % poly.length];
    return sum + x * ny - nx * y;
  }, 0)) / 2;
  return (2 * pieces.reduce((sum, p) => sum + area(p.outline), 0)) / (IN * IN);
}

export function pathData(poly: Point[]): string {
  return `${poly.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ")} Z`;
}

/** Custom sizes outside the limits, as a message for the form; null when the size is fine. */
export function sizeProblem(size: HouseSize, unit: Unit): string | null {
  const names: Record<keyof HouseSize, string> = { widthMm: "Width", depthMm: "Depth", wallMm: "Wall height", riseMm: "Roof height" };
  for (const key of Object.keys(LIMITS) as Array<keyof HouseSize>) {
    const [min, max] = LIMITS[key];
    const v = size[key];
    if (!Number.isFinite(v) || v < min - 0.5 || v > max + 0.5) {
      return `${names[key]} must be between ${formatLength(min, unit)} and ${formatLength(max, unit)}.`;
    }
  }
  return null;
}
