import { NextRequest, NextResponse } from "next/server";

// Lightweight in-memory sliding-window limiter. On serverless this is per
// instance, not global — it still raises the cost of brute-forcing order codes
// enough to matter, without needing Redis. Swap for Upstash/Vercel KV later if
// stronger guarantees are needed.

type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

// Occasionally sweep expired buckets so the map can't grow without bound.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key);
  }
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Returns a 429 NextResponse when the caller has exceeded `limit` requests in
 * the last `windowMs`, otherwise null (request may proceed).
 */
export function rateLimit(
  req: NextRequest,
  name: string,
  limit = 10,
  windowMs = 60_000
): NextResponse | null {
  const now = Date.now();
  sweep(now);

  const key = `${name}:${clientIp(req)}`;
  const hit = buckets.get(key);

  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  hit.count += 1;
  if (hit.count > limit) {
    const retryAfter = Math.ceil((hit.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  return null;
}
