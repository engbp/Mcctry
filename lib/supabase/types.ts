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

export type Resource = {
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
};

export type Application = {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  answers: Record<string, string>;
  interests: string[];
  motivation: string | null;
  heard_from: string | null;
  status: ApplicationStatus;
  submitted_ip: string | null;
  created_at: string;
  updated_at: string;
};

// Shape passed to an INSERT on `applications`. `id`, `status`, timestamps and
// `submitted_ip` are set server-side / by defaults, never by the client.
export type ApplicationInsert = {
  name: string;
  email: string;
  interests: string[];
  phone_number: string;
  answers: Record<string, string>;
  motivation?: string | null;
  heard_from?: string | null;
};

/** Minimal row shape for the `Database` interface consumed by supabase-js.
 * Must be a type alias (not an interface) so row shapes get implicit index
 * signatures and satisfy `Record<string, unknown>` in GenericTable. */
export type Database = {
  public: {
    Tables: {
      teams: {
        Row: Team;
        Insert: Partial<Team> & { slug: string; name: string };
        Update: Partial<Team>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      tracks: {
        Row: Track;
        Insert: Partial<Track> & { slug: string; title: string };
        Update: Partial<Track>;
        Relationships: [];
      };
      courses: {
        Row: Course;
        Insert: Partial<Course> & { track_id: string; slug: string; title: string };
        Update: Partial<Course>;
        Relationships: [
          {
            foreignKeyName: "courses_track_id_fkey";
            columns: ["track_id"];
            isOneToOne: false;
            referencedRelation: "tracks";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: Lesson;
        Insert: Partial<Lesson> & { course_id: string; slug: string; title: string };
        Update: Partial<Lesson>;
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_progress: {
        Row: LessonProgress;
        Insert: Partial<LessonProgress> & { user_id: string; lesson_id: string; course_id: string };
        Update: Partial<LessonProgress>;
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      content_items: {
        Row: ContentItem;
        Insert: Partial<ContentItem> & { kind: ContentKind; slug: string; title: string };
        Update: Partial<ContentItem>;
        Relationships: [];
      };
      applications: {
        Row: Application;
        Insert: ApplicationInsert;
        Update: Partial<Application>;
        Relationships: [];
      };
      resources: {
        Row: Resource;
        Insert: Partial<Resource> & { slug: string; title: string };
        Update: Partial<Resource>;
        Relationships: [
          {
            foreignKeyName: "resources_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resources_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
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
