/**
 * Browser-side record of what has been paid for. A single SVG lasts for the tab session (as the
 * stencil maker always did); the Christmas pack is kept in localStorage so it survives a restart.
 * The server has already confirmed the payment before anything is written here.
 */

export const PACK_EVENT = "tilestencil:pack";
const PACK_KEY = "tilestencil:pack:christmas";
const singleKey = (slug: string) => `tilestencil:svg-unlocked:${slug}`;

/** Gallery cards use `${category}-${slug}`; the three Christmas pattern pages use these slugs. */
export const PATTERN_SLUGS = ["christmas-pattern-stocking", "christmas-pattern-gingerbread-house", "christmas-pattern-gingerbread-man"] as const;
export const isChristmasSlug = (slug: string) => slug.startsWith("christmas-");

export function hasPack(): boolean {
  try {
    return Boolean(window.localStorage.getItem(PACK_KEY));
  } catch {
    return false;
  }
}

export function grantPack(orderId: string): void {
  try {
    window.localStorage.setItem(PACK_KEY, orderId);
  } catch {
    // Private mode: the pack still works until the page is closed, through the event below.
  }
  window.dispatchEvent(new Event(PACK_EVENT));
}

export function hasSingle(slug: string): boolean {
  try {
    return Boolean(window.sessionStorage.getItem(singleKey(slug)));
  } catch {
    return false;
  }
}

export function grantSingle(slug: string, orderId: string): void {
  try {
    window.sessionStorage.setItem(singleKey(slug), orderId);
  } catch {
    // Nothing to do: the caller keeps its own unlocked state for this page view.
  }
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const timedKey = (slug: string) => `tilestencil:paid:${slug}`;

/** A purchase that lasts 7 days in this browser (list tools: people come back to print more). */
export function hasTimed(slug: string, now = Date.now()): boolean {
  try {
    const until = Number(JSON.parse(window.localStorage.getItem(timedKey(slug)) ?? "{}").until);
    return Number.isFinite(until) && until > now;
  } catch {
    return false;
  }
}

export function grantTimed(slug: string, orderId: string, now = Date.now()): void {
  try {
    window.localStorage.setItem(timedKey(slug), JSON.stringify({ orderId, until: now + WEEK_MS }));
  } catch {
    // Private mode: the caller keeps its own unlocked state for this page view.
  }
}

export function saveFile(name: string, data: BlobPart, type: string): void {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
