import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BookOpen, Code2, Cloud, ShieldCheck,
  Users, Rocket, Lightbulb, CalendarDays, Trophy, Sparkles, Play,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { tracksData, coursesData, eventsData, projectsData, opportunitiesData, formatDate } from "@/lib/data";
import { LearningTabs } from "@/components/home/LearningTabs";

const trackIcons = { BookOpen, Code2, Cloud, ShieldCheck } as const;

export default function HomePage() {
  const featuredCourse = coursesData.find((c) => c.featured) ?? coursesData[0];
  const featuredProject = projectsData.find((p) => p.featured) ?? projectsData[0];
  const featuredEvent = eventsData.find((e) => e.featured) ?? eventsData[0];
  const upcomingEvents = eventsData.filter((e) => e.slug !== featuredEvent.slug);
  const stats = [
    { value: "33+", label: "Courses & lessons" },
    { value: "4", label: "Learning tracks" },
    { value: "12+", label: "Events per semester" },
    { value: "40+", label: "Student builders" },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hp-hero" aria-labelledby="hero-title">
        <div className="hp-hero-bg" aria-hidden="true">
          <span className="hp-orb hp-orb-blue" />
          <span className="hp-orb hp-orb-cyan" />
          <span className="hp-orb hp-orb-purple" />
          <span className="hp-grid-lines" />
        </div>

        <div className="container hp-hero-inner">
          <div className="hp-hero-copy">
            <span className="hp-eyebrow">
              <Sparkles size={14} /> MCC MNU · Microsoft Campus Club
            </span>
            <h1 id="hero-title" className="hp-hero-title">
              Learn. Build.
              <br />
              <span className="hp-hero-gradient">Connect.</span>
            </h1>
            <p className="hp-hero-lede">
              Technology learning, student projects, events and opportunities — everything the
              MCC MNU community needs, in one vibrant place.
            </p>
            <div className="hp-hero-actions">
              <Button variant="primary" asChild size="lg">
                <Link href="/courses">Explore learning <ArrowRight size={18} /></Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/join">Join MCC <ArrowUpRight size={18} /></Link>
              </Button>
            </div>
            <div className="hp-hero-chips">
              <span className="hp-chip"><BookOpen size={14} /> 33+ lessons</span>
              <span className="hp-chip"><CalendarDays size={14} /> Weekly events</span>
              <span className="hp-chip"><Users size={14} /> Student community</span>
            </div>
          </div>

          <div className="hp-hero-visual" aria-hidden="true">
            <div className="hp-window hp-window-main">
              <div className="hp-window-bar">
                <i /><i /><i />
                <span>mcc · learning dashboard</span>
              </div>
              <div className="hp-window-body">
                <div className="hp-course-row">
                  <span className="hp-course-icon" style={{ background: "#e3f2fd", color: "#0078d4" }}><BookOpen size={16} /></span>
                  <div>
                    <strong>{featuredCourse.title}</strong>
                    <small>{featuredCourse.level} · {featuredCourse.duration}</small>
                  </div>
                  <span className="hp-progress"><i style={{ width: "72%" }} /></span>
                </div>
                <div className="hp-course-row">
                  <span className="hp-course-icon" style={{ background: "#e0f7fa", color: "#00b7c3" }}><Code2 size={16} /></span>
                  <div>
                    <strong>Modern Web Builder</strong>
                    <small>Intermediate · 3h 15m</small>
                  </div>
                  <span className="hp-progress"><i style={{ width: "45%" }} /></span>
                </div>
                <div className="hp-course-row">
                  <span className="hp-course-icon" style={{ background: "#f3e8ff", color: "#8c52ff" }}><Cloud size={16} /></span>
                  <div>
                    <strong>Cloud Concepts, Clearly</strong>
                    <small>Beginner · 2h 05m</small>
                  </div>
                  <span className="hp-progress"><i style={{ width: "20%" }} /></span>
                </div>
                <div className="hp-window-stats">
                  <div><strong>7</strong><small>Day streak</small></div>
                  <div><strong>12</strong><small>Lessons done</small></div>
                  <div><strong>3</strong><small>Projects</small></div>
                </div>
              </div>
            </div>

            <div className="hp-float hp-float-event">
              <span className="hp-float-label">NEXT EVENT</span>
              <strong>{featuredEvent.title.split(":")[0]}</strong>
              <small>{formatDate(featuredEvent.date).day} {formatDate(featuredEvent.date).month} · {featuredEvent.time}</small>
            </div>

            <div className="hp-float hp-float-badge">
              <span className="hp-float-ring"><Play size={18} fill="currentColor" /></span>
              <div>
                <strong>Live workshops</strong>
                <small>Build nights & meetups</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="hp-stats" aria-label="MCC in numbers">
        <div className="container hp-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="hp-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== LEARNING TABS ===== */}
      <section className="hp-learning" aria-labelledby="learning-title">
        <div className="container">
          <div className="hp-section-head">
            <div>
              <span className="hp-section-kicker">LEARN</span>
              <h2 id="learning-title" className="hp-section-title">Go from curious to capable.</h2>
              <p className="hp-section-lede">
                Focused lessons, guided tracks and hands-on events — switch between them below.
              </p>
            </div>
          </div>
          <LearningTabs />
        </div>
      </section>

      {/* ===== TRACKS ===== */}
      <section className="hp-tracks" aria-labelledby="tracks-title">
        <div className="container">
          <div className="hp-section-head">
            <div>
              <span className="hp-section-kicker">TRACKS</span>
              <h2 id="tracks-title" className="hp-section-title">Choose a direction.</h2>
            </div>
            <Link href="/tracks" className="hp-section-link">All tracks <ArrowRight size={15} /></Link>
          </div>
          <div className="hp-track-grid" role="list">
            {tracksData.map((track, i) => {
              const Icon = trackIcons[track.icon as keyof typeof trackIcons] ?? BookOpen;
              return (
                <Link key={track.slug} href={`/tracks/${track.slug}`} className="hp-track-card" role="listitem" style={{ "--track-color": track.color } as React.CSSProperties}>
                  <div className="hp-track-top">
                    <span className="hp-track-icon"><Icon size={24} /></span>
                    <span className="hp-track-number">0{i + 1}</span>
                  </div>
                  <h3>{track.title}</h3>
                  <p>{track.description}</p>
                  <div className="hp-track-meta">
                    <span>{track.coursesCount} courses</span>
                    <span aria-hidden="true">·</span>
                    <span>{track.duration}</span>
                    <span className="hp-track-arrow"><ArrowRight size={16} /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECT (dark band) ===== */}
      <section className="hp-projects" aria-labelledby="projects-title">
        <div className="container">
          <div className="hp-section-head hp-section-head-dark">
            <div>
              <span className="hp-section-kicker">BUILD</span>
              <h2 id="projects-title" className="hp-section-title">Build something real.</h2>
            </div>
            <Link href="/projects" className="hp-section-link hp-section-link-light">View projects <ArrowRight size={15} /></Link>
          </div>

          <div className="hp-project-feature">
            <div className="hp-project-visual" aria-hidden="true" style={{ "--track-color": featuredProject.color } as React.CSSProperties}>
              <div className="hp-project-window">
                <div className="hp-window-bar">
                  <i /><i /><i />
                  <span>{featuredProject.slug}.mcc</span>
                </div>
                <div className="hp-project-screen">
                  <span className="hp-project-cat">{featuredProject.category}</span>
                  <strong>{featuredProject.title}</strong>
                  <div className="hp-project-code">
                    <span>detect</span>(frame, model=<em>"yolov8"</em>)
                    <br />
                    <span>annotate</span>(results, <em>conf=0.<b>75</b></em>)
                  </div>
                  <div className="hp-project-tags">
                    {featuredProject.technologies.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="hp-project-copy">
              <Badge variant="featured">FEATURED PROJECT</Badge>
              <h3 className="hp-project-title">{featuredProject.title}</h3>
              <p>{featuredProject.description}</p>
              <Link href={`/projects/${featuredProject.slug}`} className="hp-cta-link hp-cta-link-light">
                View project <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="hp-project-grid" role="list">
            {projectsData.filter((p) => p.slug !== featuredProject.slug).map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="hp-project-card" role="listitem">
                <span className="hp-project-card-cat">{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="hp-project-card-tech">
                  {project.technologies.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                </div>
              </Link>
            ))}
            <Link href="/projects" className="hp-project-card hp-project-card-all" role="listitem">
              <Rocket size={22} />
              <h3>All projects</h3>
              <p>View the complete showcase of student work.</p>
              <ArrowUpRight size={18} className="hp-project-card-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EVENTS ===== */}
      <section className="hp-events" aria-labelledby="events-title">
        <div className="container">
          <div className="hp-section-head">
            <div>
              <span className="hp-section-kicker">CONNECT</span>
              <h2 id="events-title" className="hp-section-title">Meet. Make. Share.</h2>
            </div>
            <Link href="/events" className="hp-section-link">All events <ArrowRight size={15} /></Link>
          </div>

          <div className="hp-events-layout">
            <Link href={`/events/${featuredEvent.slug}`} className="hp-event-featured">
              <div className="hp-event-date-tile" aria-hidden="true">
                <strong>{formatDate(featuredEvent.date).day}</strong>
                <span>{formatDate(featuredEvent.date).month}</span>
              </div>
              <div className="hp-event-featured-copy">
                <Badge variant="cyan">FEATURED · {featuredEvent.category.toUpperCase()}</Badge>
                <h3>{featuredEvent.title}</h3>
                <p>{featuredEvent.description}</p>
                <div className="hp-event-meta">
                  <CalendarDays size={15} /> {featuredEvent.location} · {featuredEvent.time}
                </div>
                <span className="hp-cta-link">View event <ArrowRight size={16} /></span>
              </div>
            </Link>

            <div className="hp-event-list" role="list">
              {upcomingEvents.map((event) => {
                const d = formatDate(event.date);
                return (
                  <Link key={event.slug} href={`/events/${event.slug}`} className="hp-event-row" role="listitem">
                    <span className="hp-event-row-date">
                      <strong>{d.day}</strong>
                      <small>{d.month}</small>
                    </span>
                    <div className="hp-event-row-copy">
                      <span className="hp-event-row-cat">{event.category}</span>
                      <strong>{event.title}</strong>
                      <small>{event.location} · {event.time}</small>
                    </div>
                    <ArrowRight size={16} className="hp-event-row-arrow" />
                  </Link>
                );
              })}
              <Link href="/events" className="hp-event-row hp-event-row-all" role="listitem">
                <span className="hp-event-row-date hp-event-row-date-all"><CalendarDays size={18} /></span>
                <div className="hp-event-row-copy">
                  <strong>Browse all events</strong>
                  <small>Workshops, meetups and build nights</small>
                </div>
                <ArrowRight size={16} className="hp-event-row-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OPPORTUNITIES ===== */}
      <section className="hp-opps" aria-labelledby="opps-title">
        <div className="container">
          <div className="hp-section-head">
            <div>
              <span className="hp-section-kicker">OPPORTUNITIES</span>
              <h2 id="opps-title" className="hp-section-title">What&apos;s next?</h2>
            </div>
            <Link href="/opportunities" className="hp-section-link">Explore opportunities <ArrowRight size={15} /></Link>
          </div>
          <div className="hp-opp-grid" role="list">
            {opportunitiesData.map((opp) => (
              <Link key={opp.slug} href="/opportunities" className="hp-opp-card" role="listitem" style={{ "--track-color": opp.color } as React.CSSProperties}>
                <span className="hp-opp-type">{opp.type}</span>
                <h3>{opp.title}</h3>
                <p>{opp.description}</p>
                <div className="hp-opp-meta">
                  <Trophy size={15} />
                  <span>Deadline {formatDate(opp.deadline).day} {formatDate(opp.deadline).month}</span>
                  <ArrowUpRight size={15} className="hp-opp-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PILLARS ===== */}
      <section className="hp-pillars" aria-labelledby="pillars-title">
        <div className="container">
          <h2 id="pillars-title" className="visually-hidden">The MCC experience</h2>
          <div className="hp-pillar-grid">
            <div className="hp-pillar">
              <span className="hp-pillar-icon hp-pillar-icon-blue"><BookOpen size={22} /></span>
              <h3>Learn</h3>
              <p>Courses, tracks and resources that take you from first principles to working knowledge.</p>
              <Link href="/courses">Start learning <ArrowRight size={14} /></Link>
            </div>
            <div className="hp-pillar">
              <span className="hp-pillar-icon hp-pillar-icon-cyan"><Lightbulb size={22} /></span>
              <h3>Build</h3>
              <p>Ship real projects with a team, from computer vision to full-stack campus products.</p>
              <Link href="/projects">See projects <ArrowRight size={14} /></Link>
            </div>
            <div className="hp-pillar">
              <span className="hp-pillar-icon hp-pillar-icon-purple"><Users size={22} /></span>
              <h3>Connect</h3>
              <p>Events, workshops and a community of students who care about technology.</p>
              <Link href="/events">Meet the community <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
