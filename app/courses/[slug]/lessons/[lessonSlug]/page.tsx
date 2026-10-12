import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadCourses, loadLessonsForCourse } from "@/lib/content-views";
import { LessonClient } from "./LessonClient";

export const revalidate = 300;

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
    />
  );
}
