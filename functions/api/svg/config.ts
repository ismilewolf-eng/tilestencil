import { publicConfig, type PaymentEnv } from "../../../lib/paypal";

type Context = { env: PaymentEnv };

/** GET /api/svg/config — whether SVG export is paid, and the public PayPal client id. */
export async function onRequestGet({ env }: Context): Promise<Response> {
  return Response.json(publicConfig(env), { headers: { "cache-control": "no-store" } });
}
