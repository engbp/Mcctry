// Local, no-database test: asserts structural invariants of the migration SQL
// so a reviewer catches a regression in the committed DDL without connecting to
// a live Postgres instance. This does NOT execute the SQL.

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const sql = readFileSync(
  path.join(__dirname, "../../supabase/migrations/0001_init.sql"),
  "utf8"
);

describe("0001_init.sql structure", () => {
  it("creates all seven tables", () => {
    for (const t of [
      "teams",
      "profiles",
      "tracks",
      "courses",
      "lessons",
      "content_items",
      "applications",
    ]) {
      expect(sql).toMatch(new RegExp(`create table if not exists public\\.${t}\\b`));
    }
  });

  it("enables RLS on every table", () => {
    for (const t of [
      "teams",
      "profiles",
      "tracks",
      "courses",
      "lessons",
      "content_items",
      "applications",
    ]) {
      const re = new RegExp(`alter table public\\.${t}\\s+enable row level security;`);
      expect(sql).toMatch(re);
    }
  });

  it("has no policy that allows anonymous SELECT on applications", () => {
    // Every applications policy must be admin-gated or insert-only.
    const policyBlocks = sql.split(/drop policy if exists/).slice(1);
    for (const block of policyBlocks) {
      if (!/on public\.applications\b/.test(block)) continue;
      expect(block).not.toMatch(/for select using \(\s*true\s*\)/);
    }
  });

  it("forces anonymous application inserts to be pending", () => {
    expect(sql).toMatch(
      /applications_anon_insert[\s\S]*?for insert with check \(status = 'pending'\)/
    );
  });

  it("uses restrict (not cascade) so content cannot be orphaned silently", () => {
    expect(sql).toContain("references public.tracks(id) on delete restrict");
    expect(sql).toContain("references public.courses(id) on delete restrict");
  });

  it("cascades profile deletion with the auth user", () => {
    expect(sql).toContain("references auth.users(id) on delete cascade");
  });

  it("enforces unique, lower-cased application email", () => {
    expect(sql).toMatch(/applications_email_unique_idx[\s\S]*?on public\.applications \(lower\(email\)\)/);
  });

  it("defines slug format checks", () => {
    expect(sql).toContain("slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'");
  });
});
