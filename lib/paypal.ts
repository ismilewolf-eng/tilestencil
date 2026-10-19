/**
 * Server-side PayPal helpers for paid SVG exports, used by the Cloudflare Pages
 * Functions in /functions. Kept free of platform types so they can be unit tested
 * with a mocked fetch.
 *
 * Environment (Pages project settings → Variables and secrets):
 *   PAYPAL_CLIENT_ID, PAYPAL_SECRET   REST app credentials (sandbox or live)
 *   PAYPAL_ENV                        "sandbox" (default) or "live"
 *   SVG_PAID                          "1" turns paid SVG on; anything else keeps SVG free
 *   SVG_PRICE_USD                     price per stencil, default "1.99"
 */

import { waffoEnabled, waffoTestMode, type WaffoEnv } from "./waffo";

export interface PaymentEnv extends WaffoEnv {
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_SECRET?: string;
  PAYPAL_ENV?: string;
  SVG_PAID?: string;
  SVG_PRICE_USD?: string;
}

type Fetch = (input: string, init?: RequestInit) => Promise<Response>;

export const DEFAULT_PRICE = "1.99";

export function apiBase(env: PaymentEnv): string {
  return env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

export function price(env: PaymentEnv): string {
  const value = Number(env.SVG_PRICE_USD ?? DEFAULT_PRICE);
  return Number.isFinite(value) && value >= 0.5 && value <= 100 ? value.toFixed(2) : DEFAULT_PRICE;
}

export function paidEnabled(env: PaymentEnv): boolean {
  return env.SVG_PAID === "1" && Boolean(env.PAYPAL_CLIENT_ID) && Boolean(env.PAYPAL_SECRET);
}

/**
 * What the browser needs to show the checkout: the PayPal button, plus the Waffo card /
 * wallet checkout when it is configured. Never includes a secret.
 */
export function publicConfig(env: PaymentEnv) {
  if (!paidEnabled(env)) return { paid: false };
  return {
    paid: true,
    clientId: env.PAYPAL_CLIENT_ID,
    price: price(env),
    currency: "USD",
    sandbox: env.PAYPAL_ENV !== "live",
    ...(waffoEnabled(env) ? { waffo: { test: waffoTestMode(env) } } : {}),
  };
}

async function accessToken(env: PaymentEnv, fetchImpl: Fetch): Promise<string> {
  const basic = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_SECRET}`);
  const response = await fetchImpl(`${apiBase(env)}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error(`paypal auth ${response.status}`);
  return ((await response.json()) as { access_token: string }).access_token;
}

/** customId: optional first-referrer tag shown as "Custom" on the PayPal transaction (max 127 chars). */
export async function createOrder(env: PaymentEnv, fetchImpl: Fetch = fetch, customId = ""): Promise<{ id: string }> {
  const token = await accessToken(env, fetchImpl);
  const response = await fetchImpl(`${apiBase(env)}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "TileStencil cut-ready SVG stencil export",
          amount: { currency_code: "USD", value: price(env) },
          ...(customId ? { custom_id: customId.slice(0, 127) } : {}),
        },
      ],
      application_context: { brand_name: "TileStencil", shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
    }),
  });
  if (!response.ok) throw new Error(`paypal create ${response.status}`);
  const order = (await response.json()) as { id: string };
  return { id: order.id };
}

export type CaptureResult = { ok: true; orderId: string } | { ok: false; reason: string };

/**
 * Capture the approved order and accept it only if PayPal reports the money as
 * captured for the expected amount. The browser's word that it "paid" is never trusted.
 */
export async function captureOrder(env: PaymentEnv, orderId: string, fetchImpl: Fetch = fetch): Promise<CaptureResult> {
  if (!/^[A-Z0-9]{8,32}$/.test(orderId)) return { ok: false, reason: "bad order id" };
  const token = await accessToken(env, fetchImpl);
  const response = await fetchImpl(`${apiBase(env)}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const body = (await response.json().catch(() => ({}))) as {
    status?: string;
    purchase_units?: Array<{ payments?: { captures?: Array<{ status?: string; amount?: { value?: string; currency_code?: string } }> } }>;
    details?: Array<{ issue?: string }>;
  };
  // A second capture of the same order means it was already paid (e.g. a retried request).
  if (!response.ok && body.details?.some((d) => d.issue === "ORDER_ALREADY_CAPTURED")) {
    return verifyOrder(env, orderId, token, fetchImpl);
  }
  if (!response.ok) return { ok: false, reason: `capture ${response.status}` };
  return checkCaptured(env, orderId, body);
}

async function verifyOrder(env: PaymentEnv, orderId: string, token: string, fetchImpl: Fetch): Promise<CaptureResult> {
  const response = await fetchImpl(`${apiBase(env)}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return { ok: false, reason: `lookup ${response.status}` };
  return checkCaptured(env, orderId, await response.json());
}

function checkCaptured(env: PaymentEnv, orderId: string, body: unknown): CaptureResult {
  const order = body as {
    status?: string;
    purchase_units?: Array<{ payments?: { captures?: Array<{ status?: string; amount?: { value?: string; currency_code?: string } }> } }>;
  };
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (order.status !== "COMPLETED" || capture?.status !== "COMPLETED") return { ok: false, reason: "not completed" };
  if (capture.amount?.currency_code !== "USD" || capture.amount?.value !== price(env)) return { ok: false, reason: "amount mismatch" };
  return { ok: true, orderId };
}
