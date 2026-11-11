import { describe, expect, it } from "vitest";
import { captureOrder, createOrder, offered, publicConfig, sheetEnabled, type PaymentEnv } from "@/lib/paypal";
import { stockingPattern, STOCKING_SIZES } from "@/lib/stocking";
import { SHEET_FOOTER_MM, SHEET_MARGIN_MM, sheetFileName, sheetFormat } from "@/lib/stocking-sheet";
import { asProduct } from "@/lib/waffo";

const paypalOnly: PaymentEnv = { PAYPAL_CLIENT_ID: "cid", PAYPAL_SECRET: "shh", SVG_PAID: "1" };
const waffo = { WAFFO_MERCHANT_ID: "MER_1", WAFFO_PRIVATE_KEY: "k", WAFFO_STORE_ID: "STO_1", WAFFO_PRODUCT_ID: "PROD_svg" };

function fakePaypal(body: unknown) {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    if (url.endsWith("/v1/oauth2/token")) return Response.json({ access_token: "tok" });
    return Response.json(body);
  };
  return { fetchImpl, calls };
}

const captured = (value: string, reference?: string) => ({
  status: "COMPLETED",
  purchase_units: [{ ...(reference ? { reference_id: reference } : {}), payments: { captures: [{ status: "COMPLETED", amount: { value, currency_code: "USD" } }] } }],
});

describe("print-shop sheet", () => {
  it("picks a standard sheet every stocking size fits on, with room for the margins", () => {
    for (const { id } of STOCKING_SIZES) {
      const pattern = stockingPattern(id);
      for (const paper of ["letter", "a4"] as const) {
        const format = sheetFormat(id, paper);
        expect(format.widthMm).toBeGreaterThanOrEqual(pattern.widthMm + 2 * SHEET_MARGIN_MM);
        expect(format.heightMm).toBeGreaterThanOrEqual(pattern.heightMm + 2 * SHEET_MARGIN_MM + SHEET_FOOTER_MM);
      }
    }
    expect(sheetFormat("small", "letter").label).toBe("24 × 36 in");
    expect(sheetFormat("small", "a4").label).toBe("A1");
    expect(sheetFileName("large", sheetFormat("large", "a4"))).toMatch(/^christmas-stocking-large-print-shop-a[01]\.pdf$/);
  });

  it("is offered with PayPal alone, and with Waffo only once Waffo has its own product", () => {
    expect(sheetEnabled(paypalOnly)).toBe(true);
    expect(sheetEnabled({ ...paypalOnly, ...waffo })).toBe(false);
    expect(sheetEnabled({ ...paypalOnly, ...waffo, WAFFO_SHEET_PRODUCT_ID: "PROD_sheet" })).toBe(true);
    expect(offered({ ...paypalOnly, ...waffo }, "sheet")).toBe(false);
    expect(publicConfig(paypalOnly)).toMatchObject({ sheet: { price: "1.99" } });
    expect(publicConfig({ ...paypalOnly, ...waffo })).not.toHaveProperty("sheet");
    expect(asProduct("sheet")).toBe("sheet");
  });

  it("marks the PayPal order so it can be told from an SVG at the same price", async () => {
    const { fetchImpl, calls } = fakePaypal({ id: "ORDER123ABC" });
    await createOrder(paypalOnly, fetchImpl, "", "sheet");
    const unit = JSON.parse(String(calls.find((c) => c.url.endsWith("/v2/checkout/orders"))!.init?.body)).purchase_units[0];
    expect(unit).toMatchObject({ reference_id: "sheet", amount: { value: "1.99" } });
    await expect(createOrder({ ...paypalOnly, ...waffo }, fetchImpl, "", "sheet")).rejects.toThrow("sheet not offered");
  });

  it("unlocks the sheet only for a sheet order captured at the sheet price", async () => {
    const run = (value: string, reference?: string, env = paypalOnly) => captureOrder(env, "ORDER123ABC", fakePaypal(captured(value, reference)).fetchImpl);
    expect(await run("1.99", "sheet")).toEqual({ ok: true, orderId: "ORDER123ABC", product: "sheet" });
    expect(await run("1.99", "svg")).toEqual({ ok: true, orderId: "ORDER123ABC", product: "svg" });
    expect(await run("1.99")).toEqual({ ok: true, orderId: "ORDER123ABC", product: "svg" });
    expect(await run("0.99", "sheet")).toEqual({ ok: false, reason: "amount mismatch" });
    expect(await run("1.99", "sheet", { ...paypalOnly, ...waffo })).toEqual({ ok: false, reason: "amount mismatch" });
  });
});
