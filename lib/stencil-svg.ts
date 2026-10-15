/**
 * Trace a black-and-white stencil mask (1 = black, cut away) into closed SVG
 * paths for cutting machines and laser cutters.
 *
 * Boundaries run along pixel edges, so every path is closed and paths never
 * cross. Black pixels that touch only at a corner stay separate, matching the
 * 4-connected regions used for island detection. Staircase edges are then
 * simplified so diagonals and curves come out as straight segments.
 */

export interface TracedPath {
  d: string;
  loops: number;
}

// Directions on the pixel-corner grid: 0 = +x, 1 = +y (down), 2 = -x, 3 = -y.
const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];

function simplifyClosed(points: number[], epsilon: number): number[] {
  // points: flat [x0, y0, x1, y1, ...] of a closed polygon (first point not repeated).
  const n = points.length / 2;
  if (n <= 4 || epsilon <= 0) return points;
  // Split at the vertex farthest from vertex 0 and simplify both halves (Douglas–Peucker).
  let far = 0;
  let best = -1;
  for (let i = 1; i < n; i++) {
    const d = (points[2 * i] - points[0]) ** 2 + (points[2 * i + 1] - points[1]) ** 2;
    if (d > best) {
      best = d;
      far = i;
    }
  }
  const keep = new Uint8Array(n + 1);
  keep[0] = keep[far] = keep[n] = 1;
  const px = (i: number) => points[2 * (i % n)];
  const py = (i: number) => points[2 * (i % n) + 1];
  const stack: Array<[number, number]> = [[0, far], [far, n]];
  const eps2 = epsilon * epsilon;
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const ax = px(a);
    const ay = py(a);
    const bx = px(b);
    const by = py(b);
    const len2 = (bx - ax) ** 2 + (by - ay) ** 2;
    let index = -1;
    let max = eps2;
    for (let i = a + 1; i < b; i++) {
      const x = px(i);
      const y = py(i);
      const dist2 = len2 === 0
        ? (x - ax) ** 2 + (y - ay) ** 2
        : ((by - ay) * x - (bx - ax) * y + bx * ay - by * ax) ** 2 / len2;
      if (dist2 > max) {
        max = dist2;
        index = i;
      }
    }
    if (index >= 0) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  const out: number[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(points[2 * i], points[2 * i + 1]);
  return out.length >= 6 ? out : points;
}

export function traceMask(mask: Uint8Array, width: number, height: number, epsilon = 0.75): TracedPath {
  const gridW = width + 1;
  const out = new Uint8Array(gridW * (height + 1)); // bitmask of outgoing boundary directions per corner
  const black = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x] === 1;

  // Walk each black pixel clockwise (screen coordinates); keep edges facing white.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!black(x, y)) continue;
      if (!black(x, y - 1)) out[y * gridW + x] |= 1; // top: (x,y) -> (x+1,y)
      if (!black(x + 1, y)) out[y * gridW + x + 1] |= 2; // right: (x+1,y) -> (x+1,y+1)
      if (!black(x, y + 1)) out[(y + 1) * gridW + x + 1] |= 4; // bottom: (x+1,y+1) -> (x,y+1)
      if (!black(x - 1, y)) out[(y + 1) * gridW + x] |= 8; // left: (x,y+1) -> (x,y)
    }
  }

  const parts: string[] = [];
  let loops = 0;
  const single = (bits: number) => bits === 1 || bits === 2 || bits === 4 || bits === 8;

  const walk = (start: number) => {
    let v = start;
    let dir = Math.log2(out[v] & -out[v]); // lowest set bit
    const corners: number[] = [];
    let prevDir = -1;
    for (;;) {
      if (dir !== prevDir) corners.push(v % gridW, Math.floor(v / gridW));
      out[v] &= ~(1 << dir);
      prevDir = dir;
      v += DX[dir] + DY[dir] * gridW;
      // Prefer a right turn: with black on the right, this keeps corner-touching pixels apart.
      const right = (dir + 1) % 4;
      const left = (dir + 3) % 4;
      if (out[v] & (1 << right)) dir = right;
      else if (out[v] & (1 << dir)) dir = dir;
      else if (out[v] & (1 << left)) dir = left;
      else break; // closed (back at an exhausted corner)
    }
    // The first corner may be redundant if the loop ends moving in the start direction.
    const simplified = simplifyClosed(corners, epsilon);
    if (simplified.length < 6) return;
    let d = `M${simplified[0]} ${simplified[1]}`;
    for (let i = 2; i < simplified.length; i += 2) d += `L${simplified[i]} ${simplified[i + 1]}`;
    parts.push(d + "Z");
    loops++;
  };

  // Start on unambiguous corners so a loop never closes early at a shared corner.
  for (let v = 0; v < out.length; v++) if (single(out[v])) walk(v);
  for (let v = 0; v < out.length; v++) while (out[v]) walk(v);

  return { d: parts.join(""), loops };
}

/** A complete SVG document at physical size (mm), black = cut area, even-odd so holes stay open. */
export function stencilSvg(trace: TracedPath, widthPx: number, heightPx: number, widthMm: number, heightMm: number): string {
  const mm = (n: number) => Math.round(n * 100) / 100;
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${mm(widthMm)}mm" height="${mm(heightMm)}mm" viewBox="0 0 ${widthPx} ${heightPx}">`,
    `<title>Stencil made with TileStencil (tilestencil.com)</title>`,
    `<path fill="#000" fill-rule="evenodd" d="${trace.d}"/>`,
    `</svg>`,
    "",
  ].join("\n");
}
