import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/content", () => ({
  getPublishedTracks: vi.fn(),
  getPublishedCourses: vi.fn(),
  getPublishedLessons: vi.fn(),
  getPublishedContent: vi.fn(),
  getPublishedTeams: vi.fn(),
  getPublishedResources: vi.fn(),
}));

import {
  getPublishedTracks,
  getPublishedCourses,
  getPublishedLessons,
  getPublishedContent,
  getPublishedTeams,
  getPublishedResources,
} from "@/lib/supabase/content";
import {
  loadTracks,
  loadCourses,
  loadLessonsForCourse,
  loadEvents,
  loadProjects,
  loadOpportunities,
  loadResources,
  loadTeams,
  loadStories,
} from "@/lib/content-views";
import type {
  ContentItem,
  Course,
  Lesson,
  Resource,
  Team,
  Track,
} from "@/lib/supabase/types";

const ok = <T,>(data: T) => ({ ok: true as const, data });
const fail = { ok: false as const, error: "network down" };

function dbTrack(over: Partial<Track> = {}): Track {
  return {
    id: "t1",
    slug: "db-track",
    title: "DB Track",
    description: null,
    color: null,
    icon: null,
    duration: null,
    featured: false,
    published: true,
    position: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...over,
  };
}

function dbCourse(over: Partial<Course> = {}): Course {
  return {
    id: "c1",
    track_id: "t1",
    slug: "db-course",
    title: "DB Course",
    description: null,
    level: null,
    color: null,
    thumbnail: null,
    duration: null,
    featured: false,
    published: true,
    position: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...over,
  };
}

function dbLesson(over: Partial<Lesson> = {}): Lesson {
  return {
    id: "l1",
    course_id: "c1",
    slug: "db-lesson",
    title: "DB Lesson",
    duration: null,
    type: null,
    video_url: null,
    published: true,
    position: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...over,
  };
}

function dbContentItem(over: Partial<ContentItem> = {}): ContentItem {
  return {
    id: "i1",
    kind: "event",
    slug: "db-item",
    title: "DB Item",
    description: null,
    body: null,
    category: null,
    meta: {},
    featured: false,
    published: true,
    event_date: null,
    event_time: null,
    location: null,
    opportunity_date: null,
    deadline: null,
    link: null,
    long_description: null,
    technologies: null,
    github_url: null,
    demo_url: null,
    thumbnail: null,
    created_at: "2026-03-04T05:06:07Z",
    updated_at: "2026-03-04T05:06:07Z",
    ...over,
  };
}

function dbResource(over: Partial<Resource> = {}): Resource {
  return {
    id: "r1",
    slug: "db-resource",
    title: "DB Resource",
    description: null,
    link: null,
    external: true,
    category: null,
    icon: null,
    course_id: null,
    lesson_id: null,
    published: true,
    position: 0,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...over,
  };
}

function dbTeam(over: Partial<Team> = {}): Team {
  return {
    id: "tm1",
    slug: "db-team",
    name: "DB Team",
    description: null,
    published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...over,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loadTracks", () => {
  it("serves mapped DB rows with computed course counts", async () => {
    vi.mocked(getPublishedTracks).mockResolvedValue(ok([dbTrack()]));
    vi.mocked(getPublishedCourses).mockResolvedValue(
      ok([dbCourse({ id: "c1", track_id: "t1" }), dbCourse({ id: "c2", track_id: "t1" })])
    );

    const result = await loadTracks();

    expect(result.source).toBe("db");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      slug: "db-track",
      title: "DB Track",
      description: "",
      coursesCount: 2,
      duration: "—",
      icon: "BookOpen",
      color: "#0078d4",
      featured: false,
    });
    expect(result.items[0].gradient).toContain("#0078d4");
  });

  it("returns an honest empty unavailable state when the DB is empty", async () => {
    vi.mocked(getPublishedTracks).mockResolvedValue(ok([]));
    vi.mocked(getPublishedCourses).mockResolvedValue(ok([]));

    const result = await loadTracks();

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });

  it("returns unavailable when the query fails", async () => {
    vi.mocked(getPublishedTracks).mockResolvedValue(fail);
    vi.mocked(getPublishedCourses).mockResolvedValue(ok([]));

    const result = await loadTracks();

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });

  it("still serves DB tracks when the course-count query fails", async () => {
    vi.mocked(getPublishedTracks).mockResolvedValue(ok([dbTrack()]));
    vi.mocked(getPublishedCourses).mockResolvedValue(fail);

    const result = await loadTracks();

    expect(result.source).toBe("db");
    expect(result.items[0].coursesCount).toBe(0);
  });
});

describe("loadCourses", () => {
  it("joins track titles and counts published lessons", async () => {
    vi.mocked(getPublishedCourses).mockResolvedValue(ok([dbCourse()]));
    vi.mocked(getPublishedTracks).mockResolvedValue(ok([dbTrack({ id: "t1" })]));
    vi.mocked(getPublishedLessons).mockResolvedValue(
      ok([dbLesson({ course_id: "c1" }), dbLesson({ id: "l2", course_id: "c1" })])
    );

    const result = await loadCourses();

    expect(result.source).toBe("db");
    expect(result.items[0]).toMatchObject({
      id: "c1",
      slug: "db-course",
      track: "DB Track",
      trackSlug: "db-track",
      lessonsCount: 2,
      duration: "—",
      level: null,
      featured: false,
    });
  });

  it("skips courses whose track is not published", async () => {
    vi.mocked(getPublishedCourses).mockResolvedValue(ok([dbCourse()]));
    vi.mocked(getPublishedTracks).mockResolvedValue(ok([]));
    vi.mocked(getPublishedLessons).mockResolvedValue(ok([]));

    const result = await loadCourses();

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });

  it("returns unavailable when the DB is empty", async () => {
    vi.mocked(getPublishedCourses).mockResolvedValue(ok([]));
    vi.mocked(getPublishedTracks).mockResolvedValue(ok([]));
    vi.mocked(getPublishedLessons).mockResolvedValue(ok([]));

    const result = await loadCourses();

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });
});

describe("loadLessonsForCourse", () => {
  it("returns unavailable without querying when courseId is null", async () => {
    const result = await loadLessonsForCourse(null);

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
    expect(getPublishedLessons).not.toHaveBeenCalled();
  });

  it("serves DB lessons scoped to the course, including video_url", async () => {
    vi.mocked(getPublishedLessons).mockResolvedValue(
      ok([dbLesson({ duration: "05:00", type: "video", video_url: "https://www.youtube.com/watch?v=abc123" })])
    );

    const result = await loadLessonsForCourse("c1");

    expect(getPublishedLessons).toHaveBeenCalledWith("c1");
    expect(result.source).toBe("db");
    expect(result.items[0]).toEqual({
      id: "l1",
      courseId: "c1",
      slug: "db-lesson",
      title: "DB Lesson",
      duration: "05:00",
      type: "video",
      videoUrl: "https://www.youtube.com/watch?v=abc123",
    });
  });

  it("returns unavailable when the course has no published lessons", async () => {
    vi.mocked(getPublishedLessons).mockResolvedValue(ok([]));

    const result = await loadLessonsForCourse("c1");

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });
});

describe("loadEvents", () => {
  it("maps DB events, skipping rows without a date", async () => {
    vi.mocked(getPublishedContent).mockResolvedValue(
      ok([
        dbContentItem({
          slug: "real-event",
          kind: "event",
          event_date: "2026-12-01",
          event_time: "18:00",
          location: "Hall",
          category: "Workshop",
          featured: true,
        }),
        dbContentItem({ slug: "no-date", kind: "event" }),
      ])
    );

    const result = await loadEvents();

    expect(getPublishedContent).toHaveBeenCalledWith("event");
    expect(result.source).toBe("db");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      slug: "real-event",
      date: "2026-12-01",
      time: "18:00",
      category: "Workshop",
      featured: true,
      demo: false,
    });
  });

  it("returns unavailable when every row is incomplete", async () => {
    vi.mocked(getPublishedContent).mockResolvedValue(
      ok([dbContentItem({ kind: "event" })])
    );

    const result = await loadEvents();

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });
});

describe("loadProjects", () => {
  it("maps DB projects with safe defaults for null fields", async () => {
    vi.mocked(getPublishedContent).mockResolvedValue(
      ok([
        dbContentItem({
          slug: "db-project",
          kind: "project",
          featured: true,
          technologies: null,
          long_description: null,
        }),
      ])
    );

    const result = await loadProjects();

    expect(result.source).toBe("db");
    expect(result.items[0]).toMatchObject({
      slug: "db-project",
      longDescription: "",
      technologies: [],
      category: "Project",
      featured: true,
      demo: false,
      githubUrl: null,
      demoUrl: null,
    });
  });

  it("uses meta.color when provided", async () => {
    vi.mocked(getPublishedContent).mockResolvedValue(
      ok([dbContentItem({ kind: "project", meta: { color: "#123456" } })])
    );

    const result = await loadProjects();

    expect(result.items[0].color).toBe("#123456");
  });
});

describe("loadOpportunities", () => {
  it("maps category to type and keeps nullable deadline", async () => {
    vi.mocked(getPublishedContent).mockResolvedValue(
      ok([
        dbContentItem({
          slug: "db-opp",
          kind: "opportunity",
          category: "Hackathon",
          deadline: null,
        }),
      ])
    );

    const result = await loadOpportunities();

    expect(getPublishedContent).toHaveBeenCalledWith("opportunity");
    expect(result.source).toBe("db");
    expect(result.items[0]).toMatchObject({
      type: "Hackathon",
      deadline: null,
      demo: false,
    });
  });
});

describe("loadResources", () => {
  it("serves DB resources and disables external links without a target", async () => {
    vi.mocked(getPublishedResources).mockResolvedValue(
      ok([dbResource(), dbResource({ id: "r2", slug: "with-link", link: "https://example.com" })])
    );

    const result = await loadResources();

    expect(result.source).toBe("db");
    expect(result.items[0]).toMatchObject({
      slug: "db-resource",
      category: "",
      link: "",
      external: false,
      icon: "BookOpen",
    });
    expect(result.items[1].external).toBe(true);
  });

  it("returns unavailable when the DB is empty", async () => {
    vi.mocked(getPublishedResources).mockResolvedValue(ok([]));

    const result = await loadResources();

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });
});

describe("loadTeams and loadStories", () => {
  it("maps published teams", async () => {
    vi.mocked(getPublishedTeams).mockResolvedValue(ok([dbTeam()]));

    const result = await loadTeams();

    expect(result.source).toBe("db");
    expect(result.items).toEqual([{ slug: "db-team", name: "DB Team", description: "" }]);
  });

  it("returns unavailable when teams are missing", async () => {
    vi.mocked(getPublishedTeams).mockResolvedValue(ok([]));

    const result = await loadTeams();

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });

  it("maps stories with meta.date or created_at as the date", async () => {
    vi.mocked(getPublishedContent).mockResolvedValue(
      ok([
        dbContentItem({ slug: "with-meta", kind: "news", meta: { date: "2026-05-05" } }),
        dbContentItem({ slug: "without-meta", kind: "news" }),
      ])
    );

    const result = await loadStories("news");

    expect(getPublishedContent).toHaveBeenCalledWith("news");
    expect(result.source).toBe("db");
    expect(result.items[0].date).toBe("2026-05-05");
    expect(result.items[1].date).toBe("2026-03-04T05:06:07Z");
  });

  it("returns unavailable when stories are missing", async () => {
    vi.mocked(getPublishedContent).mockResolvedValue(fail);

    const result = await loadStories("achievement");

    expect(result.source).toBe("unavailable");
    expect(result.items).toEqual([]);
  });
});
