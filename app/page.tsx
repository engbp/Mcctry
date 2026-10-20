import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Link2,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { loadTracks } from "@/lib/content-views";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";

export const revalidate = 300;

const pathways = [
  {
    number: "01",
    label: "LEARNING PATHS",
    title: "Find a direction.",
    description: "Explore the learning tracks currently published by MCC MNU.",
    href: "/tracks",
    action: "Explore tracks",
    Icon: Compass,
  },
  {
    number: "02",
    label: "VIDEO COURSES",
    title: "Learn one step at a time.",
    description: "Follow lesson videos in sequence and return when you are ready for more.",
    href: "/courses",
    action: "Browse courses",
    Icon: PlayCircle,
  },
  {
    number: "03",
    label: "LEARNING RESOURCES",
    title: "Go a little deeper.",
    description: "Open the references and resources available alongside the learning content.",
    href: "/resources",
    action: "View resources",
    Icon: Link2,
  },
];

export default async function HomePage() {
  const [{ items: tracks }, user, profile] = await Promise.all([
    loadTracks(),
    getCurrentUser(),
    getCurrentProfile(),
  ]);
  const signedIn = Boolean(user);
  const dashboardHref =
    profile?.role === "admin" || profile?.role === "leader"
      ? "/admin"
      : "/dashboard";

  return (
    <div className="mcc-landing">
      <section className="mcc-landing-hero" aria-labelledby="mcc-landing-title">
        <div className="mcc-landing-hero-glow" aria-hidden="true" />
        <div className="mcc-landing-wrap mcc-landing-hero-inner">
          <div className="mcc-landing-copy">
            <p className="mcc-landing-kicker">
              <span className="mcc-landing-live-dot" />
              MICROSOFT CAMPUS CLUB
              <span className="mcc-landing-kicker-divider">/</span>
              MANSOURA NATIONAL UNIVERSITY
            </p>
            <h1 id="mcc-landing-title">
              Learn tech.
              <br />
              Make it <span>real.</span>
            </h1>
            <p className="mcc-landing-lede">
              Explore the learning tracks and video courses published by MCC MNU.
              Pick a topic, follow the lessons, and build your skills at a pace
              that works for you.
            </p>
            <div className="mcc-landing-actions">
              <Link className="mcc-landing-button mcc-landing-button-primary" href="/tracks">
                Explore learning tracks <ArrowRight size={18} />
              </Link>
              <Link className="mcc-landing-button mcc-landing-button-quiet" href="/courses">
                Browse courses <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="mcc-landing-principles" aria-label="How to get started">
              <span><i>01</i> Choose a topic</span>
              <span><i>02</i> Start a lesson</span>
              <span><i>03</i> Keep building</span>
            </div>
          </div>

          <div
            className="mcc-landing-art"
            role="img"
            aria-label={`MCC MNU learning space with ${tracks.length} published learning tracks`}
          >
            <div className="mcc-landing-art-grid" />
            <div className="mcc-landing-art-cross mcc-landing-art-cross-x" />
            <div className="mcc-landing-art-cross mcc-landing-art-cross-y" />
            <div className="mcc-landing-orbit mcc-landing-orbit-outer" />
            <div className="mcc-landing-orbit mcc-landing-orbit-middle" />
            <div className="mcc-landing-orbit mcc-landing-orbit-inner" />
            <div className="mcc-landing-orbit-point mcc-landing-orbit-point-a" />
            <div className="mcc-landing-orbit-point mcc-landing-orbit-point-b" />
            <div className="mcc-landing-art-center">
              <span className="mcc-landing-art-center-label">MCC / MNU</span>
              <strong>LEARN<span>.</span><br />BUILD<span>.</span><br />SHARE<span>.</span></strong>
              <small>CURIOUS MINDS, SHARED WORK</small>
            </div>
            <div className="mcc-landing-art-callout mcc-landing-art-callout-top">
              <span>LEARNING SPACE / 01</span>
              <strong>Start with what interests you.</strong>
            </div>
            <div className="mcc-landing-art-count">
              <small>CURRENTLY PUBLISHED</small>
              <strong>{String(tracks.length).padStart(2, "0")}</strong>
              <span>LEARNING TRACKS</span>
            </div>
            <span className="mcc-landing-art-index">MNU · EGYPT</span>
          </div>
        </div>
        <div className="mcc-landing-hero-rule">
          <div className="mcc-landing-wrap">
            <span>MCC MNU</span>
            <span>LEARN WITH INTENT</span>
            <span>BUILD WITH OTHERS</span>
            <ArrowRight size={16} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="mcc-landing-section mcc-landing-start" aria-labelledby="mcc-landing-start-title">
        <div className="mcc-landing-wrap">
          <div className="mcc-landing-section-head">
            <div>
              <p className="mcc-landing-overline">A GOOD PLACE TO START</p>
              <h2 id="mcc-landing-start-title">What do you want to learn?</h2>
            </div>
            <p>
              Start with one useful step. Everything here points to learning
              material and resources that are actually available on the site.
            </p>
          </div>
          <div className="mcc-landing-waypoints">
            {pathways.map(({ number, label, title, description, href, action, Icon }) => (
              <article className="mcc-landing-waypoint" key={number}>
                <div className="mcc-landing-waypoint-top">
                  <span>{number} <i>/</i> {label}</span>
                  <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <Link href={href}>{action}<ArrowUpRight size={16} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mcc-landing-section mcc-landing-published" aria-labelledby="mcc-landing-tracks-title">
        <div className="mcc-landing-wrap">
          <div className="mcc-landing-section-head">
            <div>
              <p className="mcc-landing-overline">PUBLISHED BY MCC MNU</p>
              <h2 id="mcc-landing-tracks-title">Explore the learning tracks.</h2>
            </div>
            <Link className="mcc-landing-inline-link" href="/tracks">
              All tracks <ArrowRight size={16} />
            </Link>
          </div>
          {tracks.length > 0 ? (
            <div className="mcc-landing-track-list">
              {tracks.slice(0, 4).map((track, index) => (
                <Link
                  href={`/tracks/${track.slug}`}
                  className="mcc-landing-track-row"
                  key={track.slug}
                >
                  <span className="mcc-landing-track-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mcc-landing-track-copy">
                    <strong>{track.title}</strong>
                    <small>{track.description || "Explore the courses available in this learning track."}</small>
                  </span>
                  <span className="mcc-landing-track-open">View track <ArrowUpRight size={17} /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mcc-landing-empty">
              <BookOpen size={23} aria-hidden="true" />
              <div>
                <strong>Learning tracks will appear here when published.</strong>
                <p>You can still browse the course catalogue to see what is currently available.</p>
              </div>
              <Link href="/courses">View courses <ArrowRight size={16} /></Link>
            </div>
          )}
        </div>
      </section>

      <section className="mcc-landing-community" aria-labelledby="mcc-landing-community-title">
        <div className="mcc-landing-community-mark" aria-hidden="true">
          <span className="mcc-landing-community-ring" />
          <span className="mcc-landing-community-cross">+</span>
          <span className="mcc-landing-community-stamp">MCC<br />MNU</span>
          <span className="mcc-landing-community-caption">LEARN / BUILD / CONNECT</span>
        </div>
        <div className="mcc-landing-community-copy">
          <p className="mcc-landing-overline">A STUDENT COMMUNITY AT MNU</p>
          <h2 id="mcc-landing-community-title">You bring the curiosity.<br /><span>Start from there.</span></h2>
          <p>
            MCC MNU brings students together around technology and practical
            learning. Start with the material available today, then keep exploring
            as new learning content is published.
          </p>
          <div className="mcc-landing-community-actions">
            <Link className="mcc-landing-button mcc-landing-button-primary" href="/about">
              Get to know MCC <ArrowRight size={17} />
            </Link>
            <Link className="mcc-landing-inline-link" href="/resources">
              Explore resources <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mcc-landing-final-cta">
        <div className="mcc-landing-wrap">
          <div>
            <p className="mcc-landing-overline">YOUR NEXT STEP</p>
            <h2>{signedIn ? "Ready for another lesson?" : "Start with one lesson."}</h2>
            <p>{signedIn ? "Pick up where you left off in your workspace." : "Choose a course and find a topic worth your time."}</p>
          </div>
          <Link className="mcc-landing-button mcc-landing-button-dark" href={signedIn ? dashboardHref : "/courses"}>
            {signedIn ? "Open your workspace" : "Browse courses"} <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
