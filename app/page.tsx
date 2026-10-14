import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BookOpen,
  Code2, Cloud, ShieldCheck,
} from "lucide-react";
import { loadTracks } from "@/lib/content-views";
import { Reveal } from "@/components/fx/Reveal";
import { ScrambleText } from "@/components/fx/ScrambleText";

export const revalidate = 300;

const trackIcons = { BookOpen, Code2, Cloud, ShieldCheck } as const;

const principles = [
  { number: "01", title: "Learn with real courses", text: "Start with the Introduction to AI course. Watch the lessons, mark them complete, and keep your progress on your account." },
  { number: "02", title: "Join the community", text: "Create a free student account to save progress across devices. Recruitment for club teams runs in announced cycles." },
  { number: "03", title: "Keep building", text: "MCC MNU is a learning community first. More tracks and materials will appear here as they are published." },
];

export default async function HomePage() {
  const tracksResult = await loadTracks();
  const tracks = tracksResult.items;

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
              <Link className="mcc-button mcc-button-light" href="/courses">Start learning <ArrowRight size={17} /></Link>
              <Link className="mcc-button mcc-button-outline" href="/signup">Create free account <ArrowUpRight size={17} /></Link>
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
            <p>MCC MNU brings students together around technology, practical learning, and community. You don&apos;t have to follow one path or already know everything — start with what interests you.</p>
            <Link href="/about" className="mcc-text-link">Get to know MCC <ArrowRight size={16} /></Link>
          </div>
        </Reveal>
      </section>

      <section className="mcc-tracks section" aria-labelledby="mcc-tracks-title">
        <div className="container">
          <div className="mcc-section-heading">
            <div><span className="mcc-section-label">02 / LEARNING</span><h2 id="mcc-tracks-title">Find your direction.</h2></div>
            <Link href="/courses" className="mcc-text-link">All courses <ArrowRight size={16} /></Link>
          </div>
          {tracks.length === 0 ? (
            <div className="notice notice-info">Courses will appear here once they are published.</div>
          ) : (
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
          )}
        </div>
      </section>

      <section className="mcc-community section" aria-labelledby="mcc-community-title">
        <div className="container mcc-community-grid">
          <div className="mcc-community-head">
            <span className="mcc-section-label">03 / HOW IT WORKS</span>
            <h2 id="mcc-community-title">Learning that sticks.</h2>
            <p>Create an account, work through the published lessons, and keep your completion state across sessions.</p>
            <Link href="/signup" className="mcc-text-link">Create a free account <ArrowRight size={16} /></Link>
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

      <section className="mcc-join-band" aria-labelledby="mcc-join-title">
        <div className="container mcc-join-inner"><div><span className="mcc-section-label">YOUR NEXT CHAPTER</span><h2 id="mcc-join-title">Curiosity is a good place to start.</h2><p>Explore the public club space now. Official team recruitment opens in announced application cycles.</p></div><div className="mcc-join-actions"><Link href="/join" className="mcc-button mcc-button-light">Recruitment information <ArrowRight size={16} /></Link><a href="https://www.facebook.com/share/14sQQMH2mxJ/" target="_blank" rel="noreferrer" className="mcc-button mcc-button-outline">Follow MCC MNU <ArrowUpRight size={16} /></a></div></div>
      </section>
    </div>
  );
}
