import { describe, expect, it } from "vitest";
import { onRequestPost } from "@/functions/api/request";
import { cleanPage, cleanRequest } from "@/lib/request-box";

const post = (body: unknown) => new Request("https://tilestencil.com/api/request", { method: "POST", body: JSON.stringify(body) });

function fakeKv() {
  const saved: Array<{ key: string; value: string }> = [];
  return { saved, kv: { put: async (key: string, value: string) => void saved.push({ key, value }) } };
}

describe("pattern request box", () => {
  it("keeps a plain line and refuses empty, long or link-stuffed text", () => {
    expect(cleanRequest("  elf   stocking,\n18 in ")).toBe("elf stocking, 18 in");
    expect(cleanRequest("hi")).toBeNull();
    expect(cleanRequest("x".repeat(301))).toBeNull();
    expect(cleanRequest("cheap pills https://spam.example")).toBeNull();
    expect(cleanRequest(42)).toBeNull();
  });

  it("stores only our own page paths", () => {
    expect(cleanPage("/gingerbread-man-template/")).toBe("/gingerbread-man-template/");
    expect(cleanPage("/x?<script>")).toBe("/");
    expect(cleanPage(undefined)).toBe("/");
  });

  it("saves the text, page and time, and nothing that identifies the visitor", async () => {
    const { saved, kv } = fakeKv();
    const response = await onRequestPost({ env: { REQUESTS: kv }, request: post({ text: "a tree skirt for a 4 ft tree", page: "/christmas-tree-skirt-pattern/", website: "" }) });
    expect(response.status).toBe(200);
    expect(saved).toHaveLength(1);
    expect(saved[0].key.startsWith("req:")).toBe(true);
    expect(Object.keys(JSON.parse(saved[0].value)).sort()).toEqual(["at", "page", "text"]);
  });

  it("drops bot submissions quietly and rejects unusable text", async () => {
    const { saved, kv } = fakeKv();
    expect((await onRequestPost({ env: { REQUESTS: kv }, request: post({ text: "nice pattern please", website: "http://bot" }) })).status).toBe(200);
    expect((await onRequestPost({ env: { REQUESTS: kv }, request: post({ text: "" }) })).status).toBe(400);
    expect(saved).toHaveLength(0);
    expect((await onRequestPost({ env: {}, request: post({ text: "anything at all" }) })).status).toBe(503);
  });
});
