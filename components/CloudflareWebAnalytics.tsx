import Script from "next/script";

export const CLOUDFLARE_WEB_ANALYTICS_SRC = "https://static.cloudflareinsights.com/beacon.min.js";
export const CLOUDFLARE_WEB_ANALYTICS_CONFIG = JSON.stringify({
  token: "3743e34163e54e54bdbfa77ee622020f",
});

export function CloudflareWebAnalytics() {
  return (
    <Script
      id="cloudflare-web-analytics"
      src={CLOUDFLARE_WEB_ANALYTICS_SRC}
      strategy="afterInteractive"
      type="module"
      data-cf-beacon={CLOUDFLARE_WEB_ANALYTICS_CONFIG}
    />
  );
}
