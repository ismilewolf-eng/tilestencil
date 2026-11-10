import { describe, expect, it } from "vitest";
import { captureOrder, createOrder, packEnabled, publicConfig, type PaymentEnv } from "@/lib/paypal";
import { asProduct } from "@/lib/waffo";

const paypalOnly: PaymentEnv = { PAYPAL_CLIENT_ID: "cid", PAYPAL_SECRET: "shh", SVG_PAID: "1" };
const waffo = { WAFFO_MERCHANT_ID: "MER_1", WAFFO_PRIVATE_KEY: "k", WAFFO_STORE_ID: "STO_1", WAFFO_PRODUCT_ID: "PROD_svg" };

function fakePaypal(routes: Record<string, { status?: number; body: unknown }>) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    if (url.endsWith("/v1/oauth2/token")) return Response.json({ access_token: "tok" });
    const key = Object.keys(routes).find((k) => url.endsWith(k));
    if (!key) return new Response("not found", { status: 404 });
    return Response.json(routes[key].body, { status: routes[key].status ?? 200 });
  };
  return { fetchImpl, calls };
}

const captured = (value: string) => ({
  status: "COMPLETED",
  purchase_units: [{ payments: { captures: [{ status: "COMPLETED", amount: { value, currency_code: "USD" } }] } }],
});

describe("Christmas pack", () => {
  it("is offered with PayPal alone, and with Waffo only once Waffo has its own pack product", () => {
    expect(packEnabled(paypalOnly)).toBe(true);
    expect(packEnabled({ ...paypalOnly, ...waffo })).toBe(false);
    expect(packEnabled({ ...paypalOnly, ...waffo, WAFFO_PACK_PRODUCT_ID: "PROD_pack" })).toBe(true);
    expect(packEnabled({ ...paypalOnly, SVG_PAID: undefined })).toBe(false);
    // Same price as one SVG: a capture could not be told apart, so no pack.
    expect(packEnabled({ ...paypalOnly, PACK_PRICE_USD: "1.99" })).toBe(false);
  });

  it("shows its price in the public config only when offered", () => {
    expect(publicConfig(paypalOnly)).toMatchObject({ price: "1.99", pack: { price: "4.99" } });
    expect(publicConfig({ ...paypalOnly, ...waffo })).not.toHaveProperty("pack");
  });

  it("creates the order at the pack price and refuses when the pack is off", async () => {
    const { fetchImpl, calls } = fakePaypal({ "/v2/checkout/orders": { body: { id: "ORDER123ABC" } } });
    await createOrder(paypalOnly, fetchImpl, "", "pack");
    const unit = JSON.parse(String(calls.find((c) => c.url.endsWith("/v2/checkout/orders"))!.init?.body)).purchase_units[0];
    expect(unit.amount.value).toBe("4.99");
    await expect(createOrder({ ...paypalOnly, ...waffo }, fetchImpl, "", "pack")).rejects.toThrow("pack not offered");
  });

  it("decides what was bought from the amount PayPal captured", async () => {
    const run = (value: string, env = paypalOnly) =>
      captureOrder(env, "ORDER123ABC", fakePaypal({ "/v2/checkout/orders/ORDER123ABC/capture": { body: captured(value) } }).fetchImpl);
    expect(await run("4.99")).toEqual({ ok: true, orderId: "ORDER123ABC", product: "pack" });
    expect(await run("1.99")).toEqual({ ok: true, orderId: "ORDER123ABC", product: "svg" });
    expect(await run("0.99")).toEqual({ ok: false, reason: "amount mismatch" });
    // With the pack off, 4.99 is not a price we sell at.
    expect(await run("4.99", { ...paypalOnly, ...waffo })).toEqual({ ok: false, reason: "amount mismatch" });
  });

  it("treats anything but 'pack' as one SVG", () => {
    expect(asProduct("pack")).toBe("pack");
    expect(asProduct(undefined)).toBe("svg");
    expect(asProduct("free")).toBe("svg");
  });
});
