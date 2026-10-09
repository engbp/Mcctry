import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, BookOpen, Clock, Play, CheckCircle, ChevronRight, Layers, Sparkles, Gauge } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
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

const skills = ["AI Fundamentals", "Structured Prompting", "Model Evaluation", "Responsible AI Use"];

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = coursesData.find((c) => c.slug === slug);
  if (!course) notFound();

  const trackCourses = getCoursesByTrack(course.trackSlug);
  const courseIndex = trackCourses.findIndex((c) => c.slug === slug);
  const prevCourse = courseIndex > 0 ? trackCourses[courseIndex - 1] : null;
  const nextCourse = courseIndex < trackCourses.length - 1 ? trackCourses[courseIndex + 1] : null;

  const totalLessons = lessonsData.length;
  const totalDuration = course.duration;

  return (
    <>
      <BandHero
        crumbs={[{ label: "Courses", href: "/courses" }, { label: course.track }, { label: course.title }]}
        kicker={`COURSE · ${course.track.toUpperCase()}`}
        title={course.title}
        lede={course.description}
        color={course.color}
        meta={
          <>
            <span className="band-meta-pill"><BookOpen size={14} /> {totalLessons} lessons</span>
            <span className="band-meta-pill"><Clock size={14} /> {totalDuration}</span>
            <span className="band-meta-pill"><Gauge size={14} /> {course.level}</span>
          </>
        }
        actions={
          <Button variant="inverse" asChild size="lg">
            <Link href={`/courses/${slug}/lessons/${lessonsData[0]?.slug ?? "introduction"}`}>
              <Play size={17} fill="currentColor" /> Start course
            </Link>
          </Button>
        }
        icon={<BookOpen size={56} />}
      />

      <section className="section" aria-labelledby="about-course-title">
        <div className="container detail-grid">
          <div className="course-main">
            <div className="lk-section-head">
              <div>
                <span className="hp-section-kicker">ABOUT THIS COURSE</span>
                <h2 id="about-course-title" className="hp-section-title">What you&apos;ll learn.</h2>
              </div>
            </div>
            <div className="lk-prose">
              <p>{course.description}</p>
              <p>This demo course is structured like a lightweight learning path: short lessons, useful resources, and a clear next step after every lesson. Perfect for fitting learning into a busy student schedule.</p>
            </div>

            <div className="lk-section-head" style={{ marginTop: "48px" }}>
              <div>
                <span className="hp-section-kicker">COURSE CONTENTS</span>
                <h2 className="hp-section-title">{totalLessons} lessons, {totalDuration} total.</h2>
              </div>
            </div>
            <div className="lk-lesson-list" role="list">
              {lessonsData.map((lesson, i) => (
                <Link key={lesson.slug} href={`/courses/${slug}/lessons/${lesson.slug}`} className="lk-lesson-row" role="listitem">
                  <span className="lk-lesson-play" aria-hidden="true"><Play size={15} fill="currentColor" /></span>
                  <span className="lk-lesson-index">{String(i + 1).padStart(2, "0")}</span>
                  <div className="lk-lesson-info">
                    <h3>{lesson.title}</h3>
                    <div className="lk-lesson-meta">
                      <span><Clock size={13} /> {lesson.duration}</span>
                      <span>{lesson.type}</span>
                    </div>
                  </div>
                  <ChevronRight className="lk-lesson-chevron" size={18} />
                </Link>
              ))}
            </div>
          </div>

          <aside className="course-sidebar" aria-labelledby="sidebar-title">
            <div className="lk-side-card">
              <h3 id="sidebar-title">Start learning</h3>
              <p className="lk-side-sub">{totalLessons} lessons · {totalDuration} · {course.level}</p>
              <Button variant="primary" asChild size="lg" style={{ width: "100%" }}>
                <Link href={`/courses/${slug}/lessons/${lessonsData[0]?.slug ?? "introduction"}`}>
                  Start course <ArrowRight size={17} />
                </Link>
              </Button>
              <div className="lk-side-navlinks">
                {prevCourse && (
                  <Link href={`/courses/${prevCourse.slug}`}>
                    <ArrowLeft size={14} /> Previous: {prevCourse.title}
                  </Link>
                )}
                {nextCourse && (
                  <Link href={`/courses/${nextCourse.slug}`}>
                    Next: {nextCourse.title} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>

            <div className="lk-side-card">
              <h3>Skills you&apos;ll gain</h3>
              <ul className="lk-skills">
                {skills.map((skill) => (
                  <li key={skill}>
                    <CheckCircle size={16} aria-hidden="true" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lk-side-card lk-side-card-notice">
              <strong>Demo mode</strong>
              <p>Progress is local and no account is connected. This is a presentation prototype.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="track-cta-title">
        <div className="container">
          <div className="lk-section-head lk-section-head-dark">
            <div>
              <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>CONTINUE YOUR PATH</span>
              <h2 id="track-cta-title" className="hp-section-title" style={{ color: "#fff" }}>More courses in {course.track}</h2>
            </div>
            <Link href={`/tracks/${course.trackSlug}`} className="hp-section-link hp-section-link-light">
              View track <ArrowRight size={15} />
            </Link>
          </div>
          <div className="lk-related-grid" role="list">
            {trackCourses.filter((c) => c.slug !== slug).slice(0, 3).map((related) => (
              <Link key={related.slug} href={`/courses/${related.slug}`} className="lk-related-card" role="listitem" style={{ "--track-color": related.color } as React.CSSProperties}>
                <span className="lk-related-level">{related.level}</span>
                <h3>{related.title}</h3>
                <p>{related.lessonsCount} lessons · {related.duration}</p>
                <span className="lk-related-cta">Open course <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
