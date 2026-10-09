import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, BookOpen, Code2, Clock, Search, Filter, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { coursesData, tracksData } from "@/lib/data";

export default function CoursesPage() {
  const tracks = tracksData;

  return (
    <>
      <PageHero
        label="Courses"
        title="Learn with MCC MNU."
        lede="Find focused courses and lessons designed to help you learn at your own pace. All courses are part of structured learning tracks."
        badge={coursesData.length + " Courses"}
        badgeVariant="blue"
        kicker="01 / CATALOGUE"
      />

      <section className="section" aria-labelledby="courses-filters-title">
        <div className="container">
          <div className="courses-header" style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px" }}>
            <div className="search-box" style={{ flex: 1, minWidth: "280px", maxWidth: "500px" }}>
              <label htmlFor="course-search" className="visually-hidden">Search courses</label>
              <input
                id="course-search"
                type="search"
                placeholder="Search courses..."
                className="search-input"
                style={{ width: "100%", padding: "12px 16px", border: "1px solid var(--mcc-line)", background: "var(--mcc-white)", fontSize: "14px", borderRadius: "var(--radius-sm)" }}
              />
            </div>
            <div className="filters" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button className="filter-btn active" style={{ padding: "10px 16px", border: "1px solid var(--mcc-blue)", background: "#f0f8fc", color: "var(--mcc-blue-strong)", fontSize: "13px", fontWeight: 600, borderRadius: "var(--radius-sm)" }}>All</button>
              {tracks.map((track) => (
                <button key={track.slug} className="filter-btn" style={{ padding: "10px 16px", border: "1px solid var(--mcc-line)", background: "var(--mcc-white)", color: "var(--mcc-text)", fontSize: "13px", fontWeight: 600, borderRadius: "var(--radius-sm)" }}>{track.title}</button>
              ))}
              <button className="filter-btn" style={{ padding: "10px 16px", border: "1px solid var(--mcc-line)", background: "var(--mcc-white)", color: "var(--mcc-text)", fontSize: "13px", fontWeight: 600, borderRadius: "var(--radius-sm)" }}>Beginner</button>
              <button className="filter-btn" style={{ padding: "10px 16px", border: "1px solid var(--mcc-line)", background: "var(--mcc-white)", color: "var(--mcc-text)", fontSize: "13px", fontWeight: 600, borderRadius: "var(--radius-sm)" }}>Intermediate</button>
            </div>
          </div>

          <div className="grid-3" role="list" id="courses-grid" style={{ marginTop: "24px" }}>
            {coursesData.map((course, i) => (
              <CardLink key={course.slug} href={`/courses/${course.slug}`} className="course-card" role="listitem" style={{ minHeight: "420px" }}>
                <CardContent className="course-card-content">
                  <div className="course-card-media" aria-hidden="true" style={{ background: course.color ? `linear-gradient(135deg, ${course.color}20, ${course.color}05)` : "var(--mcc-paper)", position: "relative", overflow: "hidden" }}>
                    <div className="course-card-media-bg" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,120,212,.1) 0%, rgba(0,199,232,.1) 100%)" }} />
                    {course.featured && <Badge variant="featured" style={{ position: "absolute", top: "16px", left: "16px" }}>Featured</Badge>}
                    <div className="course-card-media-pattern" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,120,212,.06) 1px,transparent 1px),linear-gradient(rgba(0,120,212,.06) 1px,transparent 1px); background-size: 40px 40px;" }} />
                  </div>
                  <div className="course-card-body">
                    <div className="course-card-header">
                      <Badge variant="blue">{course.track}</Badge>
                      <span className="course-card-number">0{i + 1}</span>
                    </div>
                    <h3 className="course-card-title">{course.title}</h3>
                    <p className="course-card-description">{course.description}</p>
                    <div className="course-card-meta">
                      <span><BookOpen size={14} /> {course.lessonsCount} lessons</span>
                      <span><Clock size={14} /> {course.duration}</span>
                      <span>{course.level}</span>
                    </div>
                    <div className="course-card-action">
                      <TextLink href={`/courses/${course.slug}`} variant="default">Start course</TextLink>
                    </div>
                  </div>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="tracks-cta-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <SectionHeader number="02" label="LEARNING PATHS" title="Prefer a guided journey?" />
          <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginTop: "16px", marginBottom: "32px" }}>Courses are organized into tracks — complete learning paths that take you from fundamentals to applied projects.</p>
          <TextLink href="/tracks" style={{ fontSize: "16px" }}>
            Explore Tracks <ArrowRight size={18} />
          </TextLink>
        </div>
      </section>
    </>
  );
}