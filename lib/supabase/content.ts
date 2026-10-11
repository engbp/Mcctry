// Public, read-only content queries.
// These run with the anon key, so RLS (`published = true`) is the enforcement
// boundary. Each function returns a discriminated result instead of throwing so
// a network/credential failure degrades to a friendly empty state rather than
// crashing the page.

import { createSupabaseServerClient } from "./server";
import { isSupabaseConfigured } from "./env";
import type { ContentItem, ContentKind, Course, Lesson, Team, Track } from "./types";

export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const NETWORK_ERROR = "Content service is unavailable. Showing preview content.";

function fail<T>(message: string): QueryResult<T> {
  return { ok: false, error: message };
}

function ok<T>(data: T): QueryResult<T> {
  return { ok: true, data };
}

export async function getPublishedTracks(): Promise<QueryResult<Track[]>> {
  if (!isSupabaseConfigured()) return fail(NETWORK_ERROR);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("published", true)
    .order("position", { ascending: true });
  if (error) return fail(error.message);
  return ok(data ?? []);
}

export async function getPublishedCourses(
  trackId?: string
): Promise<QueryResult<Course[]>> {
  if (!isSupabaseConfigured()) return fail(NETWORK_ERROR);
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .order("position", { ascending: true });
  if (trackId) query = query.eq("track_id", trackId);
  const { data, error } = await query;
  if (error) return fail(error.message);
  return ok(data ?? []);
}

export async function getPublishedLessons(
  courseId: string
): Promise<QueryResult<Lesson[]>> {
  if (!isSupabaseConfigured()) return fail(NETWORK_ERROR);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("published", true)
    .order("position", { ascending: true });
  if (error) return fail(error.message);
  return ok(data ?? []);
}

export async function getPublishedContent(
  kind: ContentKind
): Promise<QueryResult<ContentItem[]>> {
  if (!isSupabaseConfigured()) return fail(NETWORK_ERROR);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("kind", kind)
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) return fail(error.message);
  return ok(data ?? []);
}

export async function getPublishedTeams(): Promise<QueryResult<Team[]>> {
  if (!isSupabaseConfigured()) return fail(NETWORK_ERROR);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("published", true)
    .order("name", { ascending: true });
  if (error) return fail(error.message);
  return ok(data ?? []);
}
