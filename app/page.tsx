import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, Code2, Compass, Orbit, PlayCircle, Sparkles } from "lucide-react";
import { loadTracks } from "@/lib/content-views";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";

export const revalidate = 300;

export default async function HomePage() {
  const [{ items: tracks }, user, profile] = await Promise.all([
    loadTracks(),
    getCurrentUser(),
    getCurrentProfile(),
  ]);
  const signedIn = Boolean(user);
  const role = profile?.role;
  const dashboardHref = role === "admin" || role === "leader" ? "/admin" : "/dashboard";

  return (
    <div className="mcc-v2-home">
      <section className="mcc-v2-hero" aria-labelledby="mcc-v2-title">
        <div className="mcc-v2-hero-grid" aria-hidden="true" />
        <div className="mcc-v2-hero-content">
          <div className="mcc-v2-hero-copy">
            <p className="mcc-v2-eyebrow"><span className="mcc-v2-live-dot" /> MICROSOFT CAMPUS CLUB <span className="mcc-v2-eyebrow-divider">/</span> MANSOURA NATIONAL UNIVERSITY</p>
            <h1 id="mcc-v2-title">Learn it.<br /><span>Build it.</span><br />Share what&apos;s next.</h1>
            <p className="mcc-v2-hero-lede">A campus community for curious minds. Explore technology, learn from one another, and turn ideas into things people can use.</p>
            <div className="mcc-v2-hero-actions">
              <Link className="mcc-v2-button mcc-v2-button-bright" href="/courses">Explore courses <ArrowRight size={18} /></Link>
              {signedIn ? (
                <Link className="mcc-v2-button mcc-v2-button-quiet" href={dashboardHref}>Your workspace <ArrowUpRight size={17} /></Link>
              ) : (
                <Link className="mcc-v2-button mcc-v2-button-quiet" href="/about">Meet the club <ArrowUpRight size={17} /></Link>
              )}
            </div>
            <div className="mcc-v2-hero-footnote"><span className="mcc-v2-footline" /> LEARN AT YOUR PACE. BUILD WITH YOUR PEOPLE.</div>
          </div>
          <div className="mcc-v2-hero-art" aria-label="MCC MNU robot mascot">
            <div className="mcc-v2-art-frame" />
            <Image src="/mcc-mascot.jpeg" alt="MCC MNU robot mascot wearing navy and white campus-club gear" width={853} height={1280} priority className="mcc-v2-mascot" />
            <div className="mcc-v2-art-chip mcc-v2-art-chip-top"><span className="mcc-v2-chip-mark">M</span><span><strong>MCC MNU</strong><small>Learn · Build · Grow</small></span></div>
            <div className="mcc-v2-art-chip mcc-v2-art-chip-bottom"><Sparkles size={17} /><span><strong>Curiosity, in motion.</strong><small>A community made for makers</small></span></div>
            <span className="mcc-v2-art-index">MNU / 01</span>
          </div>
        </div>
        <div className="mcc-v2-hero-bottom"><span>01 — LEARN</span><span>02 — BUILD</span><span>03 — SHARE</span><ArrowDownRight size={17} /></div>
      </section>

      <section className="mcc-v2-section mcc-v2-pathways" aria-labelledby="pathways-title">
        <div className="mcc-v2-section-heading">
          <div><p className="mcc-v2-overline">YOUR NEXT CHAPTER</p><h2 id="pathways-title">Find your way in.</h2></div>
          <p className="mcc-v2-section-intro">Start with a skill, a question, or a project idea. There&apos;s more than one way to be part of the club.</p>
        </div>
        <div className="mcc-v2-path-grid">
          <Link href="/courses" className="mcc-v2-path-card mcc-v2-path-card-primary"><span className="mcc-v2-path-number">01 / LEARN</span><BookOpen size={27} strokeWidth={1.6} /><h3>Learn something real.</h3><p>Follow video lessons and keep your progress together in one place.</p><span className="mcc-v2-path-link">Browse courses <ArrowUpRight size={17} /></span></Link>
          <Link href="/tracks" className="mcc-v2-path-card"><span className="mcc-v2-path-number">02 / EXPLORE</span><Compass size={27} strokeWidth={1.6} /><h3>Choose a direction.</h3><p>Explore the learning tracks currently published by MCC MNU.</p><span className="mcc-v2-path-link">Explore tracks <ArrowUpRight size={17} /></span></Link>
          <Link href="/resources" className="mcc-v2-path-card"><span className="mcc-v2-path-number">03 / EXPLORE</span><Orbit size={27} strokeWidth={1.6} /><h3>Find your next tool.</h3><p>Use trusted references and resources to support what you learn.</p><span className="mcc-v2-path-link">Browse resources <ArrowUpRight size={17} /></span></Link>
        </div>
      </section>

      <section className="mcc-v2-section mcc-v2-tracks" aria-labelledby="tracks-title">
        <div className="mcc-v2-section-heading">
          <div><p className="mcc-v2-overline">LEARNING AT MCC</p><h2 id="tracks-title">Built around curiosity.</h2></div>
          <Link className="mcc-v2-text-link" href="/tracks">All tracks <ArrowRight size={17} /></Link>
        </div>
        {tracks.length ? (
          <div className="mcc-v2-track-grid">
            {tracks.slice(0, 4).map((track, index) => {
              const TrackIcon = index % 2 === 0 ? Code2 : PlayCircle;
              return <Link href={`/tracks/${track.slug}`} className="mcc-v2-track-card" key={track.slug}>
                <div className="mcc-v2-track-card-top"><span>TRACK / {String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={19} /></div>
                <div className="mcc-v2-track-icon"><TrackIcon size={23} /></div>
                <h3>{track.title}</h3>
                <p>{track.description || "Explore the published learning path and its available courses."}</p>
                <span className="mcc-v2-track-open">View track <ArrowRight size={16} /></span>
              </Link>;
            })}
          </div>
        ) : (
          <div className="mcc-v2-empty-state"><div className="mcc-v2-empty-icon"><BookOpen size={24} /></div><h3>New learning paths are on the way.</h3><p>Published tracks will appear here as the club adds them. Start with the current course catalogue in the meantime.</p><Link href="/courses" className="mcc-v2-text-link">View courses <ArrowRight size={16} /></Link></div>
        )}
      </section>

      <section className="mcc-v2-community" aria-labelledby="community-title">
        <div className="mcc-v2-community-art"><Image src="/mcc-banner.jpeg" alt="MCC MNU robot mascot at work in a cinematic technology workspace" width={1280} height={720} loading="lazy" /><div className="mcc-v2-community-tag">MCC MNU / COMMUNITY</div></div>
        <div className="mcc-v2-community-copy"><p className="mcc-v2-overline">BETTER, TOGETHER</p><h2 id="community-title">A club is more than a logo.</h2><p>It&apos;s the questions after a session, the project that almost works, and the people who help you get it over the line. MCC MNU brings students together to learn by doing.</p><div className="mcc-v2-community-actions"><Link href="/about" className="mcc-v2-button mcc-v2-button-bright">Discover MCC <ArrowRight size={17} /></Link><Link href="/tracks" className="mcc-v2-text-link">Explore learning tracks <ArrowUpRight size={16} /></Link></div></div>
      </section>

      <section className="mcc-v2-bottom-cta"><div><p className="mcc-v2-overline">START WHERE YOU ARE</p><h2>{signedIn ? "Ready for your next lesson?" : "Your next idea starts here."}</h2><p>{signedIn ? "Pick up your learning and keep moving forward." : "No need to have everything figured out. Bring your curiosity."}</p></div><Link href={signedIn ? dashboardHref : "/courses"} className="mcc-v2-button mcc-v2-button-dark">{signedIn ? "Open your workspace" : "Start learning"} <ArrowRight size={17} /></Link></section>
    </div>
  );
}
