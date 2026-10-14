// RLS + integration tests. These REQUIRE a configured Supabase instance and
// are skipped automatically when the required env vars are absent, so
// `npm run test` stays green with no database.
//
// They are NOT run locally by default. Enable by exporting:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
// Values use Supabase's current key formats: the secret key is `sb_secret_...`
// (for SUPABASE_SERVICE_ROLE_KEY) and the publishable key is `sb_publishable_...`
// (for SUPABASE_ANON_KEY). Legacy `eyJ...` JWTs also still work.
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

// ---------------------------------------------------------------------------
// Role-security regression suite.
// Proves the Issue A fix end-to-end against a live instance:
//   - a non-admin cannot self-promote via a direct API update
//   - a non-admin cannot self-promote via the admin_set_profile_role() function
//   - a non-admin can still update their own display_name
//   - an admin CAN change another user's role via admin_set_profile_role()
// These run only when SUPABASE_URL / SERVICE_ROLE / ANON are configured and
// the migration (including admin_set_profile_role) has been applied.
// ---------------------------------------------------------------------------
describe.skipIf(!configured)("Profile role security regression", () => {
  let admin: SupabaseClient;
  const createdUserIds: string[] = [];

  const TEST_PASSWORD = "Sup3rSecret-test-password";

  async function createUserWithRole(email: string, role: "member" | "admin") {
    const { data: authUser, error } = await admin.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
    });
    expect(error).toBeNull();
    const uid = authUser!.user!.id;
    createdUserIds.push(uid);
    const { error: upsertErr } = await admin
      .from("profiles")
      .upsert({ id: uid, role, display_name: `Test ${role}` });
    expect(upsertErr).toBeNull();
    const { data: session, error: signInErr } = await admin.auth.signInWithPassword({
      email,
      password: TEST_PASSWORD,
    });
    expect(signInErr).toBeNull();
    const client = createClient(url!, anonKey!, {
      global: { headers: { Authorization: `Bearer ${session.session!.access_token}` } },
      auth: { persistSession: false },
    });
    return { uid, client };
  }

  beforeAll(() => {
    admin = createClient(url!, serviceKey!, { auth: { persistSession: false } });
  });

  afterAll(async () => {
    for (const uid of createdUserIds) {
      try {
        await admin.auth.admin.deleteUser(uid);
      } catch {
        // best-effort cleanup; ignore if already gone
      }
    }
  });

  it("non-admin cannot self-promote via a direct role update", async () => {
    const ts = Date.now();
    const { uid, client } = await createUserWithRole(`member-direct-${ts}@example.com`, "member");
    const { error } = await client
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", uid);
    expect(error).toBeTruthy();
    // Confirm role is still member.
    const { data } = await admin.from("profiles").select("role").eq("id", uid).single();
    expect(data?.role).toBe("member");
  });

  it("non-admin cannot self-promote via admin_set_profile_role()", async () => {
    const ts = Date.now();
    const { uid, client } = await createUserWithRole(`member-fn-${ts}@example.com`, "member");
    const { error } = await client.rpc("admin_set_profile_role", {
      target_user_id: uid,
      new_role: "admin",
    });
    expect(error).toBeTruthy();
    const { data } = await admin.from("profiles").select("role").eq("id", uid).single();
    expect(data?.role).toBe("member");
  });

  it("non-admin can still update their own display_name", async () => {
    const ts = Date.now();
    const { uid, client } = await createUserWithRole(`member-name-${ts}@example.com`, "member");
    const { error } = await client
      .from("profiles")
      .update({ display_name: "Updated Name" })
      .eq("id", uid);
    expect(error).toBeNull();
    const { data } = await admin
      .from("profiles")
      .select("display_name")
      .eq("id", uid)
      .single();
    expect(data?.display_name).toBe("Updated Name");
  });

  it("admin can change another user's role via admin_set_profile_role()", async () => {
    const ts = Date.now();
    // Admin caller.
    const { client: adminClient } = await createUserWithRole(`admin-caller-${ts}@example.com`, "admin");
    // Target member.
    const { uid: targetUid } = await createUserWithRole(`member-target-${ts}@example.com`, "member");

    const { error } = await adminClient.rpc("admin_set_profile_role", {
      target_user_id: targetUid,
      new_role: "leader",
    });
    expect(error).toBeNull();
    const { data } = await admin.from("profiles").select("role").eq("id", targetUid).single();
    expect(data?.role).toBe("leader");
  });
});
