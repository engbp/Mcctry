import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getPublishedTracks,
  getPublishedCourses,
  getPublishedLessons,
  getPublishedContent,
  getPublishedTeams,
  getPublishedResources,
} from "./content";

// Public content queries must degrade to a friendly failure result — never
// throw — when credentials are absent, so pages can show their static
// fallback instead of crashing.
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("content queries without configuration", () => {
  it("returns a failure result instead of throwing", async () => {
    const results = await Promise.all([
      getPublishedTracks(),
      getPublishedCourses(),
      getPublishedLessons("course-id"),
      getPublishedLessons(),
      getPublishedContent("event"),
      getPublishedTeams(),
      getPublishedResources(),
    ]);

    for (const result of results) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeTruthy();
    }
  });
});
