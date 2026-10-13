import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadCourses, loadLessonsForCourse } from "@/lib/content-views";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LessonClient } from "./LessonClient";

// Progress and auth state are per-visitor; never cache the rendered page.
export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

async function loadLessonContext(slug: string, lessonSlug: string) {
  const { items: courses, source } = await loadCourses();
  const course = courses.find((c) => c.slug === slug);
  if (!course) return null;
  const { items: lessons } = await loadLessonsForCourse(
    source === "db" ? course.id : null
  );
  const lessonIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = lessons[lessonIndex];
  if (!lesson) return null;
  return { course, lessons, lesson, lessonIndex };
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const context = await loadLessonContext(slug, lessonSlug);
  if (!context) return { title: "Lesson Not Found" };
  return {
    title: `${context.lesson.title} — ${context.course.title} — MCC MNU`,
    description: `Lesson ${context.lessonIndex + 1} of ${context.lessons.length}: ${context.lesson.title}`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const context = await loadLessonContext(slug, lessonSlug);
  if (!context) notFound();

  const { course, lessons, lesson, lessonIndex } = context;
  const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

  const user = await getCurrentUser();
  let completedLessonIds: string[] = [];
  let initialCompleted = false;
  if (user && course.id) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", course.id);
    completedLessonIds = (data ?? []).map((row) => row.lesson_id);
    initialCompleted = lesson.id ? completedLessonIds.includes(lesson.id) : false;
  }

  return (
    <LessonClient
      course={course}
      lesson={lesson}
      lessons={lessons}
      lessonIndex={lessonIndex}
      lessonNumber={lessonIndex + 1}
      totalLessons={lessons.length}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      slug={slug}
      isSignedIn={Boolean(user)}
      initialCompleted={initialCompleted}
      completedLessonIds={completedLessonIds}
    />
  );
}
