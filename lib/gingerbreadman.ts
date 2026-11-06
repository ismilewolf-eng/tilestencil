/**
 * Gingerbread man template (2026-11-06, English only). The outline is a union of a head, body, arms
 * and legs (built once with shapely and stored here), scaled so its height is 1. Small sizes are laid
 * out in a grid on one sheet; large ones (doors, bulletin boards) are split across sheets.
 */
import { calculateTilePlan, getPaperDimensions, type PageOrientation, type PaperSize, type TilePlan, type TileRegion } from "@/lib/geometry";
import { polygonTouchesRect, type Point } from "@/lib/stocking";

export type { Point };
export type ManPreset = "cookie" | "ornament" | "craft" | "door" | "custom";
export type Unit = "in" | "cm";

const IN = 25.4;
/** Width of the figure when its height is 1. */
export const ASPECT = 0.8381;
export const OUTLINE: Point[] = [[0.1837, 0.5197], [0.194, 0.5184], [0.2073, 0.5216], [0.216, 0.5273], [0.2241, 0.5384], [0.2269, 0.5483], [0.2298, 0.5824], [0.2375, 0.6276], [0.2341, 0.6407], [0.1258, 0.8616], [0.119, 0.88], [0.1162, 0.8975], [0.1161, 0.91], [0.1209, 0.9345], [0.1326, 0.958], [0.1492, 0.9767], [0.1636, 0.987], [0.1759, 0.993], [0.1929, 0.9981], [0.2064, 0.9998], [0.2241, 0.9992], [0.2374, 0.9966], [0.255, 0.9898], [0.2701, 0.9804], [0.2838, 0.9676], [0.2954, 0.9513], [0.3686, 0.8028], [0.3729, 0.7972], [0.3812, 0.7909], [0.3877, 0.7881], [0.3981, 0.7866], [0.4469, 0.7872], [0.4568, 0.7909], [0.465, 0.7972], [0.4711, 0.8058], [0.5431, 0.9523], [0.5577, 0.9713], [0.5774, 0.9868], [0.5897, 0.9928], [0.6077, 0.9982], [0.6253, 1.0], [0.6441, 0.9983], [0.6573, 0.9948], [0.6734, 0.9876], [0.6848, 0.98], [0.6984, 0.9671], [0.7118, 0.9472], [0.7188, 0.9286], [0.7221, 0.9048], [0.7201, 0.885], [0.7122, 0.8616], [0.6025, 0.6376], [0.6008, 0.6309], [0.6007, 0.6207], [0.6081, 0.5828], [0.6116, 0.545], [0.6155, 0.5354], [0.6247, 0.5252], [0.6339, 0.5203], [0.6441, 0.5184], [0.6543, 0.5197], [0.7455, 0.5445], [0.7677, 0.5447], [0.7881, 0.5393], [0.8021, 0.5319], [0.8136, 0.5226], [0.8214, 0.5139], [0.8293, 0.5015], [0.8351, 0.4868], [0.8375, 0.4753], [0.8381, 0.4607], [0.8367, 0.4491], [0.8305, 0.4301], [0.8217, 0.4155], [0.8077, 0.4013], [0.7897, 0.3905], [0.5633, 0.3264], [0.554, 0.3223], [0.5463, 0.3155], [0.5424, 0.3099], [0.5389, 0.3002], [0.5388, 0.2766], [0.5421, 0.2673], [0.5632, 0.2343], [0.5738, 0.2082], [0.5802, 0.1736], [0.5794, 0.1414], [0.5711, 0.1068], [0.5557, 0.0752], [0.5359, 0.0498], [0.5086, 0.027], [0.4846, 0.0137], [0.4619, 0.0057], [0.4386, 0.001], [0.4113, 0.0], [0.3872, 0.0029], [0.361, 0.0106], [0.3392, 0.0209], [0.3194, 0.0341], [0.2964, 0.0561], [0.2765, 0.0851], [0.2644, 0.1144], [0.2581, 0.1458], [0.2581, 0.1775], [0.2644, 0.2086], [0.2747, 0.2343], [0.2958, 0.2673], [0.2992, 0.2766], [0.2991, 0.3002], [0.2956, 0.3099], [0.2917, 0.3155], [0.284, 0.3223], [0.2746, 0.3264], [0.0494, 0.39], [0.0389, 0.3952], [0.0262, 0.4047], [0.0163, 0.4155], [0.0099, 0.4253], [0.0035, 0.4399], [0.0002, 0.4553], [0.0, 0.4712], [0.0028, 0.4868], [0.0087, 0.5015], [0.0173, 0.5149], [0.0283, 0.5263], [0.0413, 0.5353], [0.0549, 0.5411], [0.0662, 0.544], [0.0913, 0.5447]];
export const EYES: Point[] = [[0.3634, 0.1362], [0.4745, 0.1362]];
export const BUTTONS: Point[] = [[0.419, 0.4595], [0.419, 0.5504], [0.419, 0.6413]];
export const SMILE: Point = [0.419, 0.1968];

export const MAN_PRESETS: Array<{ id: Exclude<ManPreset, "custom">; label: string; heightMm: number; note: string }> = [
  { id: "cookie", label: "Cookie", heightMm: 4 * IN, note: "4 in" },
  { id: "ornament", label: "Craft", heightMm: 7 * IN, note: "7 in" },
  { id: "craft", label: "Poster", heightMm: 14 * IN, note: "14 in" },
  { id: "door", label: "Door", heightMm: 36 * IN, note: "3 ft" },
];
export const LIMITS: [number, number] = [2 * IN, 72 * IN];
export const MARGIN_MM = 8;
const OVERLAP_MM = 5;
const GAP_MM = 6;
/** Room kept at the bottom of a grid sheet for the 1 in check square. */
export const KEY_MM = 36;

export function formatLength(mm: number, unit: Unit): string {
  if (unit === "cm") return `${Math.round(mm / 10)} cm`;
  if (mm >= 24 * IN && Math.abs(mm / (12 * IN) - Math.round(mm / (12 * IN))) < 0.01) return `${Math.round(mm / (12 * IN))} ft`;
  const halves = Math.round(mm / (IN / 2));
  return halves % 2 ? `${(halves - 1) / 2} 1/2 in` : `${halves / 2} in`;
}

export const scaled = (poly: Point[], heightMm: number, dx = 0, dy = 0): Point[] => poly.map(([x, y]) => [dx + x * heightMm, dy + y * heightMm]);

export interface ManLayout {
  kind: "grid" | "tiles";
  heightMm: number;
  widthMm: number;
  /** Grid: one sheet with copies at these top-left offsets. */
  orientation: PageOrientation;
  paper: { widthMm: number; heightMm: number };
  copies: Point[];
  /** Tiles: the sheets that carry part of the figure. */
  plan?: TilePlan;
  tiles: TileRegion[];
}

/** As many copies as fit on one sheet, or the figure split across sheets when it is too big for one. */
export function manLayout(heightMm: number, paperSize: PaperSize): ManLayout {
  const widthMm = heightMm * ASPECT;
  let best: ManLayout | null = null;
  for (const orientation of ["portrait", "landscape"] as PageOrientation[]) {
    const paper = getPaperDimensions(paperSize, orientation);
    const w = paper.widthMm - 2 * MARGIN_MM;
    const h = paper.heightMm - 2 * MARGIN_MM - KEY_MM;
    const cols = Math.floor((w + GAP_MM) / (widthMm + GAP_MM));
    const rows = Math.floor((h + GAP_MM) / (heightMm + GAP_MM));
    if (cols < 1 || rows < 1) continue;
    const usedW = cols * widthMm + (cols - 1) * GAP_MM;
    const x0 = MARGIN_MM + (w - usedW) / 2;
    const copies: Point[] = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) copies.push([x0 + c * (widthMm + GAP_MM), MARGIN_MM + r * (heightMm + GAP_MM)]);
    if (!best || copies.length > best.copies.length) best = { kind: "grid", heightMm, widthMm, orientation, paper: { widthMm: paper.widthMm, heightMm: paper.heightMm }, copies, tiles: [] };
  }
  if (best) return best;
  const outline = scaled(OUTLINE, heightMm);
  let tiled: ManLayout | null = null;
  for (const orientation of ["portrait", "landscape"] as PageOrientation[]) {
    const plan = calculateTilePlan({ targetWidthMm: widthMm, targetHeightMm: heightMm, paperSize, orientation, marginMm: MARGIN_MM, overlapMm: OVERLAP_MM });
    const tiles = plan.tiles.filter((t) => polygonTouchesRect(outline, t.xMm, t.yMm, t.xMm + t.widthMm, t.yMm + t.heightMm));
    if (!tiled || tiles.length < tiled.tiles.length)
      tiled = { kind: "tiles", heightMm, widthMm, orientation, paper: { widthMm: plan.paper.widthMm, heightMm: plan.paper.heightMm }, copies: [], plan, tiles };
  }
  return tiled!;
}

export function sizeProblem(heightMm: number, unit: Unit): string | null {
  const [min, max] = LIMITS;
  if (!Number.isFinite(heightMm) || heightMm < min - 0.5 || heightMm > max + 0.5)
    return `The height must be between ${formatLength(min, unit)} and ${formatLength(max, unit)}.`;
  return null;
}

export function pathData(poly: Point[]): string {
  return `${poly.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ")} Z`;
}
