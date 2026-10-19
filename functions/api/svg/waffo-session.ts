import { sanitizeCustomId } from "../../../lib/attribution";
import { paidEnabled, type PaymentEnv } from "../../../lib/paypal";
import { createCheckout, waffoEnabled } from "../../../lib/waffo";

type Context = { env: PaymentEnv; request: Request };

/**
 * POST /api/svg/waffo-session {source?, locale?} — start a Waffo hosted checkout for one SVG
 * export. Returns { ref, url }: the browser opens url in a new tab and polls ref.
 */
export async function onRequestPost({ env, request }: Context): Promise<Response> {
  if (!paidEnabled(env) || !waffoEnabled(env)) return Response.json({ error: "payments off" }, { status: 404 });
  try {
    const body = (await request.json().catch(() => ({}))) as { source?: unknown; locale?: unknown };
    const session = await createCheckout(env, {
      source: sanitizeCustomId(body.source),
      returnUrl: new URL("/payment-complete", request.url).toString(),
      language: body.locale === "en" ? "en" : "zh-Hans",
    });
    return Response.json(session, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("waffo session failed", error instanceof Error ? error.message : error);
    return Response.json({ error: "could not start payment" }, { status: 502 });
  }
}
