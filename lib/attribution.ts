/**
 * Order attribution without analytics. On the first visit the browser keeps one
 * line in localStorage: which site sent the visitor (e.g. google.com, chatgpt.com),
 * any utm_source, the landing path and the date. Nothing is sent anywhere until the
 * visitor buys an SVG; then that line rides along as the PayPal order's custom_id
 * so a sale can be traced to Google, ChatGPT, Pinterest and so on.
 */

export const FIRST_TOUCH_KEY = "ts-first-touch";
const OWN_HOSTS = ["tilestencil.com", "tilestencil.pages.dev", "localhost", "127.0.0.1"];
/** PayPal limits custom_id to 127 characters. */
export const CUSTOM_ID_MAX = 127;

export interface FirstTouch {
  /** Referring host without "www.", or "direct". */
  ref: string;
  utm: string;
  landing: string;
  date: string;
}

const clean = (value: string, max: number) => value.replace(/[^A-Za-z0-9._\-/]/g, "").slice(0, max);

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

const isOwn = (host: string) => OWN_HOSTS.some((own) => host === own || host.endsWith(`.${own}`));

/** The first-touch record for a page view, or null when the visitor came from our own pages. */
export function firstTouchFrom(href: string, referrer: string, now: Date): FirstTouch | null {
  const refHost = hostOf(referrer);
  if (refHost && isOwn(refHost)) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  return {
    ref: clean(refHost || "direct", 40),
    utm: clean(url.searchParams.get("utm_source") ?? "", 30),
    landing: clean(url.pathname, 50) || "/",
    date: now.toISOString().slice(0, 10),
  };
}

/** Compact tag for PayPal, e.g. "ref=chatgpt.com;utm=chatgpt.com;land=/free-stencils/halloween;d=2026-10-18". */
export function sourceTag(touch: FirstTouch | null, page: string): string {
  const parts = touch
    ? [`ref=${touch.ref}`, touch.utm && `utm=${touch.utm}`, `land=${touch.landing}`, `d=${touch.date}`]
    : ["ref=unknown"];
  parts.push(`buy=${clean(page, 40) || "/"}`);
  return sanitizeCustomId(parts.filter(Boolean).join(";"));
}

/** Server-side guard: only the characters sourceTag produces, capped at PayPal's limit. */
export function sanitizeCustomId(value: unknown): string {
  return typeof value === "string" ? value.replace(/[^A-Za-z0-9._\-/=;]/g, "").slice(0, CUSTOM_ID_MAX) : "";
}

/** Browser only: store the first touch once and never overwrite it. */
export function rememberFirstTouch(): void {
  try {
    if (localStorage.getItem(FIRST_TOUCH_KEY)) return;
    const touch = firstTouchFrom(location.href, document.referrer, new Date());
    if (touch) localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch));
  } catch {
    // Storage blocked (private mode, settings): the sale is simply untagged.
  }
}

export function readFirstTouch(): FirstTouch | null {
  try {
    const raw = localStorage.getItem(FIRST_TOUCH_KEY);
    return raw ? (JSON.parse(raw) as FirstTouch) : null;
  } catch {
    return null;
  }
}
