// Hand-maintained database types for the Stage B schema
// (supabase/migrations/20261011235451_init.sql).
// Kept in sync manually; regenerate from a live instance later if desired.

export type AppRole = "admin" | "leader" | "member";

export type ContentKind =
  | "event"
  | "project"
  | "opportunity"
  | "news"
  | "achievement";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Team {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  role: AppRole;
  display_name: string | null;
  team_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  duration: string | null;
  featured: boolean;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  track_id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  color: string | null;
  thumbnail: string | null;
  duration: string | null;
  featured: boolean;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  duration: string | null;
  type: string | null;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  kind: ContentKind;
  slug: string;
  title: string;
  description: string | null;
  body: string | null;
  category: string | null;
  meta: Record<string, unknown>;
  featured: boolean;
  published: boolean;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  opportunity_date: string | null;
  deadline: string | null;
  link: string | null;
  long_description: string | null;
  technologies: string[] | null;
  github_url: string | null;
  demo_url: string | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  link: string | null;
  external: boolean;
  category: string | null;
  icon: string | null;
  course_id: string | null;
  lesson_id: string | null;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  interests: string[];
  motivation: string | null;
  heard_from: string | null;
  status: ApplicationStatus;
  submitted_ip: string | null;
  created_at: string;
  updated_at: string;
}

// Shape passed to an INSERT on `applications`. `id`, `status`, timestamps and
// `submitted_ip` are set server-side / by defaults, never by the client.
export interface ApplicationInsert {
  name: string;
  email: string;
  interests: string[];
  motivation?: string | null;
  heard_from?: string | null;
}

/** Minimal row shape for the `Database` interface consumed by supabase-js. */
export interface Database {
  public: {
    Tables: {
      teams: { Row: Team; Insert: Partial<Team> & { slug: string; name: string }; Update: Partial<Team> };
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> };
      tracks: { Row: Track; Insert: Partial<Track> & { slug: string; title: string }; Update: Partial<Track> };
      courses: { Row: Course; Insert: Partial<Course> & { track_id: string; slug: string; title: string }; Update: Partial<Course> };
      lessons: { Row: Lesson; Insert: Partial<Lesson> & { course_id: string; slug: string; title: string }; Update: Partial<Lesson> };
      content_items: { Row: ContentItem; Insert: Partial<ContentItem> & { kind: ContentKind; slug: string; title: string }; Update: Partial<ContentItem> };
      applications: { Row: Application; Insert: ApplicationInsert; Update: Partial<Application> };
      resources: { Row: Resource; Insert: Partial<Resource> & { slug: string; title: string }; Update: Partial<Resource> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: AppRole;
      content_kind: ContentKind;
      application_status: ApplicationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
