// Notify IndexNow (Bing, Yandex, Seznam, Naver; Bing also feeds ChatGPT search and Copilot) about every URL in the
// built sitemap. Run after deploying:  node scripts_indexnow.mjs
import { readFileSync } from "node:fs";

const KEY = "c74895e7c82e4a42bfae1e82845c4791";
const HOST = "tilestencil.com";
const sitemap = readFileSync("out/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(`https://${HOST}`));

// The connection is sometimes reset on the first try, so retry a few times before giving up.
for (let attempt = 1; ; attempt++) {
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    });
    console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
    break;
  } catch (error) {
    if (attempt >= 4) throw error;
    console.log(`IndexNow attempt ${attempt} failed (${error.cause?.code ?? error.message}), retrying...`);
    await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
  }
}
