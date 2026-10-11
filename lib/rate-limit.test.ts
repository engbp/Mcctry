import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimits } from "./rate-limit";

beforeEach(() => resetRateLimits());

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const d = checkRateLimit("k1", 3, 60_000, 1_000);
    expect(d.allowed).toBe(true);
    expect(d.remaining).toBe(2);
  });

  it("blocks once the limit is reached", () => {
    checkRateLimit("k2", 2, 60_000, 1_000);
    checkRateLimit("k2", 2, 60_000, 1_000);
    const d = checkRateLimit("k2", 2, 60_000, 1_000);
    expect(d.allowed).toBe(false);
    expect(d.remaining).toBe(0);
    expect(d.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("isolates keys from each other", () => {
    checkRateLimit("a", 1, 60_000, 1_000);
    const other = checkRateLimit("b", 1, 60_000, 1_000);
    expect(other.allowed).toBe(true);
  });

  it("frees capacity after the window elapses", () => {
    const start = 1_000;
    checkRateLimit("k3", 1, 1_000, start);
    const blocked = checkRateLimit("k3", 1, 1_000, start + 100);
    expect(blocked.allowed).toBe(false);
    const later = checkRateLimit("k3", 1, 1_000, start + 2_000);
    expect(later.allowed).toBe(true);
  });
});
