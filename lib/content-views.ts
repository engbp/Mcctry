// View models, database→view adapters, and the empty-state policy for public
// pages.
//
// Policy: every loader queries Supabase through `lib/supabase/content.ts`
// (anon key, RLS `published = true`). When a query succeeds and returns rows,
// those rows are mapped to the view shapes below and served as
// `source: "db"`. When the database is empty, the query fails, or Supabase is
// not configured, the loaders return an empty list with `source: "unavailable"`
// so pages show an honest empty/unavailable state — never fabricated sample
// content and never a raw database error.

import {
  getPublishedContent,
  getPublishedCourses,
  getPublishedLessons,
  getPublishedResources,
  getPublishedTeams,
  getPublishedTracks,
  type QueryResult,
} from "@/lib/supabase/content";
import type {
  ContentItem,
  Course,
  Lesson,
  Resource,
  Team,
  Track,
} from "@/lib/supabase/types";

export type ContentSource = "db" | "unavailable";

export interface Sourced<T> {
  items: T;
  source: ContentSource;
}

export interface TrackView {
  slug: string;
  title: string;
  description: string;
  coursesCount: number;
  duration: string;
  icon: string;
  color: string;
  featured: boolean;
  gradient: string;
}

export interface CourseView {
  id: string | null;
  slug: string;
  title: string;
  track: string;
  trackSlug: string;
  description: string;
  lessonsCount: number;
  duration: string;
  level: string | null;
  thumbnail: string | null;
  featured: boolean;
  color: string;
}

export interface LessonView {
  id: string | null;
  courseId: string | null;
  slug: string;
  title: string;
  duration: string;
  type: string;
  videoUrl: string | null;
}

export interface EventView {
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  featured: boolean;
  demo: boolean;
  color: string;
}

export interface ProjectView {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  featured: boolean;
  demo: boolean;
  thumbnail: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  color: string;
}

export interface OpportunityView {
  slug: string;
  title: string;
  type: string;
  date: string | null;
  description: string;
  deadline: string | null;
  link: string | null;
  demo: boolean;
  color: string;
}

export interface ResourceView {
  slug?: string;
  title: string;
  category: string;
  description: string;
  link: string;
  external: boolean;
  icon: string;
}

export interface TeamView {
  slug: string;
  name: string;
  description: string;
}

export interface StoryView {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string | null;
}

// Presentation-only palette for rows that carry no colour; cycles through the
// site's existing accent colours so cards keep their design without inventing
// content.
const PALETTE = ["#0078d4", "#00b7d3", "#5c2d91", "#ffb900", "#00c7e8"];

function paletteColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

function metaColor(meta: Record<string, unknown> | null | undefined): string | undefined {
  const value = meta?.color;
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function trackGradient(color: string): string {
  return `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`;
}

function countBy<T>(rows: T[], key: (row: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const k = key(row);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

/**
 * Maps successful DB rows to views. On query failure or zero rows returns an
 * empty list with source "unavailable" — pages must show an honest empty
 * state, never fabricated sample content.
 */
function fromRows<R, V>(
  res: QueryResult<R[]>,
  mapRows: (rows: R[]) => V[]
): Sourced<V[]> {
  if (!res.ok || res.data.length === 0) {
    return { items: [], source: "unavailable" };
  }
  const items = mapRows(res.data);
  if (items.length === 0) {
    return { items: [], source: "unavailable" };
  }
  return { items, source: "db" };
}

function trackView(track: Track, coursesCount: number, index: number): TrackView {
  const color = track.color ?? paletteColor(index);
  return {
    slug: track.slug,
    title: track.title,
    description: track.description ?? "",
    coursesCount,
    duration: track.duration ?? "—",
    icon: track.icon ?? "BookOpen",
    color,
    featured: track.featured,
    gradient: trackGradient(color),
  };
}

function courseView(
  course: Course,
  track: Track,
  lessonsCount: number,
  index: number
): CourseView {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    track: track.title,
    trackSlug: track.slug,
    description: course.description ?? "",
    lessonsCount,
    duration: course.duration ?? "—",
    level: course.level,
    thumbnail: course.thumbnail,
    featured: course.featured,
    color: course.color ?? paletteColor(index),
  };
}

function lessonView(lesson: Lesson): LessonView {
  return {
    id: lesson.id,
    courseId: lesson.course_id,
    slug: lesson.slug,
    title: lesson.title,
    duration: lesson.duration ?? "—",
    type: lesson.type ?? "Lesson",
    videoUrl: lesson.video_url,
  };
}

function eventView(item: ContentItem, index: number): EventView | null {
  // An event without a date cannot be rendered by the date-tile layouts, so
  // incomplete rows are skipped rather than shown with a bogus date.
  if (!item.event_date) return null;
  return {
    slug: item.slug,
    title: item.title,
    description: item.description ?? "",
    date: item.event_date,
    time: item.event_time ?? "",
    location: item.location ?? "",
    category: item.category ?? "Event",
    featured: item.featured,
    demo: false,
    color: metaColor(item.meta) ?? paletteColor(index),
  };
}

function projectView(item: ContentItem, index: number): ProjectView {
  return {
    slug: item.slug,
    title: item.title,
    description: item.description ?? "",
    longDescription: item.long_description ?? "",
    technologies: item.technologies ?? [],
    category: item.category ?? "Project",
    featured: item.featured,
    demo: false,
    thumbnail: item.thumbnail,
    githubUrl: item.github_url,
    demoUrl: item.demo_url,
    color: metaColor(item.meta) ?? paletteColor(index),
  };
}

function opportunityView(item: ContentItem, index: number): OpportunityView {
  return {
    slug: item.slug,
    title: item.title,
    type: item.category ?? "Opportunity",
    date: item.opportunity_date,
    description: item.description ?? "",
    deadline: item.deadline,
    link: item.link,
    demo: false,
    color: metaColor(item.meta) ?? paletteColor(index),
  };
}

function resourceView(resource: Resource): ResourceView {
  return {
    slug: resource.slug,
    title: resource.title,
    category: resource.category ?? "",
    description: resource.description ?? "",
    link: resource.link ?? "",
    // The public page excludes resources without a destination and
    // renders linked internal resources as real site links.
    external: resource.external && Boolean(resource.link),
    icon: resource.icon ?? "BookOpen",
  };
}

function teamView(team: Team): TeamView {
  return {
    slug: team.slug,
    name: team.name,
    description: team.description ?? "",
  };
}

function storyView(item: ContentItem): StoryView {
  const metaDate = item.meta?.date;
  return {
    slug: item.slug,
    title: item.title,
    description: item.description ?? "",
    date: typeof metaDate === "string" && metaDate.length > 0 ? metaDate : item.created_at,
    category: item.category,
  };
}

export async function loadTracks(): Promise<Sourced<TrackView[]>> {
  const [tracksRes, coursesRes] = await Promise.all([
    getPublishedTracks(),
    getPublishedCourses(),
  ]);
  return fromRows(tracksRes, (rows) => {
    const counts = countBy(coursesRes.ok ? coursesRes.data : [], (c) => c.track_id);
    return rows.map((track, index) => trackView(track, counts.get(track.id) ?? 0, index));
  });
}

export async function loadCourses(): Promise<Sourced<CourseView[]>> {
  const [coursesRes, tracksRes, lessonsRes] = await Promise.all([
    getPublishedCourses(),
    getPublishedTracks(),
    getPublishedLessons(),
  ]);
  return fromRows(coursesRes, (rows) => {
    const trackById = new Map((tracksRes.ok ? tracksRes.data : []).map((t) => [t.id, t]));
    const lessonsByCourse = countBy(
      lessonsRes.ok ? lessonsRes.data : [],
      (lesson) => lesson.course_id
    );
    const items: CourseView[] = [];
    rows.forEach((course, index) => {
      // Skip courses whose track is not published — their links and
      // breadcrumbs would be broken.
      const track = trackById.get(course.track_id);
      if (!track) return;
      items.push(courseView(course, track, lessonsByCourse.get(course.id) ?? 0, index));
    });
    return items;
  });
}

/**
 * Lessons for one course. `courseId: null` (or a failed/empty query) returns
 * an empty list with `source: "unavailable"` — never fabricated sample
 * lessons.
 */
export async function loadLessonsForCourse(
  courseId: string | null
): Promise<Sourced<LessonView[]>> {
  if (!courseId) return { items: [], source: "unavailable" };
  const res = await getPublishedLessons(courseId);
  return fromRows(res, (rows) => rows.map(lessonView));
}

export async function loadEvents(): Promise<Sourced<EventView[]>> {
  const res = await getPublishedContent("event");
  return fromRows(res, (rows) =>
    rows
      .map((item, index) => eventView(item, index))
      .filter((event): event is EventView => event !== null)
  );
}

export async function loadProjects(): Promise<Sourced<ProjectView[]>> {
  const res = await getPublishedContent("project");
  return fromRows(res, (rows) => rows.map((item, index) => projectView(item, index)));
}

export async function loadOpportunities(): Promise<Sourced<OpportunityView[]>> {
  const res = await getPublishedContent("opportunity");
  return fromRows(res, (rows) => rows.map((item, index) => opportunityView(item, index)));
}

export async function loadResources(): Promise<Sourced<ResourceView[]>> {
  const res = await getPublishedResources();
  return fromRows(res, (rows) => rows.map(resourceView));
}

/** Static fallback is intentionally empty here — the pages show their
 * "not published yet" block instead. */
export async function loadTeams(): Promise<Sourced<TeamView[]>> {
  const res = await getPublishedTeams();
  return fromRows(res, (rows) => rows.map(teamView));
}

/** News and achievements: static fallback is intentionally empty (same
 * "not published yet" blocks as teams). */
export async function loadStories(
  kind: "news" | "achievement"
): Promise<Sourced<StoryView[]>> {
  const res = await getPublishedContent(kind);
  return fromRows(res, (rows) => rows.map(storyView));
}
