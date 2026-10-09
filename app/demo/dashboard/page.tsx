import Link from "next/link";
import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, BookOpen, Clock, CheckCircle, CalendarDays, Users, TrendingUp, Target, ChevronRight, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { coursesData, lessonsData, eventsData } from "@/lib/data";

export default function DashboardPage() {
  const currentCourse = coursesData[0];
  const currentLesson = lessonsData[0];
  const nextLesson = lessonsData[1];
  const upcomingEvent = eventsData[0];
  const completedLessons = 2;
  const totalLessons = lessonsData.length;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  const streakDays = 7;

  return (
    <>
      <PageHero
        label="Demo Dashboard"
        title="Welcome back."
        lede="Continue learning, see what's next, and pick up where you left off. This is a demo student experience — no real authentication."
        badge="DEMO MODE"
        badgeVariant="demo"
        kicker="01 / DASHBOARD"
      />

      <section className="section" aria-labelledby="overview-title">
        <div className="container">
          <SectionHeader number="01" label="OVERVIEW" title="Your learning snapshot." />
          <div className="grid-4" role="list" style={{ marginTop: "32px" }}>
            <Card variant="default" className="stat-card" role="listitem">
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>COURSES STARTED</span>
                  <div className="stat-icon" aria-hidden="true" style={{ width: "40px", height: "40px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)" }}>
                    <BookOpen size={20} />
                  </div>
                </div>
                <strong style={{ fontSize: "36px", fontWeight: 700, display: "block", lineHeight: 1 }}>3</strong>
                <p className="body-sm" style={{ color: "var(--mcc-text-muted)", marginTop: "4px" }}>Active tracks</p>
              </CardContent>
            </Card>
            <Card variant="default" className="stat-card" role="listitem">
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>LESSONS COMPLETED</span>
                  <div className="stat-icon" aria-hidden="true" style={{ width: "40px", height: "40px", background: "var(--mcc-accent-green)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)" }}>
                    <CheckCircle size={20} />
                  </div>
                </div>
                <strong style={{ fontSize: "36px", fontWeight: 700, display: "block", lineHeight: 1 }}>{completedLessons}</strong>
                <p className="body-sm" style={{ color: "var(--mcc-text-muted)", marginTop: "4px" }}>of {totalLessons} in current course</p>
              </CardContent>
            </Card>
            <Card variant="default" className="stat-card" role="listitem">
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>LEARNING STREAK</span>
                  <div className="stat-icon" aria-hidden="true" style={{ width: "40px", height: "40px", background: "var(--mcc-accent-yellow)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>
                    <TrendingUp size={20} />
                  </div>
                </div>
                <strong style={{ fontSize: "36px", fontWeight: 700, display: "block", lineHeight: 1 }}>{streakDays}</strong>
                <p className="body-sm" style={{ color: "var(--mcc-text-muted)", marginTop: "4px" }}>Days in a row</p>
              </CardContent>
            </Card>
            <Card variant="default" className="stat-card" role="listitem">
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>TOTAL LEARNING TIME</span>
                  <div className="stat-icon" aria-hidden="true" style={{ width: "40px", height: "40px", background: "var(--mcc-cyan)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "#03121f" }}>
                    <Clock size={20} />
                  </div>
                </div>
                <strong style={{ fontSize: "36px", fontWeight: 700, display: "block", lineHeight: 1 }}>1h 24m</strong>
                <p className="body-sm" style={{ color: "var(--mcc-text-muted)", marginTop: "4px" }}>This week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="continue-title">
        <div className="container">
          <SectionHeader number="02" label="CONTINUE LEARNING" title="Pick up where you left off." action={<TextLink href="/courses">Browse all courses</TextLink>} />
          <div className="grid-2-uneven" style={{ gap: "24px", marginTop: "32px" }}>
            <CardLink href={`/courses/${currentCourse.slug}/lessons/${currentLesson.slug}`} className="continue-card" style={{ background: "var(--mcc-navy-2)", color: "var(--mcc-white)", borderColor: "var(--mcc-line-dark)", minHeight: "280px", display: "flex", flexDirection: "column" }}>
              <CardContent style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "24px" }}>
                <div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <Badge variant="cyan">{currentCourse.track}</Badge>
                    <Badge variant="demo">Demo Course</Badge>
                  </div>
                  <h2 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "8px" }}>{currentCourse.title}</h2>
                  <p className="body" style={{ color: "#91b3c5" }}>{currentCourse.description}</p>
                </div>
                <div style={{ marginTop: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#91b3c5" }}>
                    <span>Lesson {completedLessons + 1} of {totalLessons}</span>
                    <span>{progressPercent}% complete</span>
                  </div>
                  <div style={{ height: "6px", background: "#213748", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progressPercent}%`, background: "var(--mcc-cyan)", borderRadius: "3px", transition: "width var(--transition-slow)" }} />
                  </div>
                  <p className="body-sm" style={{ color: "#91b3c5", marginTop: "12px" }}>Next: {nextLesson?.title} ({nextLesson?.duration})</p>
                </div>
              </CardContent>
            </CardLink>

            <Card variant="default" className="next-up-card" style={{ display: "flex", flexDirection: "column" }}>
              <CardContent style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>NEXT LESSON</span>
                  <Badge variant="blue">Ready to Start</Badge>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ marginBottom: "8px" }}>{nextLesson?.title}</h3>
                  <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>{nextLesson?.duration} · Video lesson</p>
                </div>
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                  <span style={{ fontSize: "13px", color: "var(--mcc-text-light)" }}><Clock size={14} /> {nextLesson?.duration}</span>
                  <span style={{ fontSize: "13px", color: "var(--mcc-text-light)" }}>Lesson {completedLessons + 1} of {totalLessons}</span>
                </div>
                <Button variant="primary" asChild style={{ marginTop: "auto" }}>
                  <Link href={`/courses/${currentCourse.slug}/lessons/${nextLesson?.slug}`}>Start Lesson <ArrowRight size={16} /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="upcoming-title">
        <div className="container">
          <SectionHeader number="03" label="UPCOMING EVENT" title="Don't miss out." action={<TextLink href="/events">View all events</TextLink>} />
          <div className="grid-2-uneven" style={{ gap: "24px", marginTop: "32px" }}>
            <Card variant="default" className="event-dashboard-card" style={{ minHeight: "280px" }}>
              <CardContent style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ background: "var(--mcc-blue)", color: "var(--mcc-white)", padding: "16px", borderRadius: "var(--radius-sm)", textAlign: "center", minWidth: "70px" }}>
                    <strong style={{ fontSize: "28px", lineHeight: 1, display: "block" }}>{formatDate(upcomingEvent.date).day}</strong>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{formatDate(upcomingEvent.date).month}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <Badge variant="blue">{upcomingEvent.category}</Badge>
                      <Badge variant="demo">Demo Event</Badge>
                    </div>
                    <h3 style={{ marginBottom: "4px" }}>{upcomingEvent.title}</h3>
                    <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>{upcomingEvent.description}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "20px", fontSize: "13px", color: "var(--mcc-text-light)" }}>
                  <span><CalendarDays size={14} /> {formatDate(upcomingEvent.date).day} {formatDate(upcomingEvent.date).month} {formatDate(upcomingEvent.date).year}</span>
                  <span><Clock size={14} /> {upcomingEvent.time}</span>
                  <span><MapPin size={14} /> {upcomingEvent.location}</span>
                </div>
                <Button variant="primary" asChild style={{ marginTop: "auto" }}>
                  <Link href={`/events/${upcomingEvent.slug}`}>View Event Details <ArrowRight size={16} /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card variant="default" className="recommendations-card">
              <CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>RECOMMENDED FOR YOU</span>
                  <TextLink href="/courses" variant="muted">View all</TextLink>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {coursesData.slice(1, 4).map((course) => (
                    <CardLink key={course.slug} href={`/courses/${course.slug}`} className="rec-course" style={{ display: "flex", gap: "12px", padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--mcc-paper)", border: "1px solid var(--mcc-line)" }}>
                      <div style={{ width: "48px", height: "48px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)", flexShrink: 0 }}>
                        <BookOpen size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{course.title}</h4>
                        <p className="body-sm" style={{ color: "var(--mcc-text-muted)", margin: 0 }}>{course.lessonsCount} lessons · {course.duration} · {course.level}</p>
                      </div>
                      <ChevronRight size={18} style={{ color: "var(--mcc-blue)" }} />
                    </CardLink>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="goals-title">
        <div className="container" style={{ maxWidth: "800px" }}>
          <SectionHeader number="04" label="LEARNING GOALS" title="Set your direction." />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            {[
              { title: "Complete AI Foundations", target: "Finish all 8 lessons", progress: 25, icon: Target },
              { title: "Build First Portfolio Project", target: "Deploy a complete project", progress: 10, icon: TrendingUp },
              { title: "Attend 3 Events This Semester", target: "Network & learn", progress: 33, icon: Users },
            ].map((goal, i) => (
              <Card key={i} variant="default" className="goal-card" role="listitem">
                <CardContent>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div className="goal-icon" aria-hidden="true" style={{ width: "40px", height: "40px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)" }}>
                      <goal.icon size={20} />
                    </div>
                    <Badge variant="blue">{goal.progress}%</Badge>
                  </div>
                  <h3>{goal.title}</h3>
                  <p className="body-sm" style={{ color: "var(--mcc-text-muted)", marginTop: "4px", marginBottom: "16px" }}>{goal.target}</p>
                  <div style={{ height: "6px", background: "var(--mcc-line)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${goal.progress}%`, background: "var(--mcc-blue)", borderRadius: "3px" }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-navy)", color: "var(--mcc-white)" }} aria-labelledby="demo-notice-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <div style={{ border: "1px solid #213748", borderRadius: "var(--radius-md)", padding: "32px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ color: "var(--mcc-accent-yellow)", marginBottom: "16px" }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <h2 id="demo-notice-title" style={{ marginBottom: "12px" }}>Demo Dashboard Notice</h2>
            <p className="body-lg" style={{ color: "#d9e5ed", marginBottom: "24px" }}>This is a presentation prototype. No real authentication, data persistence, or progress tracking is implemented. All data is mock/demo content.</p>
            <TextLink href="/join" variant="light" style={{ fontSize: "16px" }}>
              Join MCC for Real <ArrowRight size={18} />
            </TextLink>
          </div>
        </div>
      </section>
    </>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleString("en-US", { month: "short" }),
    year: date.getFullYear().toString(),
  };
}