import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ES } from "../lib/i18n/es";
import { PT } from "../lib/i18n/pt";
import { hasPage, languageAlternates, localizedPath, tr } from "../lib/locale";

/** Files whose text shows on the Portuguese and Spanish pages. */
const LOCALIZED_FILES = [
  "components/TileStencilApp.tsx",
  "components/SvgPaywall.tsx",
  "components/LetterStencilSource.tsx",
  "components/SiteFooter.tsx",
  "components/StencilExample.tsx",
  "components/StencilLanding.tsx",
  "lib/sample-presets.ts",
  "lib/examples.ts",
];

const STRING = String.raw`"((?:[^"\\\n]|\\.)*)"`;
/** Chinese/English pairs as written in the source: t("中", "En"), tr(locale, "中", "En"), [..], zh:/en: fields. */
const PAIR_PATTERNS = [
  new RegExp(String.raw`\b(?:t|tr\(locale,|text\(locale,)\(?\s*${STRING}\s*,\s*${STRING}`, "g"),
  new RegExp(String.raw`\[\s*${STRING}\s*,\s*${STRING}\s*\]`, "g"),
  new RegExp(String.raw`\bzh:\s*${STRING}\s*,\s*en:\s*${STRING}`, "g"),
];
const EN_FIRST = new RegExp(String.raw`\ben:\s*${STRING}\s*,\s*zh:\s*${STRING}`, "g");

const unescape = (value: string) => JSON.parse(`"${value}"`) as string;

export function englishStrings(): string[] {
  const found = new Set<string>();
  for (const file of LOCALIZED_FILES) {
    const source = readFileSync(file, "utf8");
    for (const pattern of PAIR_PATTERNS) {
      for (const match of source.matchAll(pattern)) {
        // Only pairs whose first string is Chinese are text pairs.
        if (/[一-鿿]/.test(match[1])) found.add(unescape(match[2]));
      }
    }
    for (const match of source.matchAll(EN_FIRST)) found.add(unescape(match[1]));
  }
  return [...found].sort();
}

describe("Portuguese and Spanish", () => {
  const keys = englishStrings();

  it("finds the interface text", () => {
    expect(keys.length).toBeGreaterThan(150);
    expect(keys).toContain("Export tiled PDF");
  });

  it("translates every interface string", () => {
    expect(keys.filter((key) => !(key in PT))).toEqual([]);
    expect(keys.filter((key) => !(key in ES))).toEqual([]);
  });

  it("keeps every {placeholder} in translations", () => {
    const names = (text: string) => [...new Set([...text.matchAll(/\{(\w+)(?:\|[^}]*)?\}/g)].map((m) => m[1]))].sort();
    for (const dictionary of [PT, ES]) {
      for (const [english, translated] of Object.entries(dictionary)) {
        expect([english, names(translated)]).toEqual([english, names(english)]);
      }
    }
  });

  it("falls back to English for missing text and fills placeholders", () => {
    expect(tr("pt-BR", "中", "No such string")).toBe("No such string");
    expect(tr("pt-BR", "{n} 页", "{n} pages", { n: 1 })).toBe("1 folha");
    expect(tr("pt-BR", "{n} 页", "{n} pages", { n: 3 })).toBe("3 folhas");
    expect(tr("pt-BR", "当前纸张：{w} × {h} mm。", "Current paper: {w} × {h} mm.", { w: "215.9", h: "279.4" })).toContain("215,9 × 279,4");
    expect(tr("es", "当前纸张：{w} × {h} mm。", "Current paper: {w} × {h} mm.", { w: "215.9", h: "279.4" })).toContain("215.9 × 279.4");
  });

  it("routes Portuguese and Spanish pages, falling back to English", () => {
    expect(localizedPath("pt-BR", "home")).toBe("/pt");
    expect(localizedPath("es", "blockpostersAlternative")).toBe("/es/block-posters-gratis");
    expect(localizedPath("pt-BR", "terms")).toBe("/terms");
    expect(hasPage("es", "terms")).toBe(false);
    expect(languageAlternates("rasterbatorAlternative")).toEqual({
      "zh-CN": "/zh/rasterbator-alternative",
      en: "/rasterbator-alternative",
      "pt-BR": "/pt/alternativa-ao-rasterbator",
      es: "/es/alternativa-a-rasterbator",
      "x-default": "/rasterbator-alternative",
    });
    expect(Object.keys(languageAlternates("terms"))).toEqual(["zh-CN", "en", "x-default"]);
  });
});
