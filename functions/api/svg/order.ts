import { createOrder, paidEnabled, type PaymentEnv } from "../../../lib/paypal";

type Context = { env: PaymentEnv };

/** POST /api/svg/order — create a PayPal order for one SVG export at the configured price. */
export async function onRequestPost({ env }: Context): Promise<Response> {
  if (!paidEnabled(env)) return Response.json({ error: "payments off" }, { status: 404 });
  try {
    return Response.json(await createOrder(env), { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("svg order failed", error instanceof Error ? error.message : error);
    return Response.json({ error: "could not start payment" }, { status: 502 });
  }
}
