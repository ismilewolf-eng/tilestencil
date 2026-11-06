/**
 * Christmas tree skirt pattern (2026-11-06, English only), in millimetres.
 * Round: a quarter of a ring, cut on fabric folded in four. Panels: one wedge with a straight outer
 * edge, cut 6, 8 or 12 times. 3/8 in seam allowance is added to every cut edge (none on a fold).
 * The template is tiled across home-printer sheets; only sheets that carry part of it are printed.
 */
import { calculateTilePlan, type PageOrientation, type PaperSize, type TilePlan, type TileRegion } from "@/lib/geometry";
import { bounds, offsetPolygon, polygonTouchesRect, type Point } from "@/lib/stocking";

export type { Point };
export type SkirtStyle = "round" | "panels";
export type SkirtPreset = "small" | "medium" | "large" | "custom";
export type Unit = "in" | "cm";

const IN = 25.4;
export const SEAM_MM = 9.5; // 3/8 in, about 1 cm
const MARGIN_MM = 8;
const OVERLAP_MM = 5;

export const SKIRT_PRESETS: Array<{ id: Exclude<SkirtPreset, "custom">; label: string; diameterMm: number; note: string }> = [
  { id: "small", label: "Small", diameterMm: 36 * IN, note: "36 in" },
  { id: "medium", label: "Medium", diameterMm: 48 * IN, note: "48 in" },
  { id: "large", label: "Large", diameterMm: 60 * IN, note: "60 in" },
];
export const PANEL_COUNTS = [6, 8, 12] as const;
export const DEFAULT_HOLE_MM = 5 * IN;
export const LIMITS = { diameterMm: [20 * IN, 80 * IN] as [number, number], holeMm: [2 * IN, 12 * IN] as [number, number] };

export interface SkirtSpec {
  style: SkirtStyle;
  diameterMm: number; // finished
  holeMm: number; // finished centre opening
  panels: number;
}

export interface SkirtTemplate {
  spec: SkirtSpec;
  cut: Point[];
  sew: Point[];
  folds: Array<[Point, Point]>;
  widthMm: number;
  heightMm: number;
  labelAt: Point;
  checkAt: Point;
  title: string;
  lines: string[];
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number, steps: number): Point[] {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((a1 - a0) * i) / steps;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

export function formatLength(mm: number, unit: Unit): string {
  if (unit === "cm") return `${Math.round(mm / 10)} cm`;
  const eighths = Math.round(mm / (IN / 8));
  const whole = Math.floor(eighths / 8);
  const frac = ["", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8"][eighths % 8];
  return whole === 0 ? `${frac} in` : frac ? `${whole} ${frac} in` : `${whole} in`;
}

export function skirtTemplate(spec: SkirtSpec, unit: Unit): SkirtTemplate {
  const R = spec.diameterMm / 2;
  const r = spec.holeMm / 2;
  if (spec.style === "round") {
    // Quarter ring with its centre at the top-left corner; both straight edges are on the fold.
    const Ro = R + SEAM_MM;
    const Ri = Math.max(r - SEAM_MM, 1);
    const cut: Point[] = [...arc(0, 0, Ro, 0, Math.PI / 2, 72), ...arc(0, 0, Ri, Math.PI / 2, 0, 24)];
    const sew: Point[] = [...arc(0, 0, R, 0, Math.PI / 2, 72), ...arc(0, 0, r, Math.PI / 2, 0, 24)];
    const mid = (Ri + Ro) / 2;
    const d = mid * Math.SQRT1_2;
    return {
      spec,
      cut,
      sew,
      folds: [
        [
          [Ri, 0],
          [Ro, 0],
        ],
        [
          [0, Ri],
          [0, Ro],
        ],
      ],
      widthMm: Ro,
      heightMm: Ro,
      labelAt: [d, d - 30],
      checkAt: [d - 26, d + 20],
      title: "TREE SKIRT - QUARTER",
      lines: [
        `${formatLength(spec.diameterMm, unit)} across finished, ${formatLength(spec.holeMm, unit)} centre`,
        "Fold the fabric in four; both straight edges go on folds",
        "Cut 1 from the top fabric and 1 from the lining",
      ],
    };
  }
  // One panel: a wedge with a straight outer edge, pointing up (the centre opening at the top).
  const half = Math.PI / spec.panels;
  const s = Math.sin(half);
  const c = Math.cos(half);
  const sewRaw: Point[] = [
    [-r * s, r * c],
    [r * s, r * c],
    [R * s, R * c],
    [-R * s, R * c],
  ];
  const cutRaw = offsetPolygon(sewRaw, SEAM_MM);
  const b = bounds(cutRaw);
  const shift = (p: Point): Point => [p[0] - b.minX, p[1] - b.minY];
  const cut = cutRaw.map(shift);
  const sew = sewRaw.map(shift);
  const w = b.maxX - b.minX;
  const h = b.maxY - b.minY;
  return {
    spec,
    cut,
    sew,
    folds: [],
    widthMm: w,
    heightMm: h,
    labelAt: [w / 2, h * 0.34],
    checkAt: [w / 2 - 26, h * 0.6],
    title: `TREE SKIRT - PANEL (CUT ${spec.panels})`,
    lines: [
      `${formatLength(spec.diameterMm, unit)} across finished, ${spec.panels} panels`,
      `Cut ${spec.panels} from the top fabric and ${spec.panels} from the lining`,
      "Seam allowance 3/8 in (1 cm) included",
    ],
  };
}

export function usedTiles(t: SkirtTemplate, plan: TilePlan): TileRegion[] {
  return plan.tiles.filter((tile) => polygonTouchesRect(t.cut, tile.xMm, tile.yMm, tile.xMm + tile.widthMm, tile.yMm + tile.heightMm));
}

/** Whichever sheet orientation prints the template on fewer sheets. */
export function skirtPlan(t: SkirtTemplate, paperSize: PaperSize): TilePlan {
  const plan = (orientation: PageOrientation) =>
    calculateTilePlan({ targetWidthMm: t.widthMm, targetHeightMm: t.heightMm, paperSize, orientation, marginMm: MARGIN_MM, overlapMm: OVERLAP_MM });
  const portrait = plan("portrait");
  const landscape = plan("landscape");
  return usedTiles(t, landscape).length < usedTiles(t, portrait).length ? landscape : portrait;
}

/**
 * Fabric for one layer (top or lining). Round: a square as wide as the skirt plus seam allowance.
 * Panels: wedges laid head to tail across 42 in of usable quilting-cotton width.
 */
export function fabricNeed(t: SkirtTemplate): { widthMm: number; lengthMm: number; perRow?: number } {
  if (t.spec.style === "round") return { widthMm: 2 * t.widthMm, lengthMm: 2 * t.heightMm };
  const usable = 42 * IN;
  // Alternating wedges (one up, one down) share most of their width.
  const topWidth = t.cut[1][0] - t.cut[0][0];
  const step = (t.widthMm + topWidth) / 2;
  const perRow = Math.max(1, Math.floor((usable - t.widthMm) / step) + 1);
  const rows = Math.ceil(t.spec.panels / perRow);
  return { widthMm: usable, lengthMm: rows * t.heightMm, perRow };
}

export function sizeProblem(spec: SkirtSpec, unit: Unit): string | null {
  const [dmin, dmax] = LIMITS.diameterMm;
  const [hmin, hmax] = LIMITS.holeMm;
  if (!Number.isFinite(spec.diameterMm) || spec.diameterMm < dmin - 0.5 || spec.diameterMm > dmax + 0.5)
    return `The skirt must be between ${formatLength(dmin, unit)} and ${formatLength(dmax, unit)} across.`;
  if (!Number.isFinite(spec.holeMm) || spec.holeMm < hmin - 0.5 || spec.holeMm > hmax + 0.5)
    return `The centre opening must be between ${formatLength(hmin, unit)} and ${formatLength(hmax, unit)}.`;
  if (spec.holeMm > spec.diameterMm / 3) return "The centre opening is too big for this skirt; keep it under a third of the width.";
  return null;
}

export function pathData(poly: Point[]): string {
  return `${poly.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} Z`;
}
