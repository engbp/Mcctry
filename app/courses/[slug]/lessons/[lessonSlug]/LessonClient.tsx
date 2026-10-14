"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/fx/Reveal";
import { VideoPlayer } from "@/components/learn/VideoPlayer";
import { toggleLessonCompletion, type ProgressActionState } from "@/app/courses/progress-actions";
import type { LessonView } from "@/lib/content-views";

interface LessonClientProps {
  course: { slug: string; track: string; title: string };
  lesson: LessonView;
  lessons: LessonView[];
  lessonIndex: number;
  lessonNumber: number;
  totalLessons: number;
  prevLesson: LessonView | null;
  nextLesson: LessonView | null;
  slug: string;
  isSignedIn: boolean;
  initialCompleted: boolean;
  completedLessonIds: string[];
}

export function LessonClient({
  course, lesson, lessons, lessonIndex, lessonNumber, totalLessons, prevLesson, nextLesson, slug,
  isSignedIn, initialCompleted, completedLessonIds,
}: LessonClientProps) {
  const [progressState, formAction, isPending] = useActionState<ProgressActionState, FormData>(
    toggleLessonCompletion,
    { ok: true, completed: initialCompleted }
  );

  const completed = progressState.completed ?? initialCompleted;
  const completedCount = completedLessonIds.length + (completed && !initialCompleted ? 1 : 0);
  const progressPercent = totalLessons
    ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
    : 0;

  return (
    <>
      <header className="lesson-topbar">
        <div className="container lesson-topbar-inner">
          <Link href={`/courses/${slug}`} className="lesson-back">
            <ArrowLeft size={16} /> {course.title}
          </Link>
          <span className="lesson-topbar-progress">
            Lesson {lessonNumber} of {totalLessons}
            <span className="lesson-topbar-bar"><i style={{ width: `${progressPercent}%` }} /></span>
          </span>
        </div>
      </header>

      <section className="section lesson-section" aria-labelledby="video-title">
        <div className="container lesson-layout">
          <div className="lesson-main">
            <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />

            <Reveal className="lesson-info">
              <div className="lesson-info-meta">
                <Badge variant="blue">Lesson {lessonNumber} of {totalLessons}</Badge>
                <Badge variant="default">{course.title}</Badge>
                <span className="lesson-info-duration">{lesson.duration} · {lesson.type}</span>
              </div>
              <h1 id="video-title">{lesson.title}</h1>

              {isSignedIn ? (
                <form action={formAction} className="lesson-complete-form">
                  <input type="hidden" name="lessonId" value={lesson.id ?? ""} />
                  <input type="hidden" name="courseId" value={lesson.courseId ?? ""} />
                  <input type="hidden" name="lessonSlug" value={lesson.slug} />
                  <input type="hidden" name="courseSlug" value={slug} />
                  <input type="hidden" name="completed" value={completed ? "true" : "false"} />
                  <Button
                    variant={completed ? "secondary" : "primary"}
                    type="submit"
                    disabled={isPending || !lesson.id}
                    aria-pressed={completed}
                  >
                    <CheckCircle size={17} />
                    {isPending ? "Saving…" : completed ? "Completed — click to undo" : "Mark as completed"}
                  </Button>
                  {progressState.message && (
                    <p className="auth-field-error" role="alert">{progressState.message}</p>
                  )}
                  <p className="lesson-progress-hint">
                    {completedCount} of {totalLessons} lessons completed ({progressPercent}%).
                    Progress is saved to your account.
                  </p>
                </form>
              ) : (
                <div className="notice notice-info">
                  <strong>Sign in to track progress.</strong> You can watch this
                  lesson now. Create a free student account to mark lessons
                  complete and see your progress on the dashboard.{" "}
                  <Link href={`/login?next=/courses/${slug}/lessons/${lesson.slug}`}>Sign in</Link>
                  {" · "}
                  <Link href={`/signup?next=/courses/${slug}/lessons/${lesson.slug}`}>Create account</Link>
                </div>
              )}

              <div className="lesson-nav-buttons">
                {prevLesson ? (
                  <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`} className="lesson-nav-btn">
                    <ArrowLeft size={16} />
                    <span><small>Previous</small>{prevLesson.title}</span>
                  </Link>
                ) : (
                  <span className="lesson-nav-btn lesson-nav-btn-disabled"><ArrowLeft size={16} /><span><small>Previous</small>Start of course</span></span>
                )}
                {nextLesson ? (
                  <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`} className="lesson-nav-btn lesson-nav-btn-next">
                    <span><small>Next</small>{nextLesson.title}</span>
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link href={`/courses/${slug}`} className="lesson-nav-btn lesson-nav-btn-next">
                    <span><small>Finish</small>Back to course</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </Reveal>
          </div>

          <aside className="lesson-sidebar" aria-labelledby="course-contents-title">
            <div className="lesson-side-head">
              <h3 id="course-contents-title">Course contents</h3>
              <Badge variant="blue">{totalLessons}</Badge>
            </div>
            <nav className="lesson-side-nav" aria-label="Lesson navigation">
              {lessons.map((l, i) => {
                const isCurrent = i === lessonIndex;
                const isCompleted = completedLessonIds.includes(l.id ?? "") || (isCurrent && completed);
                return (
                  <Link
                    key={l.slug}
                    href={`/courses/${slug}/lessons/${l.slug}`}
                    className={`lesson-side-item ${isCurrent ? "current" : ""} ${isCompleted ? "completed" : ""}`}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    <span className="lesson-side-number">
                      {isCompleted ? <CheckCircle size={14} /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="lesson-side-copy">
                      <strong>{l.title}</strong>
                      <small>{l.duration} · {l.type}</small>
                    </span>
                    {isCurrent && <ChevronRight size={15} className="lesson-side-chevron" />}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      </section>
    </>
  );
}
