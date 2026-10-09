"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { TextLink } from "@/components/ui/Links";
import { ArrowRight, ArrowLeft, Play, Volume2, VolumeX, SkipBack, SkipForward, Settings, ChevronRight, X, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { CardLink } from "@/components/ui/Links";
import { lessonsData } from "@/lib/data";

interface LessonClientProps {
  course: {
    slug: string;
    track: string;
    title: string;
  };
  lesson: {
    slug: string;
    title: string;
    duration: string;
    type: string;
  };
  lessonIndex: number;
  lessonNumber: number;
  totalLessons: number;
  prevLesson: { slug: string; title: string; duration: string; type: string } | null;
  nextLesson: { slug: string; title: string; duration: string; type: string } | null;
  slug: string;
}

export function LessonClient({ 
  course, 
  lesson, 
  lessonIndex, 
  lessonNumber, 
  totalLessons, 
  prevLesson, 
  nextLesson, 
  slug 
}: LessonClientProps) {
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <PageHero
        label={`Courses / ${course.track} / ${course.title}`}
        title={lesson.title}
        lede={`Lesson ${lessonNumber} of ${totalLessons} · ${lesson.duration} · ${lesson.type}`}
        badge={`Lesson ${lessonNumber} of ${totalLessons}`}
        badgeVariant="blue"
        kicker="01 / LESSON"
        visual={
          <div className="lesson-hero-visual" aria-hidden="true" style={{ background: "var(--mcc-navy-2)", borderRadius: "var(--radius-md)", minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div className="lesson-hero-pattern" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,199,232,.08) 1px,transparent 1px),linear-gradient(rgba(0,199,232,.08) 1px,transparent 1px); background-size: 50px 50px;" }} />
            <div className="lesson-hero-play" style={{ position: "relative", zIndex: 1, width: "80px", height: "80px", background: "var(--mcc-cyan)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px rgba(0,199,232,.2), 0 0 0 8px rgba(0,199,232,.1)" }}>
              <Play size={28} style={{ color: "#03121f", marginLeft: "3px" }} />
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="video-player-title">
        <div className="container">
          <div className="video-layout">
            <div className="video-main">
              <div className="video-player-wrapper">
                <div className="video-player" role="region" aria-label="Video player" style={{ aspectRatio: "16/9", background: "#0b0b0b", borderRadius: "var(--radius-md)", overflow: "hidden", position: "relative" }}>
                  <div className="video-placeholder" aria-hidden="true" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", color: "#fff" }}>
                    <div className="video-placeholder-content" style={{ textAlign: "center" }}>
                      <Play className="video-play-btn" size={64} />
                      <p className="video-placeholder-text" style={{ fontSize: "18px", fontWeight: 600, marginTop: "16px" }}>Demo Video Player</p>
                      <p className="video-placeholder-subtext" style={{ fontSize: "14px", color: "#888", maxWidth: "400px" }}>Production video security and storage will be connected after MCC requirements are finalized.</p>
                    </div>
                    <div className="video-controls" aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", background: "linear-gradient(transparent, rgba(0,0,0,.9))", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div className="video-progress" style={{ cursor: "pointer" }}>
                        <div className="video-progress-bar" style={{ height: "4px", background: "rgba(255,255,255,.3)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: "0%", height: "100%", background: "var(--mcc-cyan)", borderRadius: "2px", transition: "width 0.1s linear" }} />
                        </div>
                      </div>
                      <div className="video-controls-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Button variant="ghost" size="sm" aria-label="Play"><Play size={18} /></Button>
                          <Button variant="ghost" size="sm" aria-label="Rewind 10s"><SkipBack size={18} /></Button>
                          <Button variant="ghost" size="sm" aria-label="Forward 10s"><SkipForward size={18} /></Button>
                        </div>
                        <div className="video-time" style={{ fontSize: "13px", color: "#ccc", fontVariantNumeric: "tabular-nums" }}>0:00 / {lesson.duration}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Button variant="ghost" size="sm" aria-label="Volume" onClick={() => setVolume(volume > 0 ? 0 : 1)}>
                            {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
                          </Button>
                          <Button variant="ghost" size="sm" aria-label="Playback speed" onClick={() => setShowSettings(!showSettings)}>
                            <Settings size={18} />
                          </Button>
                          <Button variant="ghost" size="sm" aria-label="Fullscreen"><span style={{ fontSize: "12px", fontWeight: 700 }}>⛶</span></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="video-info" style={{ marginTop: "24px" }}>
                <div className="video-meta" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px", fontSize: "13px", color: "var(--mcc-text-light)" }}>
                  <span><Badge variant="blue">Lesson {lessonNumber} of {totalLessons}</Badge></span>
                  <span><Badge variant="demo">{course.title}</Badge></span>
                </div>
                <h1 className="display-sm" style={{ marginBottom: "12px" }}>{lesson.title}</h1>
                <p className="body-lg" style={{ color: "var(--mcc-text-muted)", maxWidth: "800px" }}>This demo lesson introduces the course and sets expectations for a lightweight, practical learning experience. In production, this would be replaced with actual video content, transcripts, and interactive resources.</p>

                <div className="video-resources" style={{ marginTop: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Button variant="secondary" size="sm"><span>Lesson Resources</span></Button>
                  <Button variant="secondary" size="sm"><span>Transcript</span></Button>
                  <Button variant="secondary" size="sm"><span>Notes</span></Button>
                  <Button variant="secondary" size="sm"><span>Discussion</span></Button>
                </div>

                <div className="notice notice-info" style={{ marginTop: "24px" }}>
                  <strong>Demo Mode:</strong> Video playback, progress tracking, and resources are simulated. Production implementation will connect to MCC's video infrastructure.
                </div>

                <div className="video-navigation" style={{ display: "flex", gap: "12px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--mcc-line)" }}>
                  <Button variant="secondary" asChild disabled={!prevLesson} style={{ minWidth: "160px" }}>
                    <Link href={prevLesson ? `/courses/${slug}/lessons/${prevLesson.slug}` : "#"}>
                      <ArrowLeft size={16} /> Previous Lesson
                    </Link>
                  </Button>
                  <TextLink href={`/courses/${slug}`} variant="muted" style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                    <ArrowLeft size={14} /> Back to Course
                  </TextLink>
                  <Button variant="primary" asChild disabled={!nextLesson} style={{ minWidth: "160px", marginLeft: "auto" }}>
                    <Link href={nextLesson ? `/courses/${slug}/lessons/${nextLesson.slug}` : "#"}>
                      Next Lesson <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <aside className="video-sidebar" aria-labelledby="course-contents-title">
              <Card variant="default" className="sidebar-card" style={{ position: "sticky", top: "90px" }}>
                <CardContent style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--mcc-line)" }}>
                    <h3 id="course-contents-title" style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>Course Contents</h3>
                    <Badge variant="blue">{totalLessons} Lessons</Badge>
                  </div>
                  <nav className="lesson-nav" aria-label="Lesson navigation">
                    {lessonsData.map((l, i) => {
                      const isCurrent = i === lessonIndex;
                      const isCompleted = i < lessonIndex;
                      return (
                        <CardLink
                          key={l.slug}
                          href={`/courses/${slug}/lessons/${l.slug}`}
                          className={`lesson-nav-item ${isCurrent ? "current" : ""} ${isCompleted ? "completed" : ""}`}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            padding: "12px",
                            borderRadius: "var(--radius-sm)",
                            marginBottom: "8px",
                            background: isCurrent ? "var(--mcc-blue)" : isCompleted ? "var(--mcc-paper)" : "transparent",
                            color: isCurrent ? "var(--mcc-white)" : "inherit",
                            border: "1px solid transparent",
                            transition: "all var(--transition-fast)",
                          }}
                        >
                          <span className="lesson-nav-number" style={{
                            flexShrink: 0,
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            background: isCurrent ? "var(--mcc-white)" : isCompleted ? "var(--mcc-blue)" : "var(--mcc-line)",
                            color: isCurrent ? "var(--mcc-blue)" : isCompleted ? "var(--mcc-white)" : "var(--mcc-text-light)",
                          }}>
                            {isCompleted ? <CheckCircle size={14} /> : (i + 1).toString().padStart(2, "0")}
                          </span>
                          <div className="lesson-nav-info" style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</h4>
                            <span style={{ fontSize: "12px", color: isCurrent ? "rgba(255,255,255,0.7)" : isCompleted ? "var(--mcc-blue)" : "var(--mcc-text-light)" }}>{l.duration} · {l.type}</span>
                          </div>
                        </CardLink>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="feedback-title">
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 id="feedback-title" className="heading-md" style={{ marginBottom: "24px" }}>Feedback on This Lesson</h2>
          <div className="notice notice-info" style={{ marginBottom: "24px" }}>
            <strong>Demo Mode:</strong> Feedback infrastructure will be connected after MCC requirements are finalized.
          </div>
          <form className="feedback-form" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <fieldset>
              <legend style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>How useful was this lesson?</legend>
              <div className="rating-row" style={{ display: "flex", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Button key={n} variant="ghost" size="sm" style={{ flex: 1, minHeight: "44px" }}>{n}</Button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>What did you like?</legend>
              <textarea className="textarea" rows={3} placeholder="What worked well?" style={{ width: "100%", padding: "12px", border: "1px solid var(--mcc-line)", borderRadius: "var(--radius-sm)", fontSize: "14px", fontFamily: "inherit", resize: "vertical" }} />
            </fieldset>
            <fieldset>
              <legend style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>What could improve?</legend>
              <textarea className="textarea" rows={3} placeholder="What would make this better?" style={{ width: "100%", padding: "12px", border: "1px solid var(--mcc-line)", borderRadius: "var(--radius-sm)", fontSize: "14px", fontFamily: "inherit", resize: "vertical" }} />
            </fieldset>
            <Button variant="primary" type="submit" style={{ alignSelf: "flex-start" }}>
              Submit Feedback <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}