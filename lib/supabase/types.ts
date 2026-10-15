// Hand-maintained database types for the Stage B schema
// (supabase/migrations/20261011235451_init.sql).
// Kept in sync manually; regenerate from a live instance later if desired.

export type AppRole = "admin" | "leader" | "member" | "student";

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

export type Team = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  role: AppRole;
  display_name: string | null;
  team_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Track = {
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
};

export type Course = {
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
};

export type Lesson = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  duration: string | null;
  type: string | null;
  video_url: string | null;
  published: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
};

export type ContentItem = {
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
};
