import { describe, expect, it } from "vitest";
import { captureOrder, createOrder, listEnabled, publicConfig, type PaymentEnv } from "@/lib/paypal";
import {
  fitFontPt,
  LABEL_FORMATS,
  labelPosition,
  parseAddresses,
  parseCsv,
  perSheet,
  rowToLines,
  sheetCount,
  ticketLayout,
  ticketNumber,
  ticketPosition,
  ticketProblem,
  unprintable,
} from "@/lib/sheets";

describe("label sheets", () => {
  it("keeps every layout inside its page, centred left to right", () => {
    for (const f of LABEL_FORMATS) {
      const last = labelPosition(f, perSheet(f) - 1);
      const right = last.x + f.labelW;
      const bottom = last.y + f.labelH;
      expect(right, f.id).toBeLessThanOrEqual(f.pageW + 0.01);
      expect(bottom, f.id).toBeLessThanOrEqual(f.pageH + 0.01);
      // Die-cut sheets are symmetric: the margin after the last column equals the one before the first.
      expect(f.pageW - right, f.id).toBeCloseTo(f.marginLeft, 0);
      expect(f.pitchX, f.id).toBeGreaterThanOrEqual(f.labelW);
      expect(f.pitchY, f.id).toBeGreaterThanOrEqual(f.labelH);
    }
  });

  it("places 5160 labels where the sheet has them", () => {
    const f = LABEL_FORMATS[0];
    expect(perSheet(f)).toBe(30);
    expect(labelPosition(f, 0)).toEqual({ x: 0.1875 * 25.4, y: 12.7 });
    // Second row, third column.
    const p = labelPosition(f, 5);
    expect(p.x).toBeCloseTo((0.1875 + 2 * 2.75) * 25.4, 5);
    expect(p.y).toBeCloseTo(1.5 * 25.4, 5);
    // Label 31 is the first label of sheet 2.
    expect(labelPosition(f, 30)).toEqual(labelPosition(f, 0));
    expect(sheetCount(f, 30)).toBe(1);
    expect(sheetCount(f, 31)).toBe(2);
    expect(sheetCount(f, 30, 1)).toBe(2);
    expect(sheetCount(f, 0)).toBe(0);
  });
});

describe("address parsing", () => {
  it("reads blocks separated by blank lines", () => {
    expect(parseAddresses("Ann Lee\n1 Oak St\nAustin, TX 78701\n\n\nBo Chan\n2 Elm Rd\nReno, NV 89501\n")).toEqual([
      ["Ann Lee", "1 Oak St", "Austin, TX 78701"],
      ["Bo Chan", "2 Elm Rd", "Reno, NV 89501"],
    ]);
  });

  it("reads rows pasted from a spreadsheet and drops the header", () => {
    const pasted = "Name\tStreet\tCity\tState\tZip\nAnn Lee\t1 Oak St\tAustin\tTX\t78701\nBo Chan\t2 Elm Rd\tReno\tNV\t89501";
    expect(parseAddresses(pasted)).toEqual([
      ["Ann Lee", "1 Oak St", "Austin, TX 78701"],
      ["Bo Chan", "2 Elm Rd", "Reno, NV 89501"],
    ]);
  });

  it("treats a short block as one address and a long comma list as one address per line", () => {
    expect(parseAddresses("Ann Lee\n1 Oak St\nAustin, TX 78701")).toEqual([["Ann Lee", "1 Oak St", "Austin, TX 78701"]]);
    const list = Array.from({ length: 8 }, (_, i) => `Person ${i}, ${i} Oak St, Austin, TX 78701`).join("\n");
    expect(parseAddresses(list)[3]).toEqual(["Person 3", "3 Oak St", "Austin, TX 78701"]);
    expect(parseAddresses("  \n ")).toEqual([]);
  });

  it("parses quoted CSV cells and joins city, state and ZIP", () => {
    expect(parseCsv('name,street,city,state,zip\r\n"Lee, Ann","1 Oak St, Apt 2",Austin,TX,78701\n')).toEqual([
      ["name", "street", "city", "state", "zip"],
      ["Lee, Ann", "1 Oak St, Apt 2", "Austin", "TX", "78701"],
    ]);
    expect(rowToLines(["Lee, Ann", "1 Oak St, Apt 2", "Austin", "TX", "78701"])).toEqual(["Lee, Ann", "1 Oak St, Apt 2", "Austin, TX 78701"]);
    expect(rowToLines(["Ann", "", "Austin"])).toEqual(["Ann", "Austin"]);
  });

  it("flags characters the PDF fonts cannot draw, but not accents", () => {
    expect(unprintable([["José Müller", "Zoë’s Café"]])).toEqual([]);
    expect(unprintable([["王小明", "Łódź"]])).toEqual(["王", "小", "明", "Ł", "ź"]);
  });

  it("shrinks text to fit the label, in half points, never below the floor", () => {
    const width = (line: string) => line.length * 0.2;
    expect(fitFontPt(["short"], 60, 20, 11, width)).toBe(11);
    expect(fitFontPt(["x".repeat(50)], 60, 20, 11, width)).toBe(6);
    expect(fitFontPt(["x".repeat(500)], 60, 20, 11, width)).toBe(5);
    // Six lines in a 1 in label: limited by height.
    expect(fitFontPt(Array(6).fill("ab"), 60, 20, 14, width)).toBeLessThan(14);
  });
});

describe("raffle tickets", () => {
  it("numbers in order with padding that fits the last ticket", () => {
    expect(ticketNumber({ prefix: "", start: 1, count: 200 }, 0)).toBe("001");
    expect(ticketNumber({ prefix: "", start: 1, count: 200 }, 199)).toBe("200");
    expect(ticketNumber({ prefix: "A", start: 995, count: 10 }, 9)).toBe("A1004");
    expect(ticketNumber({ prefix: "A", start: 995, count: 10 }, 0)).toBe("A0995");
  });

  it("fits eight tickets on either paper", () => {
    for (const paper of ["letter", "a4"] as const) {
      const L = ticketLayout(paper);
      const last = ticketPosition(L, 7);
      expect(last.x + L.ticketW).toBeCloseTo(L.pageW - L.marginX, 5);
      expect(last.y + L.ticketH).toBeCloseTo(L.pageH - L.marginY, 5);
      expect(ticketPosition(L, 8)).toEqual(ticketPosition(L, 0));
      expect(L.stubW).toBeLessThan(L.ticketW / 2);
    }
  });

  it("explains bad counts and start numbers", () => {
    expect(ticketProblem({ start: 1, count: 200 })).toBeNull();
    expect(ticketProblem({ start: 1, count: 0 })).toMatch(/at least 1/);
    expect(ticketProblem({ start: 1, count: 5001 })).toMatch(/batches/);
    expect(ticketProblem({ start: -1, count: 5 })).toMatch(/first ticket number/);
    expect(ticketProblem({ start: 1, count: Number.NaN })).not.toBeNull();
  });
});

describe("full list purchase", () => {
  const paypalOnly: PaymentEnv = { PAYPAL_CLIENT_ID: "cid", PAYPAL_SECRET: "shh", SVG_PAID: "1" };
  const waffo = { WAFFO_MERCHANT_ID: "MER_1", WAFFO_PRIVATE_KEY: "k", WAFFO_STORE_ID: "STO_1", WAFFO_PRODUCT_ID: "PROD_svg" };
  const fake = (body: unknown) => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    return {
      calls,
      fetchImpl: async (url: string, init?: RequestInit) => {
        calls.push({ url, init });
        return url.endsWith("/v1/oauth2/token") ? Response.json({ access_token: "tok" }) : Response.json(body);
      },
    };
  };
  const captured = (value: string, reference: string) => ({
    status: "COMPLETED",
    purchase_units: [{ reference_id: reference, payments: { captures: [{ status: "COMPLETED", amount: { value, currency_code: "USD" } }] } }],
  });

  it("is offered with PayPal alone, and with Waffo only once Waffo has its own product", () => {
    expect(listEnabled(paypalOnly)).toBe(true);
    expect(listEnabled({ ...paypalOnly, ...waffo })).toBe(false);
    expect(listEnabled({ ...paypalOnly, ...waffo, WAFFO_LIST_PRODUCT_ID: "PROD_list" })).toBe(true);
    expect(publicConfig(paypalOnly)).toMatchObject({ list: { price: "2.99" } });
    expect(publicConfig({ ...paypalOnly, ...waffo })).not.toHaveProperty("list");
  });

  it("creates and confirms the order at the list price only", async () => {
    const { fetchImpl, calls } = fake({ id: "ORDER123ABC" });
    await createOrder(paypalOnly, fetchImpl, "", "list");
    const unit = JSON.parse(String(calls.find((c) => c.url.endsWith("/v2/checkout/orders"))!.init?.body)).purchase_units[0];
    expect(unit).toMatchObject({ reference_id: "list", amount: { value: "2.99" } });
    const run = (value: string) => captureOrder(paypalOnly, "ORDER123ABC", fake(captured(value, "list")).fetchImpl);
    expect(await run("2.99")).toEqual({ ok: true, orderId: "ORDER123ABC", product: "list" });
    expect(await run("1.99")).toEqual({ ok: false, reason: "amount mismatch" });
  });
});
