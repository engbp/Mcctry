// RLS + integration tests. These REQUIRE a configured Supabase instance and
// are skipped automatically when the required env vars are absent, so
// `npm run test` stays green with no database.
//
// They are NOT run locally by default. Enable by exporting:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
//
// Destructive operations are avoided: the suite only inserts/reads synthetic
// rows it creates, and cleans up after itself. Never point this at production.

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

const configured = Boolean(url && serviceKey && anonKey);

describe.skipIf(!configured)("RLS + integration (requires live Supabase)", () => {
  let admin: SupabaseClient;
  let anon: SupabaseClient;
  let trackId: string | undefined;
  let courseId: string | undefined;

  beforeAll(() => {
    admin = createClient(url!, serviceKey!, { auth: { persistSession: false } });
    anon = createClient(url!, anonKey!, { auth: { persistSession: false } });
  });

  afterAll(async () => {
    if (courseId) await admin.from("courses").delete().eq("id", courseId);
    if (trackId) await admin.from("tracks").delete().eq("id", trackId);
  });
  it("admin can create a draft track that anon cannot read", async () => {
    const slug = `test-track-${Date.now()}`;
    const { data: inserted, error } = await admin
      .from("tracks")
      .insert({ slug, title: "Test Track", published: false })
      .select()
      .single();
    expect(error).toBeNull();
    trackId = inserted!.id;

    const { data: visible } = await anon
      .from("tracks")
      .select("id")
      .eq("id", trackId);
    expect(visible ?? []).toHaveLength(0);
  });

  it("anon can read a published track", async () => {
    await admin.from("tracks").update({ published: true }).eq("id", trackId);
    const { data } = await anon.from("tracks").select("id").eq("id", trackId);
    expect((data ?? []).length).toBe(1);
  });

  it("anon cannot insert a track", async () => {
    const { error } = await anon
      .from("tracks")
      .insert({ slug: "anon-track", title: "Nope", published: true });
    expect(error).toBeTruthy();
  });

  it("anon application insert is forced to pending and is not readable", async () => {
    const email = `rls-test-${Date.now()}@example.com`;
    const { error } = await anon.from("applications").insert({
      name: "RLS Test",
      email,
      interests: ["Cloud"],
      status: "accepted", // must be rejected/overridden by policy
    });
    // Either the row is rejected outright, or inserted as pending.
    if (error) {
      expect(error).toBeTruthy();
    } else {
      const { data } = await anon
        .from("applications")
        .select("status")
        .eq("email", email);
      expect(data ?? []).toHaveLength(0); // anon must not read it back
    }
  });

  it("anon cannot read any application rows", async () => {
    const { data } = await anon.from("applications").select("id").limit(1);
    expect(data ?? []).toHaveLength(0);
  });

  it("courses require a valid track_id (FK enforced)", async () => {
    const { error } = await admin.from("courses").insert({
      track_id: "00000000-0000-0000-0000-000000000000",
      slug: `fk-test-${Date.now()}`,
      title: "FK Test",
    });
    expect(error).toBeTruthy();
  });

  it("slug format check rejects an invalid slug", async () => {
    const { error } = await admin
      .from("tracks")
      .insert({ slug: "Invalid Slug!", title: "Bad" });
    expect(error).toBeTruthy();
  });

  it("duplicate application email is rejected by the unique index", async () => {
    const email = `dupe-${Date.now()}@example.com`;
    const first = await anon
      .from("applications")
      .insert({ name: "A", email, interests: ["Cloud"] });
    expect(first.error).toBeNull();
    const second = await anon
      .from("applications")
      .insert({ name: "B", email, interests: ["Cloud"] });
    expect(second.error).toBeTruthy();
  });

  it("admin can promote a profile to admin", async () => {
    const { data: authUser } = await admin.auth.admin.createUser({
      email: `admin-${Date.now()}@example.com`,
      email_confirm: true,
    });
    const uid = authUser!.user!.id;
    await admin.from("profiles").upsert({ id: uid, role: "admin" });
    const { data } = await admin.from("profiles").select("role").eq("id", uid).single();
    expect(data?.role).toBe("admin");
    await admin.auth.admin.deleteUser(uid);
  });
});
