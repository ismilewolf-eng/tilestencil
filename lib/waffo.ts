/**
 * Server-side Waffo Pancake helpers for paid SVG exports: a hosted card / Apple Pay /
 * Google Pay / WeChat Pay checkout offered next to PayPal. Requests are signed with
 * Web Crypto, so this runs unchanged in Cloudflare Pages Functions and in Node tests.
 *
 * Environment (Pages project settings → Variables and secrets):
 *   WAFFO_MERCHANT_ID   MER_…
 *   WAFFO_PRIVATE_KEY   RSA private key of the API key (PEM or bare base64; test and live keys differ)
 *   WAFFO_STORE_ID      STO_…
 *   WAFFO_PRODUCT_ID    PROD_… (one-time product priced to match SVG_PRICE_USD)
 *   WAFFO_ENV           "test" (default) or "live"; must match the key
 *
 * Flow: the browser asks for a checkout session, opens it in a new tab, then polls the
 * order by our own random reference (orderMerchantExternalId). Only an order Waffo
 * reports as completed, for our product, in the right mode, unlocks the export.
 */

export interface WaffoEnv {
  WAFFO_MERCHANT_ID?: string;
  WAFFO_PRIVATE_KEY?: string;
  WAFFO_STORE_ID?: string;
  WAFFO_PRODUCT_ID?: string;
  WAFFO_ENV?: string;
}

type Fetch = (input: string, init?: RequestInit) => Promise<Response>;

const API_BASE = "https://api.waffo.ai";
const REF_PATTERN = /^ts_[0-9a-f]{32}$/;

export function waffoEnabled(env: WaffoEnv): boolean {
  return Boolean(env.WAFFO_MERCHANT_ID && env.WAFFO_PRIVATE_KEY && env.WAFFO_STORE_ID && env.WAFFO_PRODUCT_ID);
}

export const waffoTestMode = (env: WaffoEnv) => env.WAFFO_ENV !== "live";

export const isWaffoRef = (ref: unknown): ref is string => typeof ref === "string" && REF_PATTERN.test(ref);

export function newWaffoRef(): string {
  return `ts_${crypto.randomUUID().replace(/-/g, "")}`;
}

const keyCache = new Map<string, Promise<CryptoKey>>();

function importKey(raw: string): Promise<CryptoKey> {
  let key = keyCache.get(raw);
  if (!key) {
    const base64 = raw.replace(/\\n/g, "\n").replace(/-----(BEGIN|END) (RSA )?PRIVATE KEY-----/g, "").replace(/\s+/g, "");
    const der = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    key = crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    keyCache.set(raw, key);
  }
  return key;
}

function toBase64(buffer: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** Signs "POST\n{path}\n{unix seconds}\n{base64 sha256(body)}" with RSA-SHA256, as the Pancake API expects. */
export async function signedPost(env: WaffoEnv, path: string, body: unknown, fetchImpl: Fetch = fetch, now = Date.now()) {
  const text = JSON.stringify(body);
  const timestamp = Math.floor(now / 1000).toString();
  const encoder = new TextEncoder();
  const bodyHash = toBase64(await crypto.subtle.digest("SHA-256", encoder.encode(text)));
  const key = await importKey(env.WAFFO_PRIVATE_KEY ?? "");
  const signature = toBase64(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, encoder.encode(`POST\n${path}\n${timestamp}\n${bodyHash}`)));
  const response = await fetchImpl(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Merchant-Id": env.WAFFO_MERCHANT_ID ?? "",
      "X-Timestamp": timestamp,
      "X-Signature": signature,
    },
    body: text,
  });
  const envelope = (await response.json().catch(() => ({}))) as { data?: unknown; errors?: Array<{ message?: string }> };
  if (!response.ok || envelope.errors?.length) {
    throw new Error(`waffo ${path} ${response.status} ${envelope.errors?.[0]?.message ?? ""}`.trim());
  }
  return envelope.data;
}

/**
 * Start a hosted checkout. `source` is the buyer's first-referrer tag (lib/attribution);
 * `returnUrl` is where Waffo's "Done" button leads after payment.
 */
export async function createCheckout(
  env: WaffoEnv,
  { source = "", returnUrl, language }: { source?: string; returnUrl: string; language: "en" | "zh-Hans" },
  fetchImpl: Fetch = fetch,
): Promise<{ ref: string; url: string }> {
  const ref = newWaffoRef();
  const data = (await signedPost(
    env,
    "/v1/actions/checkout/create-session",
    {
      productId: env.WAFFO_PRODUCT_ID,
      currency: "USD",
      orderMerchantExternalId: ref,
      metadata: source ? { source: source.slice(0, 127) } : {},
      successUrl: returnUrl,
      expiresInSeconds: 3600,
      language,
    },
    fetchImpl,
  )) as { checkoutUrl?: string };
  if (!data?.checkoutUrl?.startsWith("https://")) throw new Error("waffo session without url");
  return { ref, url: data.checkoutUrl };
}

export type WaffoStatus = { ok: true; orderId: string } | { ok: false; reason: "pending" | "not found" | "bad ref" | "mismatch" };

type OrderRow = { id?: string; status?: string; testMode?: boolean; currency?: string; onetimeProduct?: { id?: string } | null };

/** Has the order behind this reference been paid? The browser's word is never trusted. */
export async function checkOrder(env: WaffoEnv, ref: string, fetchImpl: Fetch = fetch): Promise<WaffoStatus> {
  if (!isWaffoRef(ref)) return { ok: false, reason: "bad ref" };
  const data = (await signedPost(
    env,
    "/v1/graphql",
    {
      query: `query($storeId: String!, $ref: String!) {
        onetimeOrders(storeId: $storeId, filter: { orderMerchantExternalId: { eq: $ref } }) {
          id status testMode currency onetimeProduct { id }
        }
      }`,
      variables: { storeId: env.WAFFO_STORE_ID, ref },
    },
    fetchImpl,
  )) as { onetimeOrders?: OrderRow[] } | null;
  const orders = data?.onetimeOrders ?? [];
  if (!orders.length) return { ok: false, reason: "not found" };
  const paid = orders.find((order) => order.status === "completed");
  if (!paid) return { ok: false, reason: "pending" };
  if (paid.onetimeProduct?.id !== env.WAFFO_PRODUCT_ID || paid.currency !== "USD" || paid.testMode !== waffoTestMode(env)) {
    return { ok: false, reason: "mismatch" };
  }
  return { ok: true, orderId: paid.id ?? ref };
}
