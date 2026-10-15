import { captureOrder, paidEnabled, type PaymentEnv } from "../../../lib/paypal";

type Context = { env: PaymentEnv; request: Request };

/** POST /api/svg/capture {orderId} — capture the order; unlock only if PayPal confirms the money. */
export async function onRequestPost({ env, request }: Context): Promise<Response> {
  if (!paidEnabled(env)) return Response.json({ error: "payments off" }, { status: 404 });
  const { orderId } = (await request.json().catch(() => ({}))) as { orderId?: unknown };
  if (typeof orderId !== "string") return Response.json({ ok: false, reason: "missing order" }, { status: 400 });
  try {
    const result = await captureOrder(env, orderId);
    return Response.json(result, { status: result.ok ? 200 : 402, headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("svg capture failed", error instanceof Error ? error.message : error);
    return Response.json({ ok: false, reason: "payment check failed" }, { status: 502 });
  }
}
