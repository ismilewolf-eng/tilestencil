import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { localizedPath, type SiteRoute } from "../lib/locale";

const ROOT = process.cwd();

const ROUTES: SiteRoute[] = [
  "home",
  "privacy",
  "posterGuide",
  "stencilGuide",
  "patternGuide",
  "bannerGuide",
  "stainedGlassGuide",
  "scrollSawGuide",
];

function collectTsx(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTsx(full, out);
    } else if (entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Pulls out the raw text of every `className=` attribute value, walking braces
 * manually so template literals such as `` `status-message is-${kind}` `` do not
 * terminate the match at the `}` of their interpolation.
 */
function readClassNameExpressions(source: string): string[] {
  const expressions: string[] = [];
  const marker = "className=";
  let index = source.indexOf(marker);

  while (index !== -1) {
    let cursor = index + marker.length;

    if (source[cursor] === '"') {
      const end = source.indexOf('"', cursor + 1);
      expressions.push(source.slice(cursor + 1, end));
      cursor = end + 1;
    } else if (source[cursor] === "{") {
      const start = cursor;
      let depth = 0;

      while (cursor < source.length) {
        const char = source[cursor];

        if (char === '"' || char === "'" || char === "`") {
          cursor += 1;
          while (cursor < source.length && source[cursor] !== char) {
            cursor += source[cursor] === "\\" ? 2 : 1;
          }
        } else if (char === "{") {
          depth += 1;
        } else if (char === "}") {
          depth -= 1;
          if (depth === 0) {
            break;
          }
        }

        cursor += 1;
      }

      expressions.push(source.slice(start + 1, cursor));
      cursor += 1;
    }

    index = source.indexOf(marker, cursor);
  }

  return expressions;
}

function staticClassTokens(expression: string): string[] {
  const chunks: string[] = [];

  for (const literal of expression.match(/"[^"]*"/g) ?? []) {
    chunks.push(literal.slice(1, -1));
  }
  for (const literal of expression.match(/`[^`]*`/g) ?? []) {
    chunks.push(literal.slice(1, -1).replace(/\$\{[^}]*\}/g, " "));
  }
  if (!expression.includes('"') && !expression.includes("`")) {
    chunks.push(expression);
  }

  return chunks
    .flatMap((chunk) => chunk.split(/\s+/))
    .filter((token) => token.length > 0 && /^[a-zA-Z][\w-]*$/.test(token));
}

function literalHrefs(source: string): string[] {
  return [...source.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
}

describe("stylesheet coverage", () => {
  it("defines a rule for every class the components actually render", () => {
    const css = readFileSync(join(ROOT, "app", "globals.css"), "utf8");
    const defined = new Set(
      [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((match) => match[1]),
    );

    const used = new Map<string, string>();
    for (const file of [
      ...collectTsx(join(ROOT, "app")),
      ...collectTsx(join(ROOT, "components")),
    ]) {
      const source = readFileSync(file, "utf8");
      for (const expression of readClassNameExpressions(source)) {
        for (const token of staticClassTokens(expression)) {
          if (!used.has(token)) {
            used.set(token, file.slice(ROOT.length + 1));
          }
        }
      }
    }

    // Sanity check that the extractor found the real markup, not nothing.
    expect(used.has("workbench")).toBe(true);
    expect(used.has("guide-cta")).toBe(true);
    expect(used.has("preset-pill")).toBe(true);

    const IGNORE_TOKENS = new Set(["cm", "in", "error", "success", "progress", "true", "false", "undefined"]);
    const unstyled = [...used].filter(([token]) => !IGNORE_TOKENS.has(token))
      .filter(([token]) => !defined.has(token))
      .map(([token, file]) => `${token} (${file})`);

    expect(unstyled).toEqual([]);
  });
});

describe("locale routing", () => {
  const enPaths = new Set(ROUTES.map((route) => localizedPath("en", route)));
  const zhPaths = new Set(ROUTES.map((route) => localizedPath("zh-CN", route)));

  it("keeps every literal link inside the English tree on an English route", () => {
    const offenders: string[] = [];

    for (const file of collectTsx(join(ROOT, "app", "(en)"))) {
      for (const href of literalHrefs(readFileSync(file, "utf8"))) {
        if (href.startsWith("/") && !enPaths.has(href)) {
          offenders.push(`${file.slice(ROOT.length + 1)} -> ${href}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps every literal link inside the Chinese tree on a /zh route", () => {
    const offenders: string[] = [];

    for (const file of collectTsx(join(ROOT, "app", "zh"))) {
      for (const href of literalHrefs(readFileSync(file, "utf8"))) {
        if (href.startsWith("/") && !zhPaths.has(href)) {
          offenders.push(`${file.slice(ROOT.length + 1)} -> ${href}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("serves English from the root and Chinese from /zh", () => {
    expect(localizedPath("en", "home")).toBe("/");
    expect(localizedPath("en", "stencilGuide")).toBe("/print-large-stencil");
    expect(localizedPath("zh-CN", "home")).toBe("/zh");
    expect(localizedPath("zh-CN", "stencilGuide")).toBe("/zh/print-large-stencil");
  });
});

describe("cross-promotion footer", () => {
  const shells = ["components/TileStencilApp.tsx", "components/GuideShell.tsx", "components/PrivacyPage.tsx"];
  const tools = [
    ["https://fee.skillary.ai", "Etsy Profit Studio"],
    ["https://magickcmd.com", "MagickCMD"],
    ["https://apriltag.skillary.ai", "AprilTag Studio"],
  ];

  it.each(shells)("composes the shared SiteFooter in %s", (shell) => {
    const source = readFileSync(join(ROOT, shell), "utf8");

    expect(source).toContain('import { SiteFooter } from "@/components/SiteFooter"');
    expect(source).toMatch(/<SiteFooter\s+locale={locale}\s*\/>/);
  });

  it("lists all three sibling tools in components/SiteFooter.tsx", () => {
    const source = readFileSync(join(ROOT, "components/SiteFooter.tsx"), "utf8");

    expect(source).toContain("footer-tools");
    for (const [url, label] of tools) {
      expect(source).toContain(`href: "${url}"`);
      expect(source).toContain(label);
    }
  });

  it("opens outbound tool links safely in components/SiteFooter.tsx", () => {
    const source = readFileSync(join(ROOT, "components/SiteFooter.tsx"), "utf8");
    const outbound = [...source.matchAll(/<a\s+[^>]*href={tool\.href}[^>]*>/g)];

    expect(outbound.length).toBe(1);
    for (const [tag] of outbound) {
      expect(tag).toContain('target="_blank"');
      expect(tag).toContain('rel="noopener noreferrer"');
    }
  });
});
