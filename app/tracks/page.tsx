import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink } from "@/components/ui/Links";
import { ArrowRight, BookOpen, Code2, Cloud, ShieldCheck, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { CardLink } from "@/components/ui/Links";
import { tracksData } from "@/lib/data";

export default function TracksPage() {
  return (
    <>
      <PageHero
        label="Tracks"
        title="Explore learning paths."
        lede="Choose a direction, then follow a clear path through courses and lessons. Learning stays lightweight and practical."
        badge="4 Tracks"
        badgeVariant="blue"
        kicker="01 / DISCOVER"
      />

      <section className="section" aria-labelledby="tracks-list-title">
        <div className="container">
          <SectionHeader number="01" label="ALL TRACKS" title="Find your path." action={<TextLink href="/courses">Browse all courses instead</TextLink>} />
          <div className="grid-2" role="list" style={{ marginTop: "32px" }}>
            {tracksData.map((track, i) => (
              <CardLink key={track.slug} href={`/tracks/${track.slug}`} className="track-card" role="listitem" style={{ minHeight: "320px" }}>
                <CardContent className="track-card-content">
                  <div className="track-card-header">
                    <span className="track-card-number">0{i + 1}</span>
                    <div className="track-card-icon" style={{ background: `${track.color}1a`, color: track.color }} aria-hidden="true">
                      {track.icon === "BookOpen" && <BookOpen size={24} />}
                      {track.icon === "Code2" && <Code2 size={24} />}
                      {track.icon === "Cloud" && <Cloud size={24} />}
                      {track.icon === "ShieldCheck" && <ShieldCheck size={24} />}
                    </div>
                  </div>
                  <h3 className="track-card-title">{track.title}</h3>
                  <p className="track-card-description">{track.description}</p>
                  <div className="track-card-meta">
                    <span>{track.coursesCount} courses</span>
                    <span>{track.duration}</span>
                  </div>
                  <div className="track-card-action">
                    <TextLink href={`/tracks/${track.slug}`} variant="default">Explore track</TextLink>
                  </div>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="how-it-works-title">
        <div className="container">
          <SectionHeader number="02" label="HOW IT WORKS" title="Simple by design." />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            <Card variant="default" className="step-card" role="listitem">
              <CardContent>
                <span className="step-number">01</span>
                <h3>Pick a Track</h3>
                <p>Choose from AI & Data, Software Development, Cloud, or Cybersecurity based on your interests.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="step-card" role="listitem">
              <CardContent>
                <span className="step-number">02</span>
                <h3>Take Courses</h3>
                <p>Progress through structured courses with short video lessons, resources, and checkpoints.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="step-card" role="listitem">
              <CardContent>
                <span className="step-number">03</span>
                <h3>Build Projects</h3>
                <p>Apply what you've learned in guided projects and showcase your work to the community.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cta-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <SectionHeader number="03" label="READY TO START" title="Your learning journey begins here." />
          <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginTop: "16px", marginBottom: "32px" }}>Pick a track and start with the first course. No prerequisites, no pressure — just practical learning.</p>
          <TextLink href="/courses" style={{ fontSize: "16px" }}>
            Browse All Courses <ArrowRight size={18} />
          </TextLink>
        </div>
      </section>
    </>
  );
}