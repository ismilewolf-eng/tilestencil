import type { PaymentEnv } from "../../../lib/paypal";
import { verifyWebhook } from "../../../lib/waffo";

type Context = { env: PaymentEnv; request: Request };

/**
 * POST /api/svg/waffo-webhook — Waffo's payment notifications. The SVG is already unlocked
 * in the buyer's browser by polling, so this only verifies the signature and logs the sale
 * (visible in Cloudflare's function logs) as a second record of every order and refund.
 */
export async function onRequestPost({ env, request }: Context): Promise<Response> {
  const raw = await request.text();
  try {
    const event = await verifyWebhook(env, raw, request.headers.get("x-waffo-signature"));
    console.log("waffo event", event.eventType, event.data.orderId ?? "", event.data.orderMerchantExternalId ?? "", event.data.amount ?? "", event.data.currency ?? "");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("waffo webhook rejected", error instanceof Error ? error.message : error);
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }
}
