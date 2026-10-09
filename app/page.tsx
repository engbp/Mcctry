import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Cloud, ShieldCheck, Users, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextLink, CardLink } from "@/components/ui/Links";
import { Badge, Kicker } from "@/components/ui/Badge";
import { Card, CardContent, FeatureCard, MediaCard, StatCard } from "@/components/ui/Card";
import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { tracksData, coursesData, eventsData, projectsData, opportunitiesData, formatDate } from "@/lib/data";

export default function HomePage() {
  const featuredCourse = coursesData.find((c) => c.featured);
  const featuredProject = projectsData.find((p) => p.featured);
  const featuredEvent = eventsData.find((e) => e.featured);
  const otherCourses = coursesData.filter((c) => !c.featured).slice(0, 2);
  const otherEvents = eventsData.filter((e) => !e.featured);
  const otherProjects = projectsData.filter((p) => !p.featured);
  const topOpportunities = opportunitiesData.slice(0, 3);

  return (
    <>
      {/* Hero Section - Campaign Style */}
      <section className="mcc-hero" aria-labelledby="hero-title">
        <div className="mcc-hero-copy">
          <Kicker>MCC MNU · MICROSOFT CAMPUS CLUB</Kicker>
          <h1 id="hero-title" className="display-xl">
            Learn.<br />
            <span style={{ color: "var(--mcc-cyan)" }}>Build.</span><br />
            Connect.
          </h1>
          <p className="body-lg" style={{ color: "#d9e5ed", maxWidth: "560px" }}>
            Technology learning, student projects, events and opportunities — presented in one place for the MCC MNU community.
          </p>
          <div className="campaign-actions" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "30px" }}>
            <Button variant="primary" asChild size="lg">
              <Link href="/courses">Explore Learning <ArrowRight size={18} /></Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/join">Join MCC <ArrowRight size={18} /></Link>
            </Button>
          </div>
          <div className="hero-meta" style={{ display: "flex", gap: "20px", flexWrap: "wrap", borderTop: "1px solid #294057", marginTop: "52px", paddingTop: "17px", color: "#8fa5b6", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span style={{ color: "var(--mcc-cyan)", fontWeight: 800 }}>01</span>
            <span>Student Technology Community</span>
            <span>Mansoura National University</span>
          </div>
        </div>
        <div className="mcc-poster" aria-label="MCC MNU technology campaign visual">
          <div className="poster-noise" aria-hidden="true" />
          <div className="poster-photo" aria-hidden="true">
            <div className="poster-person" aria-hidden="true" />
            <div className="poster-laptop" aria-hidden="true">
              <div className="poster-screen">
                <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="poster-cyan-block">
            <span>MCC MNU</span>
            <strong>LEARN<br />BUILD<br />CONNECT</strong>
          </div>
          <div className="poster-copy">
            <span>MICROSOFT CAMPUS CLUB</span>
            <strong>Ideas into<br />working projects.</strong>
          </div>
          <div className="poster-cross poster-cross-a" aria-hidden="true" />
          <div className="poster-cross poster-cross-b" aria-hidden="true" />
          <div className="poster-index">01 / MCC MNU</div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="mcc-intro" aria-labelledby="intro-title">
        <div className="container mcc-intro-grid">
          <div>
            <span className="editorial-mark">01</span>
            <span className="mcc-section-label">THE MCC EXPERIENCE</span>
            <h2 id="intro-title" className="display-md">A technology community with a visual identity of its own.</h2>
          </div>
          <div className="mcc-intro-copy">
            <p className="body-lg">MCC MNU brings learning, building and community together. This presentation prototype turns the energy of MCC's promotional campaigns into a digital experience.</p>
            <TextLink href="/about">Discover MCC</TextLink>
          </div>
        </div>
        <div className="container mcc-strip" style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "78px", borderTop: "1px solid var(--mcc-line)", paddingTop: "17px", fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", color: "#496173" }}>
          <span>LEARN</span><i style={{ width: "5px", height: "5px", background: "var(--mcc-cyan)", borderRadius: "50%" }} aria-hidden="true" />
          <span>BUILD</span><i style={{ width: "5px", height: "5px", background: "var(--mcc-cyan)", borderRadius: "50%" }} aria-hidden="true" />
          <span>CONNECT</span><i style={{ width: "5px", height: "5px", background: "var(--mcc-cyan)", borderRadius: "50%" }} aria-hidden="true" />
          <span>MCC MNU</span>
        </div>
      </section>

      {/* Learning Section */}
      <section className="mcc-learning" aria-labelledby="learning-title">
        <div className="container">
          <SectionHeader number="02" label="LEARNING" title="Go from curious to capable." action={<TextLink href="/courses">View courses</TextLink>} />
          <div className="mcc-learning-feature">
            <div className="mcc-learning-poster">
              <div className="poster-grid" aria-hidden="true" />
              <span>FEATURED COURSE</span>
              <strong>APPLIED<br />AI<br /><em style={{ fontStyle: "normal", color: "var(--mcc-cyan)" }}>FOUNDATIONS</em></strong>
              <small>8 LESSONS · 2H 40M · BEGINNER</small>
              <div className="poster-code">AI / DATA / BUILD</div>
            </div>
            <div className="mcc-learning-copy">
              <Badge variant="blue">DEMO CONTENT</Badge>
              <h3 className="heading-md">Learn through focused lessons, not noise.</h3>
              <p className="body">Short video lessons, useful resources and a clear path from one concept to the next.</p>
              <TextLink href="/courses/applied-ai-foundations">Start learning</TextLink>
            </div>
          </div>
          <div className="mcc-learning-list" role="list">
            {otherCourses.map((course, i) => (
              <CardLink key={course.slug} href={`/courses/${course.slug}`} className="mcc-list-item" role="listitem">
                <span className="list-number">0{i + 2}</span>
                <div>
                  <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#507080" }}>{course.track}</span>
                  <strong style={{ fontSize: "19px", lineHeight: 1.15 }}>{course.title}</strong>
                  <small style={{ fontSize: "12px", color: "#697983" }}>{course.lessonsCount} lessons · {course.duration} · {course.level}</small>
                </div>
                <ArrowRight className="arrow-icon" size={16} style={{ color: "var(--mcc-blue)", marginLeft: "auto", marginTop: "auto" }} />
              </CardLink>
            ))}
            <CardLink href="/tracks" className="mcc-list-item mcc-list-accent" role="listitem">
              <span className="list-number" style={{ color: "#9edfff" }}>+</span>
              <div>
                <span style={{ color: "#91b3c5" }}>MCC MNU</span>
                <strong style={{ color: "#fff" }}>Explore learning paths</strong>
                <small style={{ color: "#91b3c5" }}>Tracks, courses and lessons</small>
              </div>
              <ArrowRight className="arrow-icon" size={16} style={{ color: "var(--mcc-cyan)", marginLeft: "auto", marginTop: "auto" }} />
            </CardLink>
          </div>
        </div>
      </section>

      {/* Tracks/Paths Section */}
      <section className="mcc-paths" aria-labelledby="paths-title">
        <div className="container">
          <SectionHeader number="03" label="LEARNING PATHS" title="Choose a direction." action={<TextLink href="/tracks">All tracks</TextLink>} />
          <div className="mcc-path-grid" role="list">
            {tracksData.map((track, i) => (
              <CardLink key={track.slug} href={`/tracks/${track.slug}`} className="mcc-path" role="listitem">
                <span className="mcc-path-number">0{i + 1}</span>
                <div className="mcc-path-icon" style={{ background: `${track.color}1a`, color: track.color }} aria-hidden="true">
                  {track.icon === "BookOpen" && <BookOpen size={22} />}
                  {track.icon === "Code2" && <Code2 size={22} />}
                  {track.icon === "Cloud" && <Cloud size={22} />}
                  {track.icon === "ShieldCheck" && <ShieldCheck size={22} />}
                </div>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <div className="mcc-path-meta">
                  {track.coursesCount} courses · {track.duration} <ArrowRight className="arrow-icon" size={14} />
                </div>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="mcc-projects" aria-labelledby="projects-title">
        <div className="container">
          <SectionHeader number="04" label="PROJECTS" title="Build something real." action={<TextLink href="/projects" variant="light">View projects</TextLink>} dark />
          <div className="mcc-project-feature">
            <div className="mcc-project-visual">
              <div className="project-scanline" aria-hidden="true" />
              <div className="project-scanline" aria-hidden="true" style={{ background: "linear-gradient(90deg,#00c7e82b 1px,transparent 1px),linear-gradient(#00c7e82b 1px,transparent 1px); background-size: 55px 55px;" }} />
              <div className="project-ui">
                <span>COMPUTER VISION</span>
                <strong>{featuredProject?.title || "VisionLab"}</strong>
                <small>{featuredProject?.technologies.join(" · ") || "PYTHON · OPENCV · AI"}</small>
              </div>
              <div className="project-corner">MCC / 04</div>
            </div>
            <div className="mcc-project-copy">
              <Badge variant="featured">FEATURED PROJECT</Badge>
              <h3 className="display-sm">Ideas should leave the screen.</h3>
              <p className="body" style={{ color: "#c3d1da", maxWidth: "430px" }}>{featuredProject?.description || "VisionLab is a presentation project exploring computer vision experiments and practical AI workflows."}</p>
              <TextLink href={`/projects/${featuredProject?.slug || "visionlab"}`} variant="light">View project</TextLink>
            </div>
          </div>
          <div className="mcc-project-links" role="list">
            {otherProjects.map((project) => (
              <CardLink key={project.slug} href={`/projects/${project.slug}`} className="project-link" role="listitem">
                <h3>{project.title}</h3>
                <p>{project.technologies.join(" · ")}</p>
              </CardLink>
            ))}
            <CardLink href="/projects" className="project-link" role="listitem">
              <h3>All Projects</h3>
              <p>View the complete showcase</p>
            </CardLink>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="mcc-events" aria-labelledby="events-title">
        <div className="container">
          <SectionHeader number="05" label="EVENTS & WORKSHOPS" title="Meet. Make. Share." action={<TextLink href="/events">All events</TextLink>} />
          <div className="mcc-event-feature">
            <div className="mcc-event-date">
              <span style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#8fd8ff" }}>UPCOMING</span>
              <strong style={{ fontSize: "96px", lineHeight: 0.8, fontWeight: 700, letterSpacing: "-0.06em", display: "block", marginTop: "auto" }}>18</strong>
              <small style={{ fontSize: "12px", color: "#8ea6b7", marginTop: "10px", display: "block" }}>OCTOBER 2026</small>
            </div>
            <div className="mcc-event-copy">
              <Badge variant="cyan" style={{ marginBottom: "17px" }}>DEMO EVENT · MNU</Badge>
              <h3 className="display-sm" style={{ margin: "17px 0" }}>{featuredEvent?.title || "Build Night: From idea to prototype"}</h3>
              <p className="body" style={{ color: "#c5d4dd", maxWidth: "600px" }}>{featuredEvent?.description || "Bring an idea, meet other builders and leave with a clearer next step."}</p>
              <Button variant="primary" asChild>
                <Link href={`/events/${featuredEvent?.slug || "build-night"}`}>View event <ArrowRight size={16} /></Link>
              </Button>
            </div>
            <div className="mcc-event-poster">
              <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.15em" }}>WORKSHOP</span>
              <strong style={{ fontSize: "55px", lineHeight: 0.84, letterSpacing: "-0.05em", display: "block" }}>BUILD<br />NIGHT</strong>
              <small style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em" }}>MCC MNU</small>
            </div>
          </div>
          <div className="mcc-event-list" role="list">
            {otherEvents.map((event, i) => (
              <CardLink key={event.slug} href={`/events/${event.slug}`} className="mcc-event-row" role="listitem">
                <span style={{ fontSize: "10px", color: "#7a8d97" }}>0{i + 2}</span>
                <time style={{ fontSize: "12px", fontWeight: 800, color: "var(--mcc-blue)" }}>{formatDate(event.date).day} {formatDate(event.date).month}</time>
                <div>
                  <strong style={{ fontSize: "16px", display: "block" }}>{event.title}</strong>
                  <small style={{ fontSize: "11px", color: "#71818a", display: "block", marginTop: "4px" }}>{event.location}</small>
                </div>
                <ArrowRight className="arrow-icon" size={16} style={{ color: "var(--mcc-blue)" }} />
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="mcc-community" aria-labelledby="community-title">
        <div className="container mcc-community-grid">
          <div className="mcc-community-art" aria-hidden="true">
            <div className="community-photo-placeholder">
              <div className="community-person community-person-a" />
              <div className="community-person community-person-b" />
              <div className="community-screen" />
            </div>
            <span className="community-stamp">MCC MNU<br />COMMUNITY</span>
          </div>
          <div className="mcc-community-copy">
            <span className="editorial-mark">06</span>
            <span className="mcc-section-label">COMMUNITY</span>
            <h2 id="community-title" className="display-md">Find people to learn and build with.</h2>
            <p className="body-lg" style={{ color: "#50616b", maxWidth: "520px", marginTop: "22px" }}>Explore events, projects, learning and opportunities — then find your place in the MCC MNU community.</p>
            <TextLink href="/join">Get involved</TextLink>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="mcc-opportunities" aria-labelledby="opportunities-title">
        <div className="container">
          <SectionHeader number="07" label="OPPORTUNITIES" title="What's next?" action={<TextLink href="/opportunities">Explore opportunities</TextLink>} />
          <div className="mcc-op-list" role="list">
            {topOpportunities.map((opp, i) => (
              <CardLink key={opp.slug} href="/opportunities" className="mcc-op-row" role="listitem">
                <span style={{ fontSize: "10px", color: "#7c8d96" }}>0{i + 1}</span>
                <strong style={{ fontSize: "19px" }}>{opp.title}</strong>
                <em style={{ fontSize: "12px", color: "#5c707c", fontStyle: "normal" }}>{opp.type}</em>
                <time style={{ fontSize: "12px", color: "#5c707c" }}>{formatDate(opp.date).day} {formatDate(opp.date).month}</time>
                <ArrowRight className="arrow-icon" size={16} style={{ color: "var(--mcc-blue)" }} />
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA Section */}
      <section className="mcc-join" aria-labelledby="join-title">
        <div className="container mcc-join-inner">
          <div>
            <span className="mcc-section-label light-label">MCC MNU</span>
            <h2 id="join-title" className="display-lg">Make your next project matter.</h2>
            <p className="body-lg" style={{ color: "#e5f6ff", maxWidth: "650px", marginTop: "12px" }}>Learn something useful. Build something real. Meet the people who will build it with you.</p>
          </div>
          <Button variant="inverse" asChild size="lg">
            <Link href="/join">Join MCC MNU <ArrowRight size={18} /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}