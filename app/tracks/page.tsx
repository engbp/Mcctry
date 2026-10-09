import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Cloud, ShieldCheck, Map, Rocket, Award } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { tracksData } from "@/lib/data";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";

const trackIcons = { BookOpen, Code2, Cloud, ShieldCheck } as const;

const steps = [
  { icon: Map, title: "Pick a Track", text: "Choose from AI & Data, Software Development, Cloud, or Cybersecurity based on your interests." },
  { icon: BookOpen, title: "Take Courses", text: "Progress through structured courses with short video lessons, resources, and checkpoints." },
  { icon: Rocket, title: "Build Projects", text: "Apply what you've learned in guided projects and showcase your work to the community." },
];

export default function TracksPage() {
  return (
    <>
      <BandHero
        crumbs={[{ label: "Tracks" }]}
        kicker="LEARN · DISCOVER"
        title="Explore learning paths."
        lede="Choose a direction, then follow a clear path through courses and lessons. Learning stays lightweight and practical."
        meta={<span className="band-meta-pill"><BookOpen size={14} /> {tracksData.length} tracks · 33+ lessons</span>}
        icon={<BookOpen size={56} />}
      />

      <section className="section" aria-labelledby="tracks-list-title">
        <div className="container">
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">ALL TRACKS</span>
              <h2 id="tracks-list-title" className="hp-section-title">Find your path.</h2>
            </div>
            <Link href="/courses" className="hp-section-link">Browse all courses <ArrowRight size={15} /></Link>
          </Reveal>

          <Reveal className="hp-track-grid" role="list">
            {tracksData.map((track, i) => {
              const Icon = trackIcons[track.icon as keyof typeof trackIcons] ?? BookOpen;
              return (
                <SpotlightCard key={track.slug} as="a" href={`/tracks/${track.slug}`} className="hp-track-card" role="listitem" style={{ "--track-color": track.color } as React.CSSProperties}>
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
                </SpotlightCard>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="how-it-works-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">HOW IT WORKS</span>
              <h2 id="how-it-works-title" className="hp-section-title">Simple by design.</h2>
            </div>
          </div>
          <Reveal className="lk-steps" role="list">
            {steps.map((step, i) => (
              <div key={step.title} className="lk-step" role="listitem">
                <span className="lk-step-number">0{i + 1}</span>
                <span className="lk-step-icon"><step.icon size={24} /></span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="tracks-cta-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>READY TO START</span>
            <h2 id="tracks-cta-title" className="hp-section-title" style={{ color: "#fff" }}>Your learning journey begins here.</h2>
            <p>Pick a track and start with the first course. No prerequisites, no pressure — just practical learning.</p>
          </div>
          <Link href="/courses" className="lk-cta-btn">
            Browse all courses <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
