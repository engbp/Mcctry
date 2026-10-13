import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Clock3, MapPin, BookOpen,
  Code2, Cloud, ShieldCheck, Users, Trophy, Newspaper,
} from "lucide-react";
import { formatDate } from "@/lib/data";
import { loadEvents, loadProjects, loadTracks } from "@/lib/content-views";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { ScrambleText } from "@/components/fx/ScrambleText";

export const revalidate = 300;

const trackIcons = { BookOpen, Code2, Cloud, ShieldCheck } as const;

const principles = [
  { number: "01", title: "Learn across tracks", text: "Choose the technical path that fits your interests. Joining a track gives you access to its sessions and materials right away." },
  { number: "02", title: "Contribute as a team member", text: "Club-wide team membership is separate from learning-track enrollment and is granted through official recruitment." },
  { number: "03", title: "Make the community happen", text: "Operational teams coordinate the work behind events, communications, and the student experience." },
];

export default async function HomePage() {
  const [tracksResult, eventsResult, projectsResult] = await Promise.all([
    loadTracks(),
    loadEvents(),
    loadProjects(),
  ]);
  const tracks = tracksResult.items;
  const events = eventsResult.items;
  const projects = projectsResult.items;

  const featuredEvent = events.find((event) => event.featured) ?? events[0];
  const otherEvents = events.filter((event) => event.slug !== featuredEvent?.slug).slice(0, 2);
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const eventDate = featuredEvent ? formatDate(featuredEvent.date) : null;

  return (
    <div className="mcc-home">
      <section className="mcc-hero" aria-labelledby="mcc-hero-title">
        <div className="mcc-hero-grid" aria-hidden="true" />
        <div className="mcc-hero-inner">
          <div className="mcc-hero-copy">
            <span className="mcc-kicker"><span className="mcc-kicker-dot" /> <ScrambleText text="MCC MNU / MICROSOFT CAMPUS CLUB" /></span>
            <h1 id="mcc-hero-title">Make room for <span>what&apos;s next.</span></h1>
            <p className="mcc-hero-lede">A student community at Mansoura National University to explore technology, build things together, and turn curiosity into momentum.</p>
            <div className="mcc-hero-actions">
              <Link className="mcc-button mcc-button-light" href="/tracks">Explore learning tracks <ArrowRight size={17} /></Link>
              <Link className="mcc-button mcc-button-outline" href="/events">Discover events <ArrowUpRight size={17} /></Link>
            </div>
            <div className="mcc-hero-note"><span>01</span> Learn something new. <span>02</span> Build with people. <span>03</span> Share what you make.</div>
          </div>

          <div className="mcc-hero-poster" aria-label="MCC MNU community poster">
            <div className="mcc-poster-top"><span>STUDENT COMMUNITY</span><span>MN / 26</span></div>
            <div className="mcc-poster-art" aria-hidden="true">
              <span className="mcc-poster-ring mcc-poster-ring-one" />
              <span className="mcc-poster-ring mcc-poster-ring-two" />
              <span className="mcc-poster-cross">+</span>
              <span className="mcc-poster-word">MAKE<br />IT<br /><em>REAL.</em></span>
              <span className="mcc-poster-stamp">IDEAS<br />IN MOTION</span>
            </div>
            <div className="mcc-poster-bottom"><strong>LEARN / BUILD / CONNECT</strong><span>MAN SOURA · EGYPT</span></div>
          </div>
          <div className="mcc-hero-side-note" aria-hidden="true">CURIOUS MINDS, SHARED WORK.</div>
        </div>
        <div className="mcc-hero-bottomline"><span>MICROSOFT CAMPUS CLUB</span><span>MANSOURA NATIONAL UNIVERSITY</span><span>COMMUNITY FIRST — ALWAYS BUILDING</span></div>
      </section>

      <section className="mcc-intro section" aria-labelledby="mcc-intro-title">
        <Reveal className="container mcc-intro-grid">
          <div>
            <span className="mcc-section-label">01 / THE CLUB</span>
            <h2 id="mcc-intro-title">A place to explore.<br /><em>A reason to build.</em></h2>
          </div>
          <div className="mcc-intro-copy">
            <p>MCC MNU brings students together around technology, practical learning, projects, and events. You don&apos;t have to follow one path or already know everything — start with what interests you.</p>
            <Link href="/about" className="mcc-text-link">Get to know MCC <ArrowRight size={16} /></Link>
          </div>
        </Reveal>
      </section>

      <section className="mcc-tracks section" aria-labelledby="mcc-tracks-title">
        <div className="container">
          <div className="mcc-section-heading">
            <div><span className="mcc-section-label">02 / LEARNING TRACKS</span><h2 id="mcc-tracks-title">Find your direction.</h2></div>
            <Link href="/tracks" className="mcc-text-link">All tracks <ArrowRight size={16} /></Link>
          </div>
          <div className="mcc-track-list">
            {tracks.map((track, index) => {
              const Icon = trackIcons[track.icon as keyof typeof trackIcons] ?? BookOpen;
              return (
                <Link key={track.slug} href={`/tracks/${track.slug}`} className="mcc-track-row" style={{ "--track-color": track.color } as React.CSSProperties}>
                  <span className="mcc-track-index">0{index + 1}</span>
                  <span className="mcc-track-icon"><Icon size={22} /></span>
                  <span className="mcc-track-main"><strong>{track.title}</strong><small>{track.description}</small></span>
                  <span className="mcc-track-meta">{track.coursesCount} courses <span>·</span> {track.duration}</span>
                  <span className="mcc-track-arrow"><ArrowUpRight size={20} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mcc-community section" aria-labelledby="mcc-community-title">
        <div className="container mcc-community-grid">
          <div className="mcc-community-head">
            <span className="mcc-section-label">03 / MORE THAN LEARNING</span>
            <h2 id="mcc-community-title">The community is what you make of it.</h2>
            <p>Tracks are only one part of MCC. Public events, student projects, stories, and the people organizing it all belong in the same place.</p>
            <Link href="/about" className="mcc-text-link">How MCC works <ArrowRight size={16} /></Link>
          </div>
          <div className="mcc-principles">
            {principles.map((item) => (
              <article className="mcc-principle" key={item.number}>
                <span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowUpRight size={18} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {featuredEvent && eventDate && (
        <section className="mcc-events section" aria-labelledby="mcc-events-title">
          <div className="container">
            <div className="mcc-section-heading">
              <div><span className="mcc-section-label">04 / WHAT&apos;S HAPPENING</span><h2 id="mcc-events-title">Meet us in the room.</h2></div>
              <Link href="/events" className="mcc-text-link">All events <ArrowRight size={16} /></Link>
            </div>
            <div className="mcc-event-feature">
              <div className="mcc-event-date"><span>{eventDate.month}</span><strong>{eventDate.day}</strong><small>{eventDate.year}</small></div>
              <div className="mcc-event-copy"><span className="mcc-event-tag">{featuredEvent.category} / {featuredEvent.demo ? "SAMPLE EVENT" : "UPCOMING"}</span><h3>{featuredEvent.title}</h3><p>{featuredEvent.description}</p><div className="mcc-event-meta"><span><Clock3 size={15} /> {featuredEvent.time}</span><span><MapPin size={15} /> {featuredEvent.location}</span></div><Link href={`/events/${featuredEvent.slug}`} className="mcc-button mcc-button-dark">Event details <ArrowRight size={16} /></Link></div>
              <div className="mcc-event-art" aria-hidden="true"><span className="mcc-event-art-label">SAVE<br />YOUR<br /><em>SPOT</em></span><span className="mcc-event-art-circle" /><span className="mcc-event-art-mark">MCC / MNU</span></div>
            </div>
            {otherEvents.length > 0 && <div className="mcc-event-mini-grid">{otherEvents.map((event) => { const date = formatDate(event.date); return <Link key={event.slug} href={`/events/${event.slug}`} className="mcc-event-mini"><span>{date.day} {date.month} · {event.category}</span><strong>{event.title}</strong><small>{event.time} / {event.location}</small><ArrowUpRight size={17} /></Link>; })}</div>}
          </div>
        </section>
      )}

      <section className="mcc-showcase section" aria-labelledby="mcc-showcase-title">
        <div className="container mcc-showcase-grid">
          <div className="mcc-showcase-art" aria-hidden="true"><span className="mcc-showcase-label">IDEAS<br />BECOME<br /><em>THINGS.</em></span><span className="mcc-showcase-orbit" /><span className="mcc-showcase-number">BUILD / 001</span></div>
          <div className="mcc-showcase-copy"><span className="mcc-section-label">05 / STUDENT WORK</span><h2 id="mcc-showcase-title">{featuredProject?.title ?? "Made by students, shared with everyone."}</h2><p>{featuredProject?.description ?? "Explore prototypes, experiments, and projects from the MCC community."}</p><span className="mcc-content-status">PROJECT SHOWCASE</span><Link href="/projects" className="mcc-text-link">Explore student projects <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="mcc-publication section" aria-labelledby="mcc-publication-title">
        <div className="container">
          <div className="mcc-section-heading"><div><span className="mcc-section-label">06 / COMMUNITY STORIES</span><h2 id="mcc-publication-title">The work beyond the workshop.</h2></div><Link href="/news" className="mcc-text-link">News & stories <ArrowRight size={16} /></Link></div>
          <div className="mcc-publication-grid">
            <SpotlightCard as="a" href="/teams" tilt={false} className="mcc-publication-card mcc-publication-card-blue"><span><Users size={18} /> PEOPLE & TEAMS</span><strong>Meet the people who make MCC happen.</strong><small>Explore operational teams and how the club is organized.</small><ArrowUpRight size={20} /></SpotlightCard>
            <SpotlightCard as="a" href="/achievements" tilt={false} className="mcc-publication-card mcc-publication-card-cyan"><span><Trophy size={18} /> ACHIEVEMENTS</span><strong>Celebrate the effort, not just the outcome.</strong><small>Projects, milestones, and community highlights.</small><ArrowUpRight size={20} /></SpotlightCard>
            <SpotlightCard as="a" href="/news" tilt={false} className="mcc-publication-card mcc-publication-card-paper"><span><Newspaper size={18} /> NEWS &amp; UPDATES</span><strong>Stay in the loop.</strong><small>Announcements, recruitment windows, and club stories.</small><ArrowUpRight size={20} /></SpotlightCard>
          </div>
        </div>
      </section>

      <section className="mcc-join-band" aria-labelledby="mcc-join-title">
        <div className="container mcc-join-inner"><div><span className="mcc-section-label">YOUR NEXT CHAPTER</span><h2 id="mcc-join-title">Curiosity is a good place to start.</h2><p>Explore the public club space now. Official team recruitment opens in announced application cycles.</p></div><div className="mcc-join-actions"><Link href="/join" className="mcc-button mcc-button-light">Recruitment information <ArrowRight size={16} /></Link><a href="https://www.facebook.com/share/14sQQMH2mxJ/" target="_blank" rel="noreferrer" className="mcc-button mcc-button-outline">Follow MCC MNU <ArrowUpRight size={16} /></a></div></div>
      </section>
    </div>
  );
}
