// Local, no-database test: asserts structural invariants of the migration SQL
// so a reviewer catches a regression in the committed DDL without connecting to
// a live Postgres instance. This does NOT execute the SQL.

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const MIGRATIONS_DIR = path.join(__dirname, "../../supabase/migrations");

const sql = readFileSync(
  path.join(MIGRATIONS_DIR, "20261011235451_init.sql"),
  "utf8"
);

describe("20261011235451_init.sql structure", () => {
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

  // --- Security regression guards (Issue A) ---
  it("defines a protect_profile_role trigger function and attaches it", () => {
    expect(sql).toMatch(/create or replace function public\.protect_profile_role\(\)/);
    expect(sql).toMatch(/create trigger profiles_protect_role\s+before update on public\.profiles/);
  });

  it("defines admin_set_profile_role() as security definer with pinned search_path", () => {
    expect(sql).toMatch(/create or replace function public\.admin_set_profile_role\(/);
    const block = sql.split("create or replace function public.admin_set_profile_role")[1] ?? "";
    expect(block).toContain("security definer");
    expect(block).toContain("set search_path = ''");
  });

  it("restricts admin_set_profile_role execution to authenticated", () => {
    expect(sql).toMatch(
      /revoke execute on function public\.admin_set_profile_role\(uuid, app_role\)\s+from public, anon/
    );
    expect(sql).toMatch(
      /grant execute on function public\.admin_set_profile_role\(uuid, app_role\)\s+to authenticated/
    );
  });

  it("restricts profile updates to own-row-or-admin, authenticated only", () => {
    // Merged into a single policy so there is no overlapping pair. A non-admin
    // is limited to their own row; an admin may touch any row. RLS WITH CHECK
    // sees only the proposed NEW row (`old` is not valid in a policy), so
    // "role must not change" is enforced by the column-level GRANT and the
    // protect_profile_role trigger, not by this policy.
    expect(sql).toMatch(
      /create policy profiles_update on public\.profiles\s+for update to authenticated\s+using \(\(select auth\.uid\(\)\) = id or public\.is_admin\(\)\)\s+with check \(\(select auth\.uid\(\)\) = id or public\.is_admin\(\)\);/
    );
    expect(sql).not.toMatch(/create policy profiles_update_own/);
    expect(sql).not.toMatch(/create policy profiles_admin_update/);
  });

  it("no policy expression references the unavailable old row (guards regression)", () => {
    // Extract only the CREATE POLICY statements and ensure none use `old.col`.
    // The `old` keyword is only valid inside trigger functions, never in an RLS
    // policy expression (which sees only the proposed new row). We match the
    // dotted form `old.` specifically so prose in SQL comments (e.g. "no access
    // to the OLD row") does not produce a false positive.
    const policyStmts = sql
      .split(/drop policy if exists/)
      .slice(1)
      .map((b) => b.split(/create policy/)[1] ?? "");
    for (const stmt of policyStmts) {
      expect(stmt).not.toMatch(/\bold\s*\./i);
    }
  });

  it("applies column-level grant so non-admins cannot write role", () => {
    expect(sql).toMatch(/revoke update on table public\.profiles from authenticated/);
    expect(sql).toMatch(/grant update \(display_name, team_id\) on table public\.profiles to authenticated/);
  });

  // --- Content schema (hybrid model) ---
  it("creates the resources table with RLS, trigger, and policies", () => {
    expect(sql).toMatch(/create table if not exists public\.resources\b/);
    expect(sql).toMatch(/alter table public\.resources\s+enable row level security/);
    expect(sql).toMatch(/create trigger resources_set_updated_at/);
    expect(sql).toMatch(/resources_public_read/);
  });

  it("stores event and opportunity dates in unambiguous separate columns", () => {
    expect(sql).toMatch(/event_date\s+date/);
    expect(sql).toMatch(/opportunity_date\s+date/);
    expect(sql).toMatch(/deadline\s+date/);
    // Opportunity date must not be forced into event_date.
    expect(sql).toMatch(/comment on column public\.content_items\.opportunity_date/);
  });

  it("guards typed columns against the wrong kind via CHECK", () => {
    expect(sql).toMatch(/content_items_typed_columns_match_kind/);
  });

  it("keeps track course counts computed (not a stored column)", () => {
    expect(sql).not.toMatch(/courses_count\s+integer/);
    expect(sql).toMatch(/Course count is computed from courses, not stored/);
  });

  it("stores track and course duration as editorial columns", () => {
    expect(sql).toMatch(/create table if not exists public\.tracks[\s\S]*?duration\s+text/);
    expect(sql).toMatch(/create table if not exists public\.courses[\s\S]*?duration\s+text/);
  });

  it("rollback drops every new object", () => {
    const rb = readFileSync(
      path.join(__dirname, "../../supabase/rollback/rollback_0001_init.sql"),
      "utf8"
    );
    expect(rb).toContain("drop table if exists public.resources");
    expect(rb).toContain("drop trigger if exists profiles_protect_role");
    expect(rb).toContain("drop function if exists public.protect_profile_role()");
    expect(rb).toMatch(/drop function if exists public\.admin_set_profile_role\(uuid, app_role\)/);
    expect(rb).toContain("drop trigger if exists resources_set_updated_at");
  });
});

// ---------------------------------------------------------------------------
// Migration-layout guard.
// The Supabase CLI applies EVERY file in supabase/migrations/ as a forward
// migration, in filename order. A rollback/destructive script stored there
// would be applied automatically and destroy the schema. Rollbacks must live
// in supabase/rollback/ instead, so this asserts the migrations directory
// contains only forward migrations.
// ---------------------------------------------------------------------------
describe("supabase/migrations layout", () => {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));

  it("contains only forward migrations (no rollback files)", () => {
    for (const f of files) {
      expect(f).not.toMatch(/rollback|revert|drop|destroy|down_/i);
    }
  });

  it("no migration file contains destructive drop statements", () => {
    for (const f of files) {
      const body = readFileSync(path.join(MIGRATIONS_DIR, f), "utf8");
      expect(body).not.toMatch(
        /^\s*drop\s+(table|schema|database|type|extension)\b/im
      );
    }
  });

  it("uses Supabase timestamped migration filenames", () => {
    for (const f of files) {
      expect(f).toMatch(/^\d{14}_[a-z0-9_]+\.sql$/);
    }
  });

  it("keeps the rollback script outside the migrations directory", () => {
    expect(files.some((f) => f.includes("rollback"))).toBe(false);
    // The known rollback lives in supabase/rollback/, not here.
    const rb = readFileSync(
      path.join(__dirname, "../../supabase/rollback/rollback_0001_init.sql"),
      "utf8"
    );
    expect(rb).toContain("drop table if exists public.resources");
  });
});

// ---------------------------------------------------------------------------
// Security hardening — the corrections prompted by the live Supabase security
// advisor: pinned search_paths, minimised function execution privileges,
// role-scoped admin policies, and merged profile policies. These are
// structural assertions against the migration SQL; nothing here connects to a
// database.
// ---------------------------------------------------------------------------
describe("security hardening (advisor corrections)", () => {
  const corrective = readFileSync(
    path.join(MIGRATIONS_DIR, "20261012080000_security_hardening.sql"),
    "utf8"
  );

  const policyStmts = (s: string): string[] =>
    [...s.matchAll(/create policy\s+\w+\s+on\s+public\.\w+[\s\S]*?;/g)].map((m) => m[0]);

  const functions = [
    "set_updated_at",
    "current_app_role",
    "is_admin",
    "protect_profile_role",
    "admin_set_profile_role",
  ];

  it("pins an empty search_path on every function", () => {
    for (const fn of functions) {
      const re = new RegExp(
        `create or replace function public\\.${fn}\\([\\s\\S]*?set search_path = ''`
      );
      expect(sql).toMatch(re);
      expect(corrective).toMatch(re);
    }
  });

  it("revokes client execution of trigger and internal helper functions", () => {
    for (const fn of ["set_updated_at", "protect_profile_role", "current_app_role"]) {
      const re = new RegExp(
        `revoke execute on function public\\.${fn}\\(\\)\\s+from public, anon, authenticated;`
      );
      expect(sql).toMatch(re);
      expect(corrective).toMatch(re);
    }
  });

  it("makes is_admin() callable by authenticated but not anon", () => {
    for (const src of [sql, corrective]) {
      expect(src).toMatch(/revoke execute on function public\.is_admin\(\)\s+from public, anon;/);
      expect(src).toMatch(/grant execute on function public\.is_admin\(\)\s+to authenticated;/);
    }
  });

  it("scopes every is_admin() policy to authenticated", () => {
    for (const src of [sql, corrective]) {
      const gated = policyStmts(src).filter((s) => s.includes("is_admin()"));
      expect(gated.length).toBeGreaterThan(0);
      for (const stmt of gated) {
        expect(stmt).toMatch(/to\s+authenticated/);
      }
    }
  });

  it("keeps public content reads function-free so anon needs no function grant", () => {
    const reads = policyStmts(sql).filter((s) =>
      /for select to anon, authenticated/.test(s)
    );
    // teams, tracks, courses, lessons, content_items, resources
    expect(reads).toHaveLength(6);
    for (const stmt of reads) {
      expect(stmt).not.toMatch(/is_admin|auth\.uid/);
      expect(stmt).toMatch(/using \(published = true\)/);
    }
  });

  it("exposes exactly one select and one update policy on profiles", () => {
    const onProfiles = policyStmts(sql).filter((s) => /on public\.profiles/.test(s));
    expect(onProfiles.filter((s) => /for select/.test(s))).toHaveLength(1);
    expect(onProfiles.filter((s) => /for update/.test(s))).toHaveLength(1);
    // The legacy overlapping policies must be gone.
    expect(sql).not.toMatch(/create policy profiles_select_own/);
    expect(sql).not.toMatch(/create policy profiles_admin_select/);
  });

  it("keeps anonymous application inserts pending and function-free", () => {
    const stmt = policyStmts(sql).find(
      (s) => /on public\.applications/.test(s) && /for insert/.test(s)
    );
    expect(stmt).toBeDefined();
    expect(stmt).toMatch(/with check \(status = 'pending'\)/);
    expect(stmt).not.toMatch(/is_admin/);
  });

  it("corrective migration drops the legacy profile policies and is idempotent", () => {
    expect(corrective).toMatch(/drop policy if exists profiles_select_own/);
    expect(corrective).toMatch(/drop policy if exists profiles_admin_select/);
    expect(corrective).toMatch(/drop policy if exists profiles_update_own/);
    expect(corrective).toMatch(/drop policy if exists profiles_admin_update/);
    // Re-runnable: every create is preceded by a drop-if-exists of the same name.
    for (const stmt of policyStmts(corrective)) {
      const name = stmt.match(/create policy\s+(\w+)/)![1];
      expect(corrective).toMatch(new RegExp(`drop policy if exists ${name}\\b`));
    }
  });
});
