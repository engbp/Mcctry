import { Metadata } from "next";
import { notFound } from "next/navigation";
import { lessonsData, coursesData } from "@/lib/data";
import { LessonClient } from "./LessonClient";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const course = coursesData.find((c) => c.slug === slug);
  const lesson = lessonsData.find((l) => l.slug === lessonSlug);
  if (!course || !lesson) return { title: "Lesson Not Found" };
  return {
    title: `${lesson.title} — ${course.title} — MCC MNU`,
    description: `Lesson ${lessonsData.findIndex((l) => l.slug === lessonSlug) + 1} of ${lessonsData.length}: ${lesson.title}`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const course = coursesData.find((c) => c.slug === slug);
  const lessonIndex = lessonsData.findIndex((l) => l.slug === lessonSlug);
  const lesson = lessonsData[lessonIndex];

  if (!course || !lesson) notFound();

  const prevLesson = lessonIndex > 0 ? lessonsData[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < lessonsData.length - 1 ? lessonsData[lessonIndex + 1] : null;
  const lessonNumber = lessonIndex + 1;
  const totalLessons = lessonsData.length;

  return (
    <LessonClient
      course={course}
      lesson={lesson}
      lessonIndex={lessonIndex}
      lessonNumber={lessonNumber}
      totalLessons={totalLessons}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      slug={slug}
    />
  );
}