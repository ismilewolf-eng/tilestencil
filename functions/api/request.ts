import { cleanPage, cleanRequest, requestKey, type StoredRequest } from "../../lib/request-box";

type KV = { put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void> };
type Context = { env: { REQUESTS?: KV }; request: Request & { cf?: { country?: string } } };

const YEAR_SECONDS = 365 * 24 * 60 * 60;

/** POST /api/request {text, page, website} — store one visitor request. `website` is a bot trap and must stay empty. */
export async function onRequestPost({ env, request }: Context): Promise<Response> {
  if (!env.REQUESTS) return Response.json({ ok: false }, { status: 503 });
  const body = (await request.json().catch(() => ({}))) as { text?: unknown; page?: unknown; website?: unknown };
  // Bots that fill every field get a normal-looking answer and nothing is stored.
  if (typeof body.website === "string" && body.website !== "") return Response.json({ ok: true });
  const text = cleanRequest(body.text);
  if (!text) return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  const stored: StoredRequest = { text, page: cleanPage(body.page), at: new Date().toISOString(), country: request.cf?.country };
  await env.REQUESTS.put(requestKey(new Date(), crypto.randomUUID().slice(0, 8)), JSON.stringify(stored), { expirationTtl: YEAR_SECONDS });
  return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
