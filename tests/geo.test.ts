import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import robots from "../app/robots";

const ROOT = process.cwd();

describe("Generative Engine Optimization (GEO) assets", () => {
  it("publishes llms.txt and llms-full.txt in public directory", () => {
    const llmsPath = join(ROOT, "public", "llms.txt");
    const llmsFullPath = join(ROOT, "public", "llms-full.txt");

    expect(existsSync(llmsPath)).toBe(true);
    expect(existsSync(llmsFullPath)).toBe(true);

    const llms = readFileSync(llmsPath, "utf8");
    expect(llms).toContain("https://tilestencil.com");
    expect(llms).toContain("PrintableWidth");
    expect(llms).toContain("StrideX");

    const llmsFull = readFileSync(llmsFullPath, "utf8");
    expect(llmsFull).toContain("TileStencil Full Technical Documentation");
    expect(llmsFull).toContain("The Rasterbator");
  });

  it("explicitly permits major generative AI search bots in robots.ts", () => {
    const robotConfig = robots();
    const rules = Array.isArray(robotConfig.rules) ? robotConfig.rules : [robotConfig.rules];
    const aiRule = rules.find((r) => Array.isArray(r.userAgent) && r.userAgent.includes("GPTBot"));

    expect(aiRule).toBeDefined();
    expect(aiRule?.userAgent).toContain("ChatGPT-User");
    expect(aiRule?.userAgent).toContain("PerplexityBot");
    expect(aiRule?.userAgent).toContain("ClaudeBot");
    expect(aiRule?.userAgent).toContain("Google-Extended");
  });
});
