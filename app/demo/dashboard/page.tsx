"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, BookOpen, CalendarDays, CheckCircle, ChevronRight,
  Clock, Flame, MapPin, Sparkles, Target, TrendingUp, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BandHero } from "@/components/layout/BandHero";
import { coursesData, lessonsData, eventsData, formatDate } from "@/lib/data";

const currentCourse = coursesData[0];
const upcomingEvent = eventsData[0];

const initialGoals = [
  { id: "ai", title: "Complete AI Foundations", target: "Finish all 8 lessons", progress: 25, color: "#0078d4" },
  { id: "portfolio", title: "Build first portfolio project", target: "Deploy a complete project", progress: 10, color: "#8c52ff" },
  { id: "events", title: "Attend 3 events this semester", target: "Network & learn", progress: 33, color: "#10b981" },
];

const recommendations = coursesData.slice(1, 4);

export default function DashboardPage() {
  const [done, setDone] = useState<string[]>(["introduction", "thinking-in-models"]);
  const [goals, setGoals] = useState(initialGoals);
  const [noticeVisible, setNoticeVisible] = useState(true);

  const completedCount = done.length;
  const totalLessons = lessonsData.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);
  const nextLesson = useMemo(
    () => lessonsData.find((l) => !done.includes(l.slug)),
    [done]
  );

  const toggleLesson = (slug: string) => {
    setDone((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const logSession = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, progress: Math.min(100, g.progress + 10) } : g))
    );
  };

  const eventDate = formatDate(upcomingEvent.date);

  return (
    <>
      <BandHero
        crumbs={[{ label: "Demo Dashboard" }]}
        kicker="CONNECT · STUDENT VIEW"
        title="Welcome back, demo learner."
        lede="Continue learning, see what's next, and pick up where you left off. This is a demo student experience — no real authentication or persistence."
        color="#5c2d91"
        meta={
          <>
            <span className="band-meta-pill"><Flame size={14} /> 7-day streak</span>
            <span className="band-meta-pill"><BookOpen size={14} /> {progressPercent}% complete</span>
          </>
        }
        icon={<Sparkles size={56} />}
      />

      {noticeVisible && (
        <div className="db-notice" role="status">
          <div className="container db-notice-inner">
            <span>
              <strong>Demo mode:</strong> No real authentication, data persistence, or progress
              tracking — everything below is mock content you can interact with.
            </span>
            <button type="button" onClick={() => setNoticeVisible(false)} aria-label="Dismiss demo notice">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <section className="section" aria-labelledby="overview-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">OVERVIEW</span>
              <h2 id="overview-title" className="hp-section-title">Your learning snapshot.</h2>
            </div>
            <Link href="/courses" className="hp-section-link">
              Browse all courses <ArrowRight size={15} />
            </Link>
          </div>

          <div className="db-stats" role="list">
            <div className="db-stat" role="listitem" style={{ "--stat-color": "#0078d4" } as React.CSSProperties}>
              <span className="db-stat-icon"><BookOpen size={20} /></span>
              <strong>3</strong>
              <span className="db-stat-label">Courses started</span>
              <span className="db-stat-sub">Across 3 active tracks</span>
            </div>
            <div className="db-stat" role="listitem" style={{ "--stat-color": "#10b981" } as React.CSSProperties}>
              <span className="db-stat-icon"><CheckCircle size={20} /></span>
              <strong>{completedCount}</strong>
              <span className="db-stat-label">Lessons completed</span>
              <span className="db-stat-sub">of {totalLessons} in current course</span>
            </div>
            <div className="db-stat" role="listitem" style={{ "--stat-color": "#ffb900" } as React.CSSProperties}>
              <span className="db-stat-icon db-stat-icon-dark"><Flame size={20} /></span>
              <strong>7</strong>
              <span className="db-stat-label">Day learning streak</span>
              <span className="db-stat-sub">Days in a row</span>
            </div>
            <div className="db-stat" role="listitem" style={{ "--stat-color": "#00b7c3" } as React.CSSProperties}>
              <span className="db-stat-icon db-stat-icon-dark"><Clock size={20} /></span>
              <strong>1h 24m</strong>
              <span className="db-stat-label">Learning time</span>
              <span className="db-stat-sub">This week</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="continue-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">CONTINUE LEARNING</span>
              <h2 id="continue-title" className="hp-section-title">Pick up where you left off.</h2>
            </div>
          </div>

          <div className="db-grid">
            <Link href={`/courses/${currentCourse.slug}/lessons/${nextLesson?.slug ?? lessonsData[0].slug}`} className="db-continue">
              <div className="db-continue-body">
                <div className="db-continue-badges">
                  <span className="cat-chip cat-chip-active" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
                    {currentCourse.track}
                  </span>
                  <span className="cat-chip" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
                    Demo course
                  </span>
                </div>
                <h3>{currentCourse.title}</h3>
                <p>{currentCourse.description}</p>

                <div className="db-continue-progress">
                  <div className="db-progress-meta">
                    <span>Lesson {Math.min(completedCount + 1, totalLessons)} of {totalLessons}</span>
                    <strong>{progressPercent}% complete</strong>
                  </div>
                  <div className="db-progress-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
                    <div className="db-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="db-continue-next">
                    {nextLesson ? `Next: ${nextLesson.title} (${nextLesson.duration})` : "Course complete — pick a new one!"}
                  </p>
                </div>
              </div>
              <span className="db-continue-cta">
                {nextLesson ? "Continue lesson" : "Browse courses"} <ArrowRight size={17} />
              </span>
            </Link>

            <div className="db-checklist">
              <div className="db-checklist-head">
                <span className="hp-section-kicker">LESSON CHECKLIST</span>
                <span className="db-checklist-count">{completedCount}/{totalLessons}</span>
              </div>
              <ul>
                {lessonsData.map((lesson, i) => {
                  const isDone = done.includes(lesson.slug);
                  return (
                    <li key={lesson.slug} className={isDone ? "is-done" : ""}>
                      <label>
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleLesson(lesson.slug)}
                        />
                        <span className="db-check-box" aria-hidden="true">
                          <CheckCircle size={15} />
                        </span>
                        <span className="db-check-title">
                          <em>{String(i + 1).padStart(2, "0")}</em>
                          {lesson.title}
                        </span>
                        <span className="db-check-duration">{lesson.duration}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <p className="db-checklist-hint">Demo — tick lessons to watch your progress update.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="upcoming-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">UPCOMING EVENT</span>
              <h2 id="upcoming-title" className="hp-section-title">Don&apos;t miss out.</h2>
            </div>
            <Link href="/events" className="hp-section-link">
              View all events <ArrowRight size={15} />
            </Link>
          </div>

          <div className="db-grid db-grid-bottom">
            <div className="db-event">
              <div className="db-event-date" aria-hidden="true">
                <strong>{eventDate.day}</strong>
                <span>{eventDate.month}</span>
              </div>
              <div className="db-event-body">
                <span className="db-event-cat">{upcomingEvent.category}</span>
                <h3>{upcomingEvent.title}</h3>
                <p>{upcomingEvent.description}</p>
                <div className="db-event-meta">
                  <span><CalendarDays size={14} /> {eventDate.full}</span>
                  <span><Clock size={14} /> {upcomingEvent.time}</span>
                  <span><MapPin size={14} /> {upcomingEvent.location}</span>
                </div>
                <Link href={`/events/${upcomingEvent.slug}`} className="db-event-link">
                  View event details <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="db-recs">
              <div className="db-recs-head">
                <span className="hp-section-kicker">RECOMMENDED FOR YOU</span>
                <Link href="/courses">View all</Link>
              </div>
              <ul>
                {recommendations.map((course) => (
                  <li key={course.slug}>
                    <Link href={`/courses/${course.slug}`}>
                      <span className="db-rec-icon" style={{ background: course.color }}>
                        <BookOpen size={18} />
                      </span>
                      <span className="db-rec-body">
                        <strong>{course.title}</strong>
                        <em>{course.lessonsCount} lessons · {course.duration} · {course.level}</em>
                      </span>
                      <ChevronRight size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="goals-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">LEARNING GOALS</span>
              <h2 id="goals-title" className="hp-section-title">Set your direction.</h2>
            </div>
            <span className="db-goals-hint">Demo — log sessions to move the bars.</span>
          </div>

          <div className="db-goals" role="list">
            {goals.map((goal) => (
              <div key={goal.id} className="db-goal" role="listitem" style={{ "--track-color": goal.color } as React.CSSProperties}>
                <div className="db-goal-top">
                  <span className="db-goal-icon">
                    {goal.id === "ai" ? <Target size={19} /> : goal.id === "portfolio" ? <TrendingUp size={19} /> : <Users size={19} />}
                  </span>
                  <span className={`db-goal-badge ${goal.progress >= 100 ? "is-complete" : ""}`}>
                    {goal.progress >= 100 ? "Complete" : `${goal.progress}%`}
                  </span>
                </div>
                <h3>{goal.title}</h3>
                <p>{goal.target}</p>
                <div className="db-goal-bar">
                  <div style={{ width: `${goal.progress}%` }} />
                </div>
                <button
                  type="button"
                  className="db-goal-btn"
                  onClick={() => logSession(goal.id)}
                  disabled={goal.progress >= 100}
                >
                  {goal.progress >= 100 ? "Goal reached" : "Log session +10%"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="demo-notice-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>DEMO NOTICE</span>
            <h2 id="demo-notice-title" className="hp-section-title" style={{ color: "#fff" }}>
              This is a presentation prototype.
            </h2>
            <p>
              No real authentication, data persistence, or progress tracking is implemented.
              All data above is mock/demo content.
            </p>
          </div>
          <Link href="/join" className="lk-cta-btn">
            Join MCC for real <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
