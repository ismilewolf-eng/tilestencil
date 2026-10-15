/**
 * Turn a black-and-white image into a stencil that can actually be cut.
 *
 * Convention: in `mask`, 1 = black = material that is cut away (paint passes
 * through), 0 = white = paper that stays. A white region completely enclosed
 * by black is an "island": once the black around it is cut, it falls out.
 * The area outside the image counts as paper, so white touching the image edge
 * is held in place.
 */

export interface StencilCleanupOptions {
  /** Bridge width in pixels; 0 disables bridging. */
  bridgePx: number;
  /** Black specks (cut holes) smaller than this many pixels are removed. */
  minAreaPx: number;
  /**
   * White regions smaller than this are filled in rather than bridged: on a real
   * photo, busy textures (grass, hair) break into hundreds of tiny islands that a
   * person would simply cut away. Defaults to minAreaPx.
   */
  minIslandPx?: number;
  /** Bridging work is bounded; extra islands are reported but left alone. */
  maxIslands?: number;
}

export interface StencilCleanupResult {
  mask: Uint8Array;
  /** Islands that would fall out before cleanup (after speck removal). */
  islands: number;
  bridged: number;
  /** Islands left alone because the bridging limit was reached. */
  unbridged: number;
  specksRemoved: number;
}

const DEFAULT_MAX_ISLANDS = 400;


/** Label 4-connected regions of pixels whose value equals `value`. Returns labels (0 = other value) and region sizes. */
function labelRegions(mask: Uint8Array, width: number, height: number, value: 0 | 1) {
  const labels = new Int32Array(mask.length);
  const sizes: number[] = [0];
  const touchesEdge: boolean[] = [false];
  const stack = new Int32Array(mask.length);

  for (let start = 0; start < mask.length; start++) {
    if (mask[start] !== value || labels[start] !== 0) continue;
    const id = sizes.length;
    let size = 0;
    let edge = false;
    let top = 0;
    stack[top++] = start;
    labels[start] = id;
    while (top > 0) {
      const index = stack[--top];
      size++;
      const x = index % width;
      const y = (index - x) / width;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) edge = true;
      if (x > 0 && mask[index - 1] === value && labels[index - 1] === 0) {
        labels[index - 1] = id;
        stack[top++] = index - 1;
      }
      if (x < width - 1 && mask[index + 1] === value && labels[index + 1] === 0) {
        labels[index + 1] = id;
        stack[top++] = index + 1;
      }
      if (y > 0 && mask[index - width] === value && labels[index - width] === 0) {
        labels[index - width] = id;
        stack[top++] = index - width;
      }
      if (y < height - 1 && mask[index + width] === value && labels[index + width] === 0) {
        labels[index + width] = id;
        stack[top++] = index + width;
      }
    }
    sizes.push(size);
    touchesEdge.push(edge);
  }
  return { labels, sizes, touchesEdge };
}

/** Remove regions of `value` smaller than minArea by flipping them to the other value. */
function removeSpecks(mask: Uint8Array, width: number, height: number, value: 0 | 1, minArea: number): number {
  if (minArea <= 1) return 0;
  const { labels, sizes } = labelRegions(mask, width, height, value);
  let removed = 0;
  const small = new Uint8Array(sizes.length);
  for (let id = 1; id < sizes.length; id++) {
    if (sizes[id] < minArea) {
      small[id] = 1;
      removed++;
    }
  }
  if (removed === 0) return 0;
  for (let i = 0; i < mask.length; i++) {
    if (labels[i] !== 0 && small[labels[i]]) mask[i] = value === 1 ? 0 : 1;
  }
  return removed;
}

/** White regions that do not touch the image edge, i.e. would fall out when cut. */
export function findIslands(mask: Uint8Array, width: number, height: number): { labels: Int32Array; islandIds: number[] } {
  const { labels, touchesEdge } = labelRegions(mask, width, height, 0);
  const islandIds: number[] = [];
  for (let id = 1; id < touchesEdge.length; id++) {
    if (!touchesEdge[id]) islandIds.push(id);
  }
  return { labels, islandIds };
}

function paintDisc(mask: Uint8Array, width: number, height: number, cx: number, cy: number, radius: number): void {
  const r = Math.max(0, radius);
  const r2 = (r + 0.5) * (r + 0.5);
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(width - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(height - 1, Math.ceil(cy + r));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) mask[y * width + x] = 0;
    }
  }
}

/**
 * Remove uncuttable specks, then connect every island to the surrounding paper
 * with a white bridge along the shortest path through the black.
 */
export function cleanupStencil(
  source: Uint8Array,
  width: number,
  height: number,
  options: StencilCleanupOptions,
): StencilCleanupResult {
  const mask = new Uint8Array(source);
  const specksRemoved =
    removeSpecks(mask, width, height, 0, options.minIslandPx ?? options.minAreaPx) +
    removeSpecks(mask, width, height, 1, options.minAreaPx);

  const { labels, islandIds } = findIslands(mask, width, height);
  const islands = islandIds.length;
  if (islands === 0 || options.bridgePx <= 0) {
    return { mask, islands, bridged: 0, unbridged: 0, specksRemoved };
  }

  const limit = options.maxIslands ?? DEFAULT_MAX_ISLANDS;
  const maxId = Math.max(...islandIds);
  const isIsland = new Uint8Array(maxId + 1);
  for (const id of islandIds) isIsland[id] = 1;

  // One pass: pixel lists per island (also gives sizes for prioritising).
  const members = new Map<number, number[]>();
  for (const id of islandIds) members.set(id, []);
  for (let i = 0; i < labels.length; i++) {
    const id = labels[i];
    if (id !== 0 && id <= maxId && isIsland[id]) members.get(id)!.push(i);
  }
  const ordered = [...islandIds].sort((a, b) => members.get(b)!.length - members.get(a)!.length);
  const pending = new Uint8Array(maxId + 1);
  for (const id of ordered.slice(0, limit)) pending[id] = 1;

  // Multi-source BFS (8-connected) from the paper (edge-connected white plus the
  // image frame, since the page margin is paper too) through black pixels. Each
  // visited pixel remembers which paper pixel it was reached from. The first time
  // the search touches an island, that origin is the nearest anchor, and the
  // bridge is drawn as a straight line to it rather than along the search path,
  // which would come out as a staircase.
  const origin = new Int32Array(mask.length).fill(-1);
  const queue = new Int32Array(mask.length);
  let head = 0;
  let tail = 0;
  const seed = (index: number) => {
    if (origin[index] !== -1) return;
    origin[index] = index;
    queue[tail++] = index;
  };
  for (let i = 0; i < mask.length; i++) {
    const id = labels[i];
    if (id !== 0 && id <= maxId && isIsland[id] === 1) continue;
    const x = i % width;
    const y = (i - x) / width;
    const onEdge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
    if (mask[i] === 0 || onEdge) seed(i);
  }

  const segments: Array<[number, number]> = [];
  let bridged = 0;
  const steps = [-1, 1, -width, width, -width - 1, -width + 1, width - 1, width + 1];

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    for (let k = 0; k < 8; k++) {
      const dx = k === 0 || k === 4 || k === 6 ? -1 : k === 1 || k === 5 || k === 7 ? 1 : 0;
      if ((dx === -1 && x === 0) || (dx === 1 && x === width - 1)) continue;
      const next = index + steps[k];
      if (next < 0 || next >= mask.length || origin[next] !== -1) continue;
      const id = labels[next];
      if (id !== 0 && id <= maxId && pending[id] === 1) {
        pending[id] = 0;
        bridged++;
        segments.push([origin[index], next]);
        // The island is now held; its pixels seed further searches (nested islands).
        for (const member of members.get(id)!) seed(member);
        continue;
      }
      if (mask[next] === 1) {
        origin[next] = origin[index];
        queue[tail++] = next;
      }
    }
  }

  // Paint after the search so carving does not disturb it.
  // At least 0.5 so each stamp is a plus shape: a diagonal line then stays
  // 4-connected instead of touching only at corners.
  const radius = Math.max(0.5, (options.bridgePx - 1) / 2);
  for (const [from, to] of segments) {
    const x0 = from % width;
    const y0 = (from - x0) / width;
    const x1 = to % width;
    const y1 = (to - x1) / width;
    const count = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      paintDisc(mask, width, height, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radius);
    }
  }

  return { mask, islands, bridged, unbridged: islands - bridged, specksRemoved };
}
