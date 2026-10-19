import { paidEnabled, type PaymentEnv } from "../../../lib/paypal";
import { checkOrder, isWaffoRef, waffoEnabled } from "../../../lib/waffo";

type Context = { env: PaymentEnv; request: Request };

/** POST /api/svg/waffo-status {ref} — unlock only once Waffo reports the order as paid. */
export async function onRequestPost({ env, request }: Context): Promise<Response> {
  if (!paidEnabled(env) || !waffoEnabled(env)) return Response.json({ error: "payments off" }, { status: 404 });
  const { ref } = (await request.json().catch(() => ({}))) as { ref?: unknown };
  if (!isWaffoRef(ref)) return Response.json({ ok: false, reason: "bad ref" }, { status: 400 });
  try {
    return Response.json(await checkOrder(env, ref), { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("waffo status failed", error instanceof Error ? error.message : error);
    return Response.json({ ok: false, reason: "payment check failed" }, { status: 502 });
  }
}
