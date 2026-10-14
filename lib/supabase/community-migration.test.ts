import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20261014170000_mcc_community_features.sql"),
  "utf8",
);

describe("MCC community migration guardrails", () => {
  it("keeps feedback responses independent of authenticated user IDs", () => {
    const courseFeedback = sql.match(/create table if not exists public\.course_feedback \(([\s\S]*?)\n\);/i)?.[1] ?? "";
    const sessionFeedback = sql.match(/create table if not exists public\.session_feedback \(([\s\S]*?)\n\);/i)?.[1] ?? "";
    expect(courseFeedback).toContain("course_id");
    expect(sessionFeedback).toContain("feedback_token");
    expect(courseFeedback).not.toMatch(/auth\.uid\(\)|user_id|profile_id|submitted_ip/i);
    expect(sessionFeedback).not.toMatch(/auth\.uid\(\)|user_id|profile_id|submitted_ip/i);
  });

  it("checks the session token, closed time, and expiry at the database layer", () => {
    expect(sql).toMatch(/create or replace function public\.is_active_feedback_session/i);
    expect(sql).toMatch(/s\.feedback_token = target_token/i);
    expect(sql).toMatch(/s\.feedback_closed_at is null/i);
    expect(sql).toMatch(/s\.feedback_expires_at > now\(\)/i);
    expect(sql).toMatch(/create policy session_feedback_active_anon_insert[\s\S]*?public\.is_active_feedback_session\(session_id, feedback_token\)/i);
  });

  it("limits track editing policies to assigned track/course/lesson IDs", () => {
    expect(sql).toMatch(/create table if not exists public\.track_leaders/i);
    expect(sql).toMatch(/create policy tracks_leader_update_assigned[\s\S]*?public\.is_track_leader_for_track\(id\)/i);
    expect(sql).toMatch(/create policy courses_leader_update_assigned[\s\S]*?public\.is_track_leader_for_track\(track_id\)/i);
    expect(sql).toMatch(/create policy lessons_leader_update_assigned[\s\S]*?public\.is_track_leader_for_course\(course_id\)/i);
  });

  it("protects dynamic recruitment questions from public edits and validates required answers", () => {
    expect(sql).toMatch(/create policy recruitment_questions_public_enabled_read[\s\S]*?for select to anon using \(enabled\)/i);
    expect(sql).toMatch(/create policy recruitment_questions_admin_insert[\s\S]*?public\.is_admin\(\)/i);
    expect(sql).toMatch(/create or replace function public\.validate_application_answers/i);
    expect(sql).toMatch(/if q\.required and answer is null then/i);
    expect(sql).toMatch(/new\.phone_number is null/i);
  });

  it("stores course reviews without identity fields and validates review scores", () => {
    expect(sql).toMatch(/create policy course_feedback_anon_insert[\s\S]*?public\.courses c where c\.id = course_id and c\.published/i);
    expect(sql).toMatch(/check \(\(kind = 'review' and rating is not null\) or kind = 'complaint'\)/i);
    expect(sql).toMatch(/rating smallint check \(rating is null or rating between 1 and 5\)/i);
  });
  it("limits resource management to an assigned course or lesson", () => {
    expect(sql).toMatch(/create policy resources_leader_insert_assigned[\s\S]*?public\.is_track_leader_for_course\(course_id\)/i);
    expect(sql).toMatch(/create policy resources_leader_update_assigned[\s\S]*?public\.is_track_leader_for_lesson\(lesson_id\)/i);
    expect(sql).toMatch(/create policy resources_leader_delete_assigned[\s\S]*?public\.is_track_leader_for_course\(course_id\)/i);
  });

  it("rejects QR sessions whose course does not belong to the selected track", () => {
    expect(sql).toMatch(/create or replace function public\.validate_feedback_session_course_track/i);
    expect(sql).toMatch(/course_track_id <> new\.track_id/i);
    expect(sql).toMatch(/create trigger feedback_sessions_validate_course_track[\s\S]*?before insert or update on public\.feedback_sessions/i);
  });

  it("adds the video URL column expected by the lesson editor", () => {
    expect(sql).toMatch(/alter table public\.lessons add column if not exists video_url text/i);
  });


  it("limits anonymous and authenticated session reads to the QR-safe public columns", () => {
    expect(sql).toContain("grant select (id, track_id, course_id, title, feedback_token, feedback_expires_at, feedback_closed_at, created_at) on public.feedback_sessions to anon, authenticated;");
    expect(sql).not.toContain("grant select on public.feedback_sessions to authenticated;");
  });

  it("validates application answers only when answers or phone fields change", () => {
    expect(sql).toContain("create trigger applications_validate_answers before insert or update of answers, phone_number");
  });

  it("prevents a resource from linking a course to another course's lesson", () => {
    expect(sql).toContain("create or replace function public.validate_resource_course_lesson_match()");
    expect(sql).toContain("lesson_course_id <> new.course_id");
    expect(sql).toContain("create trigger resources_validate_course_lesson_match");
    expect(sql).toContain("before insert or update of course_id, lesson_id on public.resources");
  });

});
