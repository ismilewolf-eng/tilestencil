// Notify IndexNow (Bing, Yandex, Seznam, Naver; Bing also feeds ChatGPT search and Copilot) about every URL in the
// built sitemap. Run after deploying:  node scripts_indexnow.mjs
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const KEY = "c74895e7c82e4a42bfae1e82845c4791";
const HOST = "tilestencil.com";
const sitemap = readFileSync("out/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(`https://${HOST}`));

// Node's fetch ignores HTTP(S)_PROXY, so behind a local proxy it cannot connect. curl honours the proxy settings.
// Send to Bing directly as well as the shared endpoint: on 2026-10-23 Bing Webmaster showed no IndexNow submissions at all
// for the two new sites after weeks of 200s from api.indexnow.org, and they appeared within minutes once posted to Bing.
const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList });
for (const endpoint of ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"]) {
  const status = execFileSync(
    "curl",
    ["-s", "-m", "60", "-o", process.platform === "win32" ? "NUL" : "/dev/null", "-w", "%{http_code}", "-X", "POST",
      "-H", "Content-Type: application/json; charset=utf-8", "--data-binary", "@-", endpoint],
    { input: body, encoding: "utf8" },
  );
  console.log(`IndexNow ${new URL(endpoint).host}: ${status} for ${urlList.length} URLs`);
}
