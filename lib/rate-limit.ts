// In-memory sliding-window rate limiter for the join endpoint.
//
// This is a single-instance, best-effort defence against naive abuse. It is NOT
// a distributed rate limiter: on serverless platforms each isolate keeps its own
// map, so the effective limit is per-instance. It is intentionally dependency-free.
//
// For production-grade abuse protection, layer a managed WAF/rate limiter or
// Supabase Edge Config on top. Documented as a known limitation.

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

/**
 * Record a hit for `key` and decide whether it is allowed within `limit`
 * hits per `windowMs`.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitDecision {
  const cutoff = now - windowMs;
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  // Drop hits that have fallen out of the window.
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterMs = oldest + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  bucket.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}

/** Test helper: clear all state between unit tests. */
export function resetRateLimits(): void {
  buckets.clear();
}
