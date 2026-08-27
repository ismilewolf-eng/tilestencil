import { describe, expect, it } from "vitest";
import {
  CLOUDFLARE_WEB_ANALYTICS_CONFIG,
  CLOUDFLARE_WEB_ANALYTICS_SRC,
} from "../components/CloudflareWebAnalytics";

describe("Cloudflare Web Analytics", () => {
  it("uses the official beacon source with the configured site token", () => {
    expect(CLOUDFLARE_WEB_ANALYTICS_SRC).toBe("https://static.cloudflareinsights.com/beacon.min.js");
    expect(JSON.parse(CLOUDFLARE_WEB_ANALYTICS_CONFIG)).toEqual({
      token: "3743e34163e54e54bdbfa77ee622020f",
    });
  });
});
