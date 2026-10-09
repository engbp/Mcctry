import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, ArrowLeft, BookOpen, Clock, Users, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { coursesData, getCoursesByTrack, lessonsData } from "@/lib/data";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = coursesData.find((c) => c.slug === slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} — MCC MNU`,
    description: course.description,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = coursesData.find((c) => c.slug === slug);
  if (!course) notFound();

  const trackCourses = getCoursesByTrack(course.trackSlug);
  const courseIndex = trackCourses.findIndex((c) => c.slug === slug);
  const prevCourse = courseIndex > 0 ? trackCourses[courseIndex - 1] : null;
  const nextCourse = courseIndex < trackCourses.length - 1 ? trackCourses[courseIndex + 1] : null;

  const totalLessons = lessonsData.length;
  const totalDuration = "2h 40m";

  return (
    <>
      <PageHero
        label={`Courses / ${course.track}`}
        title={course.title}
        lede={course.description}
        badge={`${totalLessons} Lessons · ${totalDuration} · ${course.level}`}
        badgeVariant="blue"
        kicker="01 / COURSE"
        visual={
          <div className="course-hero-visual" aria-hidden="true" style={{ background: course.color ? `linear-gradient(135deg, ${course.color} 0%, ${course.color}cc 100%)` : "var(--mcc-navy)", borderRadius: "var(--radius-md)", minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", position: "relative", overflow: "hidden" }}>
            <div className="course-hero-pattern" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px); background-size: 50px 50px;" }} />
            <div className="course-hero-content" style={{ position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", color: "var(--mcc-cyan)", display: "block", marginBottom: "8px" }}>FEATURED COURSE</span>
              <strong style={{ fontSize: "clamp(36px, 4vw, 58px)", lineHeight: 0.9, fontWeight: 800, display: "block", marginBottom: "12px" }}>
                {course.title.toUpperCase().split(" ").join("<br />")}
              </strong>
              <small style={{ fontSize: "10px", letterSpacing: "0.08em", color: "rgba(255,255,255,.7)", display: "block" }}>{totalLessons} LESSONS · {totalDuration} · {course.level.toUpperCase()}</small>
            </div>
            <div className="course-hero-grid" aria-hidden="true" style={{ position: "absolute", bottom: "48px", right: "48px", width: "200px", height: "200px", background: "rgba(255,255,255,.05)", borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)" }} />
          </div>
        }
      />

      <section className="section" aria-labelledby="about-course-title">
        <div className="container detail-grid">
          <div className="course-main">
            <SectionHeader number="01" label="ABOUT THIS COURSE" title="What you'll learn." />
            <div className="course-overview" style={{ marginTop: "24px" }}>
              <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginBottom: "24px" }}>{course.description}</p>
              <p className="body" style={{ color: "var(--mcc-text-muted)" }}>This demo course is structured like a lightweight learning path: short lessons, useful resources, and a clear next step after every lesson. Perfect for fitting learning into a busy student schedule.</p>
            </div>

            <SectionHeader number="02" label="COURSE CONTENTS" title={`${totalLessons} lessons, ${totalDuration} total.`} style={{ marginTop: "48px" }} />
            <div className="lessons-list" role="list" style={{ marginTop: "24px" }}>
              {lessonsData.map((lesson, i) => (
                <CardLink key={lesson.slug} href={`/courses/${slug}/lessons/${lesson.slug}`} className="lesson-row" role="listitem">
                  <span className="lesson-number">0{i + 1}</span>
                  <div className="lesson-info">
                    <h3>{lesson.title}</h3>
                    <div className="lesson-meta">
                      <span><Clock size={14} /> {lesson.duration}</span>
                      <span>Video lesson</span>
                    </div>
                  </div>
                  <ChevronRight className="lesson-chevron" size={18} />
                </CardLink>
              ))}
            </div>
          </div>

          <aside className="course-sidebar" aria-labelledby="sidebar-title">
            <Card variant="default" className="sidebar-card">
              <CardContent>
                <h3 id="sidebar-title" style={{ fontSize: "22px", fontWeight: 600, marginBottom: "12px" }}>Start Learning</h3>
                <p className="body" style={{ color: "var(--mcc-text-muted)", marginBottom: "20px" }}>{totalLessons} lessons · {totalDuration} · {course.level}</p>
                <Button variant="primary" asChild size="lg" style={{ width: "100%", marginBottom: "12px" }}>
                  <Link href={`/courses/${slug}/lessons/introduction`}>Start Course <ArrowRight size={18} /></Link>
                </Button>
                {prevCourse && (
                  <TextLink href={`/courses/${prevCourse.slug}`} variant="muted" style={{ display: "block", marginBottom: "8px" }}>
                    <ArrowLeft size={14} /> Previous: {prevCourse.title}
                  </TextLink>
                )}
                {nextCourse && (
                  <TextLink href={`/courses/${nextCourse.slug}`} variant="muted" style={{ display: "block" }}>
                    Next: {nextCourse.title} <ArrowRight size={14} />
                  </TextLink>
                )}
              </CardContent>
            </Card>

            <Card variant="default" className="sidebar-card" style={{ marginTop: "24px" }}>
              <CardContent>
                <h3 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "12px" }}>Skills You'll Gain</h3>
                <ul className="skills-list" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {["AI Fundamentals", "Structured Prompting", "Model Evaluation", "Responsible AI Use"].map((skill) => (
                    <li key={skill} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0" }}>
                      <CheckCircle size={16} style={{ color: "var(--mcc-accent-green)" }} />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card variant="default" className="sidebar-card" style={{ marginTop: "24px", borderLeft: "3px solid var(--mcc-accent-yellow)", background: "#fff8e1" }}>
              <CardContent>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flexShrink: 0, color: "var(--mcc-accent-yellow)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ display: "block", marginBottom: "4px" }}>Demo Mode</strong>
                    <p className="body-sm" style={{ color: "#5d4a00", margin: 0 }}>Progress is local and no account is connected. This is a presentation prototype.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-navy)", color: "var(--mcc-white)" }} aria-labelledby="track-cta-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <SectionHeader number="03" label="CONTINUE YOUR PATH" title={`More courses in ${course.track}`} dark />
          <p className="body-lg" style={{ color: "#d9e5ed", marginTop: "16px", marginBottom: "32px" }}>This course is part of the {course.track} track. Continue building your expertise with related courses.</p>
          <div className="grid-3" style={{ marginTop: "32px", textAlign: "left" }}>
            {trackCourses.filter((c) => c.slug !== slug).slice(0, 3).map((related) => (
              <CardLink key={related.slug} href={`/courses/${related.slug}`} className="related-course-card" style={{ background: "var(--mcc-navy-2)", borderColor: "var(--mcc-line-dark)" }}>
                <CardContent>
                  <Badge variant="cyan">{related.level}</Badge>
                  <h3 style={{ marginTop: "12px", marginBottom: "8px" }}>{related.title}</h3>
                  <p className="body-sm" style={{ color: "#91b3c5" }}>{related.lessonsCount} lessons · {related.duration}</p>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}