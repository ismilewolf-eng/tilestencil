import { sanitizeCustomId } from "../../../lib/attribution";
import { createOrder, paidEnabled, type PaymentEnv } from "../../../lib/paypal";

type Context = { env: PaymentEnv; request: Request };

/**
 * POST /api/svg/order — create a PayPal order for one SVG export at the configured price.
 * The optional body { source } is the buyer's first-referrer tag (lib/attribution), stored
 * as the order's custom_id so sales can be traced to Google, ChatGPT and so on.
 */
export async function onRequestPost({ env, request }: Context): Promise<Response> {
  if (!paidEnabled(env)) return Response.json({ error: "payments off" }, { status: 404 });
  try {
    const body = (await request.json().catch(() => ({}))) as { source?: unknown };
    return Response.json(await createOrder(env, (input, init) => fetch(input, init), sanitizeCustomId(body.source)), { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("svg order failed", error instanceof Error ? error.message : error);
    return Response.json({ error: "could not start payment" }, { status: 502 });
  }
}
