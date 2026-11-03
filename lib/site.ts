export const SITE_URL = "https://tilestencil.com";

/** When the tool and guide pages were last reviewed. Shown on the pages ("Updated November 2026") and sent as
 *  dateModified; AI answer engines favour pages that carry a recent date. Change this one line when content is reviewed. */
export const CONTENT_UPDATED = "2026-11-03";

/** Pages ChatGPT search already cites (GEO retest 2026-11-03, E:/新词雷达/reports/geo-2026-11-03-tilestencil.md).
 *  They don't get the "Updated" line, so a page that just started being cited stays exactly as it was. */
export const CITED_ROUTES = new Set(["home", "photoToStencil", "halloweenStencils", "cricutStencil", "rasterbatorAlternative", "posterGuide"]);
