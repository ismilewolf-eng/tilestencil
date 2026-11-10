/**
 * "Tell us what you were looking for": one anonymous line from a visitor, kept in KV so we can
 * see which patterns people want next. No name, email or IP is stored.
 */

export const REQUEST_MAX = 300;

export interface StoredRequest {
  text: string;
  page: string;
  at: string;
  country?: string;
}

/** Trim, collapse whitespace, and refuse empty, oversized or link-stuffed text. Returns null when unusable. */
export function cleanRequest(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length < 3 || text.length > REQUEST_MAX) return null;
  if (/https?:\/\/|www\.|<a\s|\[url/i.test(text)) return null;
  return text;
}

/** Only our own paths, so the stored page cannot carry arbitrary text. */
export function cleanPage(value: unknown): string {
  return typeof value === "string" && /^\/[a-z0-9/_-]{0,80}$/i.test(value) ? value : "/";
}

export function requestKey(now: Date, random: string): string {
  return `req:${now.toISOString()}:${random}`;
}
