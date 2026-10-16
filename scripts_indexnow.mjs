// Notify IndexNow (Bing, Yandex, Seznam, Naver; Bing also feeds ChatGPT search and Copilot) about every URL in the
// built sitemap. Run after deploying:  node scripts_indexnow.mjs
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const KEY = "c74895e7c82e4a42bfae1e82845c4791";
const HOST = "tilestencil.com";
const sitemap = readFileSync("out/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(`https://${HOST}`));

// Node's fetch ignores HTTP(S)_PROXY, so behind a local proxy it cannot connect. curl honours the proxy settings.
const status = execFileSync(
  "curl",
  ["-s", "-m", "60", "-o", process.platform === "win32" ? "NUL" : "/dev/null", "-w", "%{http_code}", "-X", "POST",
    "-H", "Content-Type: application/json; charset=utf-8", "--data-binary", "@-", "https://api.indexnow.org/indexnow"],
  { input: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }), encoding: "utf8" },
);
console.log(`IndexNow: ${status} for ${urlList.length} URLs`);
