import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  PlayCircle,
  Layers3,
} from "lucide-react";
import { loadTracks } from "@/lib/content-views";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";

export const revalidate = 300;

const startingPoints = [
  {
    number: "01",
    title: "Find your direction",
    copy: "Browse the learning tracks published by MCC MNU.",
    href: "/tracks",
    label: "Explore tracks",
    Icon: Compass,
  },
  {
    number: "02",
    title: "Start with a lesson",
    copy: "Follow video lessons in the courses currently available.",
    href: "/courses",
    label: "Browse courses",
    Icon: PlayCircle,
  },
  {
    number: "03",
    title: "Keep exploring",
    copy: "Use supporting links and references when you need more.",
    href: "/resources",
    label: "Open resources",
    Icon: BookOpen,
  },
];

export default async function HomePage() {
  const [{ items: tracks }, user, profile] = await Promise.all([
    loadTracks(),
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  const signedIn = Boolean(user);
  const workspaceHref =
    profile?.role === "admin" || profile?.role === "leader"
      ? "/admin"
      : "/dashboard";

  return (
    <div className="mcc-restart-home">
      <section className="mcc-restart-hero" aria-labelledby="mcc-restart-title">
        <div className="mcc-restart-hero-grain" aria-hidden="true" />
        <div className="mcc-restart-shell mcc-restart-hero-layout">
          <div className="mcc-restart-copy">
            <p className="mcc-restart-eyebrow">
              <span className="mcc-restart-eyebrow-mark"><span /><span /><span /><span /></span>
              MICROSOFT CAMPUS CLUB <i>/</i> MANSOURA NATIONAL UNIVERSITY
            </p>
            <h1 id="mcc-restart-title">
              Make your next
              <br />
              move in <span>tech.</span>
            </h1>
            <p className="mcc-restart-lede">
              A campus community for people who want to understand technology by
              working with it. Start with a topic, follow the lessons, and build
              skills you can use beyond the screen.
            </p>
            <div className="mcc-restart-actions">
              <Link href="/tracks" className="mcc-restart-button mcc-restart-button-blue">
                Explore learning tracks <ArrowRight size={18} />
              </Link>
              <Link href="/about" className="mcc-restart-text-button">
                Get to know MCC <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="mcc-restart-hero-note">
              <span className="mcc-restart-note-line" />
              Learn with purpose. Build with people.
            </div>
          </div>

          <div className="mcc-restart-stage" aria-label="MCC MNU learning space">
            <div className="mcc-restart-stage-top">
              <span>THE LEARNING SPACE</span>
              <span>MCC — MNU</span>
            </div>
            <div className="mcc-restart-stage-orbit" aria-hidden="true" />
            <div className="mcc-restart-stage-orbit-two" aria-hidden="true" />
            <div className="mcc-restart-stage-spark mcc-restart-stage-spark-one" aria-hidden="true">+</div>
            <div className="mcc-restart-stage-spark mcc-restart-stage-spark-two" aria-hidden="true">✳</div>
            <div className="mcc-restart-stage-brand">
              <span>IDEAS IN MOTION</span>
              <strong>MCC<span>.</span></strong>
              <div className="mcc-restart-stage-brand-rule"><i /><i /><i /><i /></div>
              <small>MICROSOFT CAMPUS CLUB<br />MANSOURA NATIONAL UNIVERSITY</small>
            </div>
            <div className="mcc-restart-stage-count">
              <strong>{String(tracks.length).padStart(2, "0")}</strong>
              <span>TRACKS<br />PUBLISHED</span>
            </div>
            <div className="mcc-restart-stage-bottom">
              <div className="mcc-restart-stage-bottom-head">
                <span>START EXPLORING</span>
                <span>01 — 03</span>
              </div>
              {tracks.length > 0 ? (
                tracks.slice(0, 3).map((track, index) => (
                  <Link
                    href={"/tracks/" + track.slug}
                    className={"mcc-restart-stage-track mcc-restart-stage-track-" + index}
                    key={track.slug}
                  >
                    <span className="mcc-restart-stage-track-number">0{index + 1}</span>
                    <span className="mcc-restart-stage-track-title">{track.title}</span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))
              ) : (
                <div className="mcc-restart-stage-empty">
                  <Layers3 size={17} />
                  <span>Published learning tracks will appear here.</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mcc-restart-hero-bottom">
          <div className="mcc-restart-shell">
            <span>CURIOUS BY NATURE</span>
            <span className="mcc-restart-bottom-dot" />
            <span>BETTER BY BUILDING</span>
            <span className="mcc-restart-bottom-right">MANSOURA · EGYPT</span>
          </div>
        </div>
      </section>

      <section className="mcc-restart-start section" aria-labelledby="mcc-restart-start-title">
        <div className="mcc-restart-shell">
          <div className="mcc-restart-section-intro">
            <div>
              <p className="mcc-restart-section-label">YOUR FIRST STEP</p>
              <h2 id="mcc-restart-start-title">Start wherever you are.</h2>
            </div>
            <p>
              You do not need a perfect plan. Choose the path that feels useful
              today and keep moving from there.
            </p>
          </div>
          <div className="mcc-restart-start-list">
            {startingPoints.map(({ number, title, copy, href, label, Icon }) => (
              <article className="mcc-restart-start-row" key={number}>
                <span className="mcc-restart-start-number">{number}</span>
                <span className="mcc-restart-start-icon"><Icon size={23} strokeWidth={1.7} /></span>
                <div className="mcc-restart-start-copy">
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <Link href={href} aria-label={label + ": " + title} className="mcc-restart-round-link">
                  <ArrowUpRight size={19} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mcc-restart-tracks section" aria-labelledby="mcc-restart-tracks-title">
        <div className="mcc-restart-shell">
          <div className="mcc-restart-section-intro mcc-restart-tracks-intro">
            <div>
              <p className="mcc-restart-section-label">THE CURRENT CATALOGUE</p>
              <h2 id="mcc-restart-tracks-title">Follow an interest.</h2>
            </div>
            <Link href="/tracks" className="mcc-restart-inline-link">
              All learning tracks <ArrowRight size={17} />
            </Link>
          </div>

          {tracks.length > 0 ? (
            <div className="mcc-restart-track-list">
              {tracks.slice(0, 6).map((track, index) => (
                <Link
                  href={"/tracks/" + track.slug}
                  className={"mcc-restart-track-row mcc-restart-track-tone-" + (index % 3)}
                  key={track.slug}
                >
                  <span className="mcc-restart-track-index">0{index + 1}</span>
                  <span className="mcc-restart-track-mark" aria-hidden="true">
                    <i /><i /><i /><i />
                  </span>
                  <span className="mcc-restart-track-main">
                    <strong>{track.title}</strong>
                    <small>{track.description || "Explore the courses and video lessons available in this track."}</small>
                  </span>
                  <span className="mcc-restart-track-action">Explore <ArrowUpRight size={17} /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mcc-restart-empty">
              <span className="mcc-restart-empty-icon"><Layers3 size={23} /></span>
              <div>
                <strong>New learning tracks will appear here when published.</strong>
                <p>Browse the available course catalogue in the meantime.</p>
              </div>
              <Link href="/courses" className="mcc-restart-inline-link">Browse courses <ArrowRight size={16} /></Link>
            </div>
          )}
        </div>
      </section>

      <section className="mcc-restart-community" aria-labelledby="mcc-restart-community-title">
        <div className="mcc-restart-community-shape" aria-hidden="true">
          <span className="mcc-restart-community-circle" />
          <span className="mcc-restart-community-plus">+</span>
          <span className="mcc-restart-community-label">MCC<br />MNU</span>
          <span className="mcc-restart-community-index">LEARN / BUILD / SHARE</span>
        </div>
        <div className="mcc-restart-community-copy">
          <p className="mcc-restart-section-label">MORE THAN A COURSE LIST</p>
          <h2 id="mcc-restart-community-title">The best work rarely happens alone.</h2>
          <p>
            MCC MNU is a student community at Mansoura National University
            built around technology, shared learning, and practical curiosity.
            Come for a topic that interests you; stay to see what you can do with it.
          </p>
          <Link href="/about" className="mcc-restart-button mcc-restart-button-ink">
            About the club <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="mcc-restart-final">
        <div className="mcc-restart-shell mcc-restart-final-inner">
          <div>
            <p className="mcc-restart-section-label">READY WHEN YOU ARE</p>
            <h2>{signedIn ? "Pick up where you left off." : "One topic can be a start."}</h2>
            <p>
              {signedIn
                ? "Head back to your workspace and continue learning."
                : "Choose a course and take your next step into technology."}
            </p>
          </div>
          <Link
            href={signedIn ? workspaceHref : "/courses"}
            className="mcc-restart-button mcc-restart-button-ink"
          >
            {signedIn ? "Open your workspace" : "See available courses"} <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
