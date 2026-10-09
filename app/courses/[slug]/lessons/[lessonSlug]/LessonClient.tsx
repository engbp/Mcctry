"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, CheckCircle, ChevronRight, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { lessonsData } from "@/lib/data";

interface LessonClientProps {
  course: { slug: string; track: string; title: string };
  lesson: { slug: string; title: string; duration: string; type: string };
  lessonIndex: number;
  lessonNumber: number;
  totalLessons: number;
  prevLesson: { slug: string; title: string; duration: string; type: string } | null;
  nextLesson: { slug: string; title: string; duration: string; type: string } | null;
  slug: string;
}

function parseDuration(d: string): number {
  const [m, s] = d.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

function formatTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const speeds = [0.75, 1, 1.25, 1.5, 2];

export function LessonClient({
  course, lesson, lessonIndex, lessonNumber, totalLessons, prevLesson, nextLesson, slug,
}: LessonClientProps) {
  const duration = parseDuration(lesson.duration);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlaying(false);
    setTime(0);
    setCompleted(false);
    setRating(null);
    setSubmitted(false);
  }, [lesson.slug]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTime((t) => {
        const next = t + speed;
        if (next >= duration) {
          setPlaying(false);
          return duration;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, speed, duration]);

  const seek = useCallback((clientX: number) => {
    const el = progressRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setTime(ratio * duration);
  }, [duration]);

  const skip = (delta: number) => setTime((t) => Math.min(duration, Math.max(0, t + delta)));
  const progress = duration ? (time / duration) * 100 : 0;
  const done = time >= duration;

  return (
    <>
      <header className="lesson-topbar">
        <div className="container lesson-topbar-inner">
          <Link href={`/courses/${slug}`} className="lesson-back">
            <ArrowLeft size={16} /> {course.title}
          </Link>
          <span className="lesson-topbar-progress">
            Lesson {lessonNumber} of {totalLessons}
            <span className="lesson-topbar-bar"><i style={{ width: `${((lessonIndex + (completed ? 1 : 0)) / totalLessons) * 100}%` }} /></span>
          </span>
        </div>
      </header>

      <section className="section lesson-section" aria-labelledby="video-title">
        <div className="container lesson-layout">
          <div className="lesson-main">
            <div className={`lesson-player ${playing ? "lesson-player-playing" : ""}`}>
              <button
                className="lesson-player-screen"
                aria-label={playing ? "Pause video" : "Play video"}
                onClick={() => setPlaying((p) => !p)}
              >
                <span className="lesson-player-bg" aria-hidden="true" />
                <span className="lesson-player-title" aria-hidden="true">
                  <Badge variant="demo">DEMO VIDEO</Badge>
                  <strong>{lesson.title}</strong>
                </span>
                <span className="lesson-player-bigplay" aria-hidden="true">
                  {playing ? <Pause size={34} fill="currentColor" /> : <Play size={34} fill="currentColor" />}
                </span>
                {done && <span className="lesson-player-done"><CheckCircle size={48} /> Lesson complete</span>}
              </button>

              <div className="lesson-controls">
                <div
                  className="lesson-progress"
                  ref={progressRef}
                  role="slider"
                  tabIndex={0}
                  aria-label="Video progress"
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  aria-valuenow={Math.floor(time)}
                  onClick={(e) => seek(e.clientX)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") skip(5);
                    if (e.key === "ArrowLeft") skip(-5);
                  }}
                >
                  <div className="lesson-progress-fill" style={{ width: `${progress}%` }}>
                    <span className="lesson-progress-knob" />
                  </div>
                </div>

                <div className="lesson-controls-row">
                  <div className="lesson-controls-group">
                    <button className="lesson-ctl" aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}>
                      {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                    </button>
                    <button className="lesson-ctl" aria-label="Back 10 seconds" onClick={() => skip(-10)}>
                      <SkipBack size={17} />
                    </button>
                    <button className="lesson-ctl" aria-label="Forward 10 seconds" onClick={() => skip(10)}>
                      <SkipForward size={17} />
                    </button>
                    <span className="lesson-time">{formatTime(time)} / {lesson.duration}</span>
                  </div>

                  <div className="lesson-controls-group">
                    <button className="lesson-ctl" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)}>
                      {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                    </button>
                    <button
                      className="lesson-ctl lesson-ctl-speed"
                      aria-label={`Playback speed ${speed}x`}
                      onClick={() => setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length])}
                    >
                      {speed}×
                    </button>
                    <button
                      className={`lesson-ctl lesson-ctl-done ${completed || done ? "is-done" : ""}`}
                      aria-pressed={completed || done}
                      onClick={() => setCompleted((c) => !c)}
                    >
                      <CheckCircle size={17} /> {completed || done ? "Completed" : "Mark done"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lesson-info">
              <div className="lesson-info-meta">
                <Badge variant="blue">Lesson {lessonNumber} of {totalLessons}</Badge>
                <Badge variant="demo">{course.title}</Badge>
                <span className="lesson-info-duration">{lesson.duration} · {lesson.type}</span>
              </div>
              <h1 id="video-title">{lesson.title}</h1>
              <p>
                This demo lesson introduces the course and sets expectations for a lightweight,
                practical learning experience. In production, this would be replaced with actual
                video content, transcripts, and interactive resources.
              </p>

              <div className="notice notice-info">
                <strong>Demo mode:</strong> Video playback, progress tracking, and resources are simulated. Production implementation will connect to MCC&apos;s video infrastructure.
              </div>

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
            </div>

            <div className="lesson-feedback">
              <h2><MessageSquare size={19} /> Feedback on this lesson</h2>
              {submitted ? (
                <p className="lesson-feedback-thanks">
                  <CheckCircle size={17} /> Thanks — your feedback was recorded locally (demo).
                </p>
              ) : (
                <form
                  className="lesson-feedback-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <fieldset>
                    <legend>How useful was this lesson?</legend>
                    <div className="lesson-rating" role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          role="radio"
                          aria-checked={rating === n}
                          className={`lesson-rating-btn ${rating === n ? "is-active" : ""}`}
                          onClick={() => setRating(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label className="lesson-feedback-label">
                    Anything to improve? <span>(optional)</span>
                    <textarea rows={3} placeholder="What would make this better?" />
                  </label>
                  <Button variant="primary" type="submit" disabled={rating === null}>
                    Submit feedback <ArrowRight size={16} />
                  </Button>
                </form>
              )}
            </div>
          </div>

          <aside className="lesson-sidebar" aria-labelledby="course-contents-title">
            <div className="lesson-side-head">
              <h3 id="course-contents-title">Course contents</h3>
              <Badge variant="blue">{totalLessons}</Badge>
            </div>
            <nav className="lesson-side-nav" aria-label="Lesson navigation">
              {lessonsData.map((l, i) => {
                const isCurrent = i === lessonIndex;
                const isCompleted = i < lessonIndex;
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
