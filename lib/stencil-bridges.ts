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
  /** Regions (white islands or black holes) smaller than this many pixels are removed. */
  minAreaPx: number;
  /** Bridging work is bounded; extra islands are reported but left alone. */
  maxIslands?: number;
}

export interface StencilCleanupResult {
  mask: Uint8Array;
  /** Islands that would fall out before cleanup (after speck removal). */
  islands: number;
  bridged: number;
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
    removeSpecks(mask, width, height, 0, options.minAreaPx) + removeSpecks(mask, width, height, 1, options.minAreaPx);

  const { labels, islandIds } = findIslands(mask, width, height);
  const islands = islandIds.length;
  if (islands === 0 || options.bridgePx <= 0) {
    return { mask, islands, bridged: 0, specksRemoved };
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

  // Multi-source BFS from the paper (edge-connected white plus the image frame,
  // since the page margin is paper too) through black pixels. The first time the
  // search touches an island, the parent chain is the shortest bridge to paper
  // that is already held in place.
  const parent = new Int32Array(mask.length).fill(-2); // -2 unvisited, -1 seed
  const queue = new Int32Array(mask.length);
  let head = 0;
  let tail = 0;
  const seed = (index: number) => {
    if (parent[index] !== -2) return;
    parent[index] = -1;
    queue[tail++] = index;
  };
  for (let i = 0; i < mask.length; i++) {
    const id = labels[i];
    const inIsland = id !== 0 && id <= maxId && isIsland[id] === 1;
    if (inIsland) continue;
    const x = i % width;
    const y = (i - x) / width;
    const onEdge = x === 0 || y === 0 || x === width - 1 || y === height - 1;
    if (mask[i] === 0 || onEdge) seed(i);
  }

  const radius = Math.max(0, (options.bridgePx - 1) / 2);
  const path: number[] = [];
  let bridged = 0;

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    for (let k = 0; k < 4; k++) {
      const next =
        k === 0 ? (x > 0 ? index - 1 : -1)
        : k === 1 ? (x < width - 1 ? index + 1 : -1)
        : k === 2 ? (index >= width ? index - width : -1)
        : (index + width < mask.length ? index + width : -1);
      if (next < 0 || parent[next] !== -2) continue;
      const id = labels[next];
      if (id !== 0 && id <= maxId && pending[id] === 1) {
        // Reached an island: record the chain back to the paper.
        pending[id] = 0;
        bridged++;
        let step = index;
        while (step >= 0) {
          path.push(step);
          step = parent[step];
        }
        // The island is now held; its pixels seed further searches (nested islands).
        for (const member of members.get(id)!) seed(member);
        continue;
      }
      if (mask[next] === 1) {
        parent[next] = index;
        queue[tail++] = next;
      }
    }
  }

  // Paint after the search so carving does not disturb it.
  for (const step of path) {
    const sx = step % width;
    paintDisc(mask, width, height, sx, (step - sx) / width, radius);
  }

  return { mask, islands, bridged, specksRemoved };
}
