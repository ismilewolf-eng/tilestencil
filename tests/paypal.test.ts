import { describe, expect, it } from "vitest";
import { captureOrder, createOrder, paidEnabled, price, publicConfig, type PaymentEnv } from "@/lib/paypal";

const env: PaymentEnv = { PAYPAL_CLIENT_ID: "cid", PAYPAL_SECRET: "shh", SVG_PAID: "1", SVG_PRICE_USD: "2.99" };

/** A fake PayPal: token endpoint plus whatever the test routes. */
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

const completed = (value = "2.99", currency = "USD") => ({
  status: "COMPLETED",
  purchase_units: [{ payments: { captures: [{ status: "COMPLETED", amount: { value, currency_code: currency } }] } }],
});

describe("payment switch and public config", () => {
  it("stays free unless SVG_PAID=1 and both credentials exist", () => {
    expect(paidEnabled({ ...env, SVG_PAID: undefined })).toBe(false);
    expect(paidEnabled({ ...env, PAYPAL_SECRET: undefined })).toBe(false);
    expect(paidEnabled(env)).toBe(true);
    expect(publicConfig({})).toEqual({ paid: false });
  });

  it("never exposes the secret to the browser", () => {
    expect(JSON.stringify(publicConfig(env))).not.toContain("shh");
    expect(publicConfig(env)).toMatchObject({ paid: true, clientId: "cid", price: "2.99", sandbox: true });
  });

  it("falls back to the default price for nonsense values", () => {
    expect(price({ SVG_PRICE_USD: "abc" })).toBe("2.99");
    expect(price({ SVG_PRICE_USD: "0.01" })).toBe("2.99");
    expect(price({ SVG_PRICE_USD: "4.5" })).toBe("4.50");
  });
});

describe("createOrder", () => {
  it("creates a USD order at the configured price against the sandbox by default", async () => {
    const { fetchImpl, calls } = fakePaypal({ "/v2/checkout/orders": { body: { id: "ORDER123ABC" } } });
    expect(await createOrder(env, fetchImpl)).toEqual({ id: "ORDER123ABC" });
    const create = calls.find((c) => c.url.endsWith("/v2/checkout/orders"))!;
    expect(create.url).toContain("api-m.sandbox.paypal.com");
    expect(JSON.parse(String(create.init?.body)).purchase_units[0].amount).toEqual({ currency_code: "USD", value: "2.99" });
  });

  it("uses the live API only when PAYPAL_ENV=live", async () => {
    const { fetchImpl, calls } = fakePaypal({ "/v2/checkout/orders": { body: { id: "ORDER123ABC" } } });
    await createOrder({ ...env, PAYPAL_ENV: "live" }, fetchImpl);
    expect(calls.every((c) => c.url.startsWith("https://api-m.paypal.com"))).toBe(true);
  });
});

describe("captureOrder", () => {
  it("unlocks when PayPal confirms the full amount was captured", async () => {
    const { fetchImpl } = fakePaypal({ "/v2/checkout/orders/ORDER123ABC/capture": { body: completed() } });
    expect(await captureOrder(env, "ORDER123ABC", fetchImpl)).toEqual({ ok: true, orderId: "ORDER123ABC" });
  });

  it("refuses when the payment is not completed", async () => {
    const pending = { ...completed(), status: "PAYER_ACTION_REQUIRED" };
    const { fetchImpl } = fakePaypal({ "/v2/checkout/orders/ORDER123ABC/capture": { body: pending } });
    expect((await captureOrder(env, "ORDER123ABC", fetchImpl)).ok).toBe(false);
  });

  it("refuses when the captured amount or currency is wrong", async () => {
    for (const body of [completed("0.99"), completed("2.99", "EUR")]) {
      const { fetchImpl } = fakePaypal({ "/v2/checkout/orders/ORDER123ABC/capture": { body } });
      expect(await captureOrder(env, "ORDER123ABC", fetchImpl)).toEqual({ ok: false, reason: "amount mismatch" });
    }
  });

  it("rejects malformed order ids without calling PayPal", async () => {
    const { fetchImpl, calls } = fakePaypal({});
    expect(await captureOrder(env, "../../v1/oauth2/token", fetchImpl)).toEqual({ ok: false, reason: "bad order id" });
    expect(calls).toHaveLength(0);
  });

  it("accepts a retried capture if the order was already paid", async () => {
    const { fetchImpl } = fakePaypal({
      "/v2/checkout/orders/ORDER123ABC/capture": { status: 422, body: { details: [{ issue: "ORDER_ALREADY_CAPTURED" }] } },
      "/v2/checkout/orders/ORDER123ABC": { body: completed() },
    });
    expect(await captureOrder(env, "ORDER123ABC", fetchImpl)).toEqual({ ok: true, orderId: "ORDER123ABC" });
  });
});
