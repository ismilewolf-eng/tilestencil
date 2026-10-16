// Next.js 16 static export writes per-segment prefetch files in nested folders
// (out/guides/x/__next.guides/x/__PAGE__.txt), but the client router requests a flat,
// dot-joined name (/guides/x/__next.guides.x.__PAGE__.txt). Static hosting has no rewrite
// for that, so every prefetch 404s. Write a flat copy next to each nested folder.
// Runs after `next build`; safe to run twice.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let written = 0;

function walkFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walkFiles(full) : [full];
  });
}

function visit(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of walkFiles(full)) {
        const flat = path.join(dir, `${name}.${path.relative(full, file).split(path.sep).join(".")}`);
        if (!existsSync(flat)) {
          copyFileSync(file, flat);
          written++;
        }
      }
    } else {
      visit(full);
    }
  }
}

if (!existsSync(OUT)) throw new Error("out/ not found; run next build first");
visit(OUT);
console.log(`flatten-next-segments: wrote ${written} flat prefetch files`);
