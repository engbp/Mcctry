import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle, LogOut, PlayCircle } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadCourses, loadLessonsForCourse } from "@/lib/content-views";
import { signOutAction } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const profile = await getCurrentProfile();
  const displayName = profile?.display_name ?? user.email.split("@")[0];
  const isAdmin = profile?.role === "admin";

  const supabase = await createSupabaseServerClient();
  const [{ items: courses }, { count: completedCount }] = await Promise.all([
    loadCourses(),
    supabase
      .from("lesson_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("course_id, lesson_id")
    .eq("user_id", user.id);

  const progressByCourse = new Map<string, Set<string>>();
  for (const row of progressRows ?? []) {
    const set = progressByCourse.get(row.course_id) ?? new Set<string>();
    set.add(row.lesson_id);
    progressByCourse.set(row.course_id, set);
  }

  // Load lessons for each published course so students can open lessons
  // directly from the dashboard.
  const lessonsByCourse = await Promise.all(
    courses.map(async (course) => {
      if (!course.id) return { slug: course.slug, lessons: [] as Awaited<ReturnType<typeof loadLessonsForCourse>>["items"] };
      const { items } = await loadLessonsForCourse(course.id);
      return { slug: course.slug, lessons: items };
    })
  );
  const lessonsMap = new Map(lessonsByCourse.map((entry) => [entry.slug, entry.lessons]));

  return (
    <>
      <BandHero
        crumbs={[{ label: "Dashboard" }]}
        kicker="STUDENT DASHBOARD"
        title={`Welcome back, ${displayName}.`}
        lede="Pick up where you left off. Your lesson progress is saved to your account."
        color="#5c2d91"
        meta={
          <>
            <span className="band-meta-pill"><CheckCircle size={14} /> {completedCount ?? 0} lessons completed</span>
            {isAdmin && <span className="band-meta-pill"><Badge variant="navy">Admin</Badge></span>}
          </>
        }
        actions={
          <form action={signOutAction}>
            <Button variant="outline" type="submit" size="lg">
              <LogOut size={16} /> Sign out
            </Button>
          </form>
        }
        icon={<BookOpen size={56} />}
      />

      {error === "admin-required" && (
        <div className="container" style={{ marginTop: 24 }}>
          <div className="notice" role="alert">
            You need an administrator role to open the admin workspace. Your
            account is a regular student account.
          </div>
        </div>
      )}

      <section className="section" aria-labelledby="courses-title">
        <div className="container">
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">YOUR COURSES</span>
              <h2 id="courses-title" className="hp-section-title">Continue learning.</h2>
            </div>
            <Link href="/courses" className="hp-section-link">
              Browse all courses <ArrowRight size={15} />
            </Link>
          </Reveal>

          {courses.length === 0 ? (
            <div className="notice notice-info">
              No courses are published right now. Check back soon.
            </div>
          ) : (
            <Reveal className="db-grid">
              {courses.map((course) => {
                const done = course.id ? (progressByCourse.get(course.id)?.size ?? 0) : 0;
                const total = course.lessonsCount;
                const pct = total ? Math.round((done / total) * 100) : 0;
                const lessons = lessonsMap.get(course.slug) ?? [];
                return (
                  <div key={course.slug} className="db-continue" style={{ display: "block" }}>
                    <Link href={`/courses/${course.slug}`} className="db-continue-body" style={{ textDecoration: "none", color: "inherit" }}>
                      <div className="db-continue-badges">
                        <span className="cat-chip cat-chip-active" style={{ background: course.color, color: "#fff" }}>
                          {course.track}
                        </span>
                        <span className="cat-chip" style={{ background: "rgba(127,127,127,.15)" }}>
                          {course.level ?? "All levels"}
                        </span>
                      </div>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="db-continue-progress">
                        <div className="db-progress-meta">
                          <span>{done} of {total} lessons</span>
                          <strong>{pct}% complete</strong>
                        </div>
                        <div className="db-progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                          <div className="db-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Link>

                    {lessons.length > 0 && (
                      <ul className="db-lesson-list" style={{ listStyle: "none", margin: "14px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                        {lessons.map((lesson, index) => {
                          const completed = lesson.id
                            ? (progressByCourse.get(course.id ?? "")?.has(lesson.id) ?? false)
                            : false;
                          return (
                            <li key={lesson.slug}>
                              <Link
                                href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                                className="db-lesson-link"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 12px",
                                  borderRadius: 10,
                                  border: "1px solid rgba(255,255,255,.08)",
                                  background: "rgba(255,255,255,.03)",
                                  color: "inherit",
                                  textDecoration: "none",
                                  fontSize: "0.92rem",
                                }}
                              >
                                {completed ? (
                                  <CheckCircle size={16} style={{ color: "#5bd49a", flexShrink: 0 }} />
                                ) : (
                                  <PlayCircle size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
                                )}
                                <span style={{ flex: 1 }}>
                                  {index + 1}. {lesson.title}
                                </span>
                                <ArrowRight size={14} style={{ opacity: 0.6 }} />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    <Link href={`/courses/${course.slug}`} className="db-continue-cta" style={{ marginTop: 14 }}>
                      Open course <ArrowRight size={17} />
                    </Link>
                  </div>
                );
              })}
            </Reveal>
          )}

          {isAdmin && (
            <p style={{ marginTop: 32 }}>
              <Link href="/admin" className="hp-section-link">
                Open admin workspace <ArrowRight size={15} />
              </Link>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
