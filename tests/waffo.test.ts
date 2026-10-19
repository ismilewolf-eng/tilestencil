import { describe, expect, it } from "vitest";
import { publicConfig } from "@/lib/paypal";
import { checkOrder, createCheckout, isWaffoRef, signedPost, waffoEnabled, type WaffoEnv } from "@/lib/waffo";

async function keyPair() {
  const pair = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );
  const der = new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey));
  const base64 = btoa(String.fromCharCode(...der));
  return { publicKey: pair.publicKey, base64, pem: `-----BEGIN PRIVATE KEY-----\n${base64.match(/.{1,64}/g)!.join("\n")}\n-----END PRIVATE KEY-----` };
}

const ids = { WAFFO_MERCHANT_ID: "MER_x", WAFFO_STORE_ID: "STO_x", WAFFO_PRODUCT_ID: "PROD_x" };
const REF = "ts_0123456789abcdef0123456789abcdef";

function fakeWaffo(data: unknown, status = 200) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fetchImpl = async (url: string, init?: RequestInit) => {
    calls.push({ url, init: init ?? {} });
    return Response.json(status === 200 ? { data } : { data: null, errors: [{ message: "nope" }] }, { status });
  };
  return { fetchImpl, calls };
}

const order = (over: Record<string, unknown> = {}) => ({ id: "ORD_1", status: "completed", testMode: true, currency: "USD", onetimeProduct: { id: "PROD_x" }, ...over });

describe("waffo signing", () => {
  it("signs POST, path, timestamp and body hash so the public key verifies it", async () => {
    const { publicKey, pem } = await keyPair();
    const { fetchImpl, calls } = fakeWaffo({ ok: 1 });
    const env: WaffoEnv = { ...ids, WAFFO_PRIVATE_KEY: pem };
    await signedPost(env, "/v1/graphql", { query: "{ x }" }, fetchImpl, 1_700_000_000_000);
    const headers = calls[0].init.headers as Record<string, string>;
    expect(calls[0].url).toBe("https://api.waffo.ai/v1/graphql");
    expect(headers["X-Merchant-Id"]).toBe("MER_x");
    expect(headers["X-Timestamp"]).toBe("1700000000");
    const body = calls[0].init.body as string;
    const hash = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body)))));
    const signature = Uint8Array.from(atob(headers["X-Signature"]), (c) => c.charCodeAt(0));
    const canonical = new TextEncoder().encode(`POST\n/v1/graphql\n1700000000\n${hash}`);
    expect(await crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, signature, canonical)).toBe(true);
  });

  it("accepts a bare base64 key as shown in the dashboard", async () => {
    const { base64 } = await keyPair();
    const { fetchImpl } = fakeWaffo({ ok: 1 });
    await expect(signedPost({ ...ids, WAFFO_PRIVATE_KEY: base64 }, "/v1/graphql", {}, fetchImpl)).resolves.toEqual({ ok: 1 });
  });

  it("throws on API errors instead of returning half a result", async () => {
    const { base64 } = await keyPair();
    const { fetchImpl } = fakeWaffo(null, 401);
    await expect(signedPost({ ...ids, WAFFO_PRIVATE_KEY: base64 }, "/v1/graphql", {}, fetchImpl)).rejects.toThrow(/401/);
  });
});

describe("waffo checkout and order check", () => {
  it("is off until every id and the key are set, and never leaks the key", async () => {
    const { base64 } = await keyPair();
    expect(waffoEnabled({ ...ids })).toBe(false);
    const env = { ...ids, WAFFO_PRIVATE_KEY: base64, PAYPAL_CLIENT_ID: "cid", PAYPAL_SECRET: "shh", SVG_PAID: "1" };
    expect(waffoEnabled(env)).toBe(true);
    expect(publicConfig(env)).toMatchObject({ paid: true, waffo: { test: true } });
    expect(publicConfig({ ...env, WAFFO_ENV: "live" })).toMatchObject({ waffo: { test: false } });
    expect(JSON.stringify(publicConfig(env))).not.toContain(base64.slice(0, 20));
    expect(publicConfig({ ...env, WAFFO_PRODUCT_ID: undefined })).not.toHaveProperty("waffo");
  });

  it("creates a session with our product, a fresh reference and the return page", async () => {
    const { base64 } = await keyPair();
    const { fetchImpl, calls } = fakeWaffo({ checkoutUrl: "https://pancake.waffo.ai/store/s/checkout/cs_1" });
    const result = await createCheckout({ ...ids, WAFFO_PRIVATE_KEY: base64 }, { source: "ref=google.com", returnUrl: "https://tilestencil.com/payment-complete", language: "en" }, fetchImpl);
    expect(result.url).toBe("https://pancake.waffo.ai/store/s/checkout/cs_1");
    expect(isWaffoRef(result.ref)).toBe(true);
    const sent = JSON.parse(calls[0].init.body as string);
    expect(sent).toMatchObject({ productId: "PROD_x", currency: "USD", orderMerchantExternalId: result.ref, successUrl: "https://tilestencil.com/payment-complete", metadata: { source: "ref=google.com" } });
    expect(sent).not.toHaveProperty("priceSnapshot");
  });

  it("unlocks only a completed order for our product in the matching mode", async () => {
    const { base64 } = await keyPair();
    const env = { ...ids, WAFFO_PRIVATE_KEY: base64 };
    const run = (orders: unknown[], e: WaffoEnv = env) => checkOrder(e, REF, fakeWaffo({ onetimeOrders: orders }).fetchImpl);
    await expect(run([order()])).resolves.toEqual({ ok: true, orderId: "ORD_1" });
    await expect(run([])).resolves.toEqual({ ok: false, reason: "not found" });
    await expect(run([order({ status: "pending" })])).resolves.toEqual({ ok: false, reason: "pending" });
    await expect(run([order({ onetimeProduct: { id: "PROD_other" } })])).resolves.toEqual({ ok: false, reason: "mismatch" });
    await expect(run([order({ currency: "EUR" })])).resolves.toEqual({ ok: false, reason: "mismatch" });
    // A test-mode order must never unlock the live site.
    await expect(run([order()], { ...env, WAFFO_ENV: "live" })).resolves.toEqual({ ok: false, reason: "mismatch" });
  });

  it("rejects made-up references without calling Waffo", async () => {
    const { fetchImpl, calls } = fakeWaffo({ onetimeOrders: [order()] });
    await expect(checkOrder({ ...ids, WAFFO_PRIVATE_KEY: "x" }, "ORD_1", fetchImpl)).resolves.toEqual({ ok: false, reason: "bad ref" });
    expect(calls).toHaveLength(0);
  });
});
