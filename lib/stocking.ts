/**
 * Christmas stocking sewing pattern, drawn as vectors in millimetres (2026-10-27).
 *
 * Three sizes; each has the stocking (sewing line plus a cutting line one seam allowance out),
 * a cuff that is folded in half, and a hanging loop. The pieces are laid out on one canvas that is
 * then split into printable sheets with the same tile plan as every other export on the site.
 */
import { calculateTilePlan, type PageOrientation, type PaperSize, type TilePlan, type TileRegion } from "@/lib/geometry";
import { clipSegment } from "@/lib/grid-pdf";

export type StockingSize = "small" | "medium" | "large";

export interface StockingSpec {
  id: StockingSize;
  label: string;
  /** Finished height, top edge to the bottom of the heel. */
  heightMm: number;
  /** How deep the folded cuff hangs. */
  cuffDepthMm: number;
  /** Shown to readers in inches and centimetres. */
  heightIn: number;
  heightCm: number;
}

export const STOCKING_SIZES: StockingSpec[] = [
  { id: "small", label: "Small", heightMm: 305, cuffDepthMm: 76, heightIn: 12, heightCm: 31 },
  { id: "medium", label: "Medium", heightMm: 406, cuffDepthMm: 102, heightIn: 16, heightCm: 41 },
  { id: "large", label: "Large", heightMm: 508, cuffDepthMm: 127, heightIn: 20, heightCm: 51 },
];

/** 3/8 in, the usual allowance for stockings; close enough to 1 cm to quote both. */
export const SEAM_ALLOWANCE_MM = 9.5;
/** Width of the leg as a share of the height, and of the whole stocking heel to toe. */
export const LEG_RATIO = 0.4;
export const FOOT_RATIO = 0.7;
const PIECE_GAP_MM = 15;
const LOOP_GAP_MM = 6;
const LOOP_MM: [number, number] = [51, 152];
const PATTERN_MARGIN_MM = 8;
const PATTERN_OVERLAP_MM = 5;

export type Point = [number, number];

export const sizeById = (id: StockingSize) => STOCKING_SIZES.find((size) => size.id === id) ?? STOCKING_SIZES[1];

function cubic(p0: Point, p1: Point, p2: Point, p3: Point, steps: number): Point[] {
  const out: Point[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
}

/**
 * The sewing line of the stocking, heel at the bottom left and toe pointing right, as a closed
 * polygon (first point not repeated) in mm with the top-left corner at 0, 0. Shape in units of the
 * height: leg 0.40 wide, the whole foot 0.70 heel to toe.
 */
export function stockingOutline(heightMm: number): Point[] {
  const s = (x: number, y: number): Point => [x * heightMm, y * heightMm];
  const w = LEG_RATIO;
  const pts: Point[] = [s(0, 0), s(w, 0), s(w, 0.5)];
  pts.push(...cubic(s(w, 0.5), s(w, 0.57), s(w + 0.03, 0.61), s(w + 0.08, 0.62), 10)); // instep
  pts.push(s(0.58, 0.64)); // top of the foot
  pts.push(...cubic(s(0.58, 0.64), s(0.66, 0.65), s(FOOT_RATIO, 0.72), s(FOOT_RATIO, 0.82), 14)); // toe
  pts.push(...cubic(s(FOOT_RATIO, 0.82), s(FOOT_RATIO, 0.93), s(0.65, 1), s(0.58, 1), 14));
  pts.push(s(0.16, 1)); // sole
  pts.push(...cubic(s(0.16, 1), s(0.06, 1), s(0, 0.92), s(0, 0.8), 14)); // heel
  return pts;
}

/** Twice the signed area: positive when the points run clockwise on screen (y down). */
function signedArea2(poly: Point[]): number {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum;
}

/**
 * The polygon pushed outward by `distance` (the cutting line around a sewing line). Each corner
 * moves along the average of its two edge normals, scaled so both edges end up exactly `distance`
 * away; square corners stay square.
 */
export function offsetPolygon(poly: Point[], distance: number): Point[] {
  const outward = signedArea2(poly) > 0 ? 1 : -1;
  const normal = (a: Point, b: Point): Point => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    // For a clockwise polygon on screen, (dy, -dx) points outward.
    return [(outward * dy) / len, (outward * -dx) / len];
  };
  return poly.map((p, i) => {
    const prev = poly[(i - 1 + poly.length) % poly.length];
    const next = poly[(i + 1) % poly.length];
    const n1 = normal(prev, p);
    const n2 = normal(p, next);
    let mx = n1[0] + n2[0];
    let my = n1[1] + n2[1];
    const len = Math.hypot(mx, my);
    if (len < 1e-9) return [p[0] + n1[0] * distance, p[1] + n1[1] * distance];
    mx /= len;
    my /= len;
    const cos = mx * n1[0] + my * n1[1];
    const scale = distance / Math.max(cos, 0.35);
    return [p[0] + mx * scale, p[1] + my * scale];
  });
}

export function bounds(poly: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

const rect = (x: number, y: number, w: number, h: number): Point[] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

export interface Piece {
  id: "stocking" | "cuff" | "loop";
  /** Sewing line (dashed in print). */
  sew: Point[];
  /** Cutting line (solid). */
  cut: Point[];
  /** Fold line for the cuff and loop, if any. */
  fold?: [Point, Point];
  title: string;
  lines: string[];
  /** Where the label block starts. */
  labelAt: Point;
}

export interface StockingPattern {
  size: StockingSpec;
  pieces: Piece[];
  widthMm: number;
  heightMm: number;
  /** Top-left of the 1 in and 5 cm test marks. */
  testAt: Point;
  /** Grainline on the stocking, top to bottom. */
  grain: [Point, Point];
}

/** All three pieces placed on one canvas: stocking on the left, cuff and loop stacked on its right. */
export function stockingPattern(sizeId: StockingSize): StockingPattern {
  const size = sizeById(sizeId);
  const sa = SEAM_ALLOWANCE_MM;
  const sew = stockingOutline(size.heightMm).map(([x, y]) => [x + sa, y + sa] as Point);
  const cut = offsetPolygon(sew, sa);
  const legWidth = LEG_RATIO * size.heightMm;
  const stockingRight = sa + FOOT_RATIO * size.heightMm + sa;

  const cuffX = stockingRight + PIECE_GAP_MM + sa;
  const cuffY = sa;
  const cuffH = size.cuffDepthMm * 2;
  const cuffSew = rect(cuffX, cuffY, legWidth, cuffH);
  // The loop sits in the empty corner beside the leg, above the foot, so it costs no extra paper.
  const loopX = sa + legWidth + sa + LOOP_GAP_MM + sa;
  const loopY = sa;
  const loopSew = rect(loopX, loopY, LOOP_MM[0], LOOP_MM[1]);

  const inches = `${size.heightIn} in / ${size.heightCm} cm tall`;
  const pieces: Piece[] = [
    {
      id: "stocking",
      sew,
      cut,
      title: `STOCKING · ${size.label.toUpperCase()} · ${inches}`,
      lines: [
        "Cut 2 from outer fabric (flip one over)",
        "Cut 2 from lining (flip one over)",
        "Solid line: cut   Dashed line: sew",
        "Seam allowance 3/8 in (1 cm) included",
      ],
      labelAt: [sa + legWidth * 0.08, sa + size.heightMm * 0.2],
    },
    {
      id: "cuff",
      sew: cuffSew,
      cut: offsetPolygon(cuffSew, sa),
      fold: [
        [cuffX - sa, cuffY + cuffH / 2],
        [cuffX + legWidth + sa, cuffY + cuffH / 2],
      ],
      title: "CUFF",
      lines: ["Cut 2 (felt, faux fur or cotton)", "Fold on the dotted line"],
      labelAt: [cuffX + 6, cuffY + 12],
    },
    {
      id: "loop",
      sew: loopSew,
      cut: offsetPolygon(loopSew, sa),
      fold: [
        [loopX + LOOP_MM[0] / 2, loopY - sa],
        [loopX + LOOP_MM[0] / 2, loopY + LOOP_MM[1] + sa],
      ],
      title: "LOOP",
      lines: ["Cut 1"],
      labelAt: [loopX + 4, loopY + 12],
    },
  ];
  const all = pieces.flatMap((piece) => piece.cut);
  const box = bounds(all);
  return {
    size,
    pieces,
    widthMm: Math.ceil(box.maxX + 2),
    heightMm: Math.ceil(box.maxY + 2),
    testAt: [sa + legWidth * 0.08, sa + size.heightMm * 0.42],
    grain: [
      [sa + legWidth * 0.75, sa + size.heightMm * 0.06],
      [sa + legWidth * 0.75, sa + size.heightMm * 0.46],
    ],
  };
}

export function polygonTouchesRect(poly: Point[], left: number, top: number, right: number, bottom: number): boolean {
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    if (clipSegment(x1, y1, x2, y2, left, top, right, bottom)) return true;
  }
  // No edge crosses the rectangle: it is either wholly inside the shape or wholly outside.
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > cy !== yj > cy && cx < ((xj - xi) * (cy - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** The sheets that have part of a piece on them; empty corners of the grid are not printed. */
export function usedTiles(pattern: StockingPattern, plan: TilePlan): TileRegion[] {
  return plan.tiles.filter((tile) =>
    pattern.pieces.some((piece) => polygonTouchesRect(piece.cut, tile.xMm, tile.yMm, tile.xMm + tile.widthMm, tile.yMm + tile.heightMm)),
  );
}

/** Sheets for the pattern on this paper: whichever orientation prints fewer. */
export function patternPlan(pattern: StockingPattern, paperSize: PaperSize): TilePlan {
  const plan = (orientation: PageOrientation) =>
    calculateTilePlan({
      targetWidthMm: pattern.widthMm,
      targetHeightMm: pattern.heightMm,
      paperSize,
      orientation,
      marginMm: PATTERN_MARGIN_MM,
      overlapMm: PATTERN_OVERLAP_MM,
    });
  const portrait = plan("portrait");
  const landscape = plan("landscape");
  return usedTiles(pattern, landscape).length < usedTiles(pattern, portrait).length ? landscape : portrait;
}

/** SVG path data for a closed polygon. */
export function pathData(poly: Point[]): string {
  return `M${poly.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
}
