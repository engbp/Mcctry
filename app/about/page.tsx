import Link from "next/link";
import { ArrowRight, Users, BookOpen, Code2, Lightbulb, Target, Heart, CheckCircle, Rocket, Sparkles } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";

type IconName = "Users" | "BookOpen" | "Code2" | "Lightbulb" | "Target" | "Heart" | "CheckCircle";

const iconComponents: Record<IconName, React.ComponentType<{ size?: number }>> = {
  Users, BookOpen, Code2, Lightbulb, Target, Heart, CheckCircle,
};

const values = [
  { number: "01", icon: "Users" as IconName, title: "Community First", description: "The best learning happens together. MCC MNU connects students across disciplines to share knowledge, collaborate on projects, and build lasting relationships." },
  { number: "02", icon: "BookOpen" as IconName, title: "Practical Learning", description: "Tracks organize sessions and learning materials into practical paths. Students can join multiple tracks and access each track after enrollment." },
  { number: "03", icon: "Code2" as IconName, title: "Build Real Things", description: "Theory meets practice in our project showcases. Students build portfolio-worthy projects that solve real problems." },
  { number: "04", icon: "Lightbulb" as IconName, title: "Innovation Mindset", description: "We encourage experimentation and creative problem-solving. Hackathons, build nights, and open challenges push boundaries." },
  { number: "05", icon: "Target" as IconName, title: "Industry Connections", description: "Explore official announcements and opportunities as they are published. Any partner programs, credits, certifications, or mentorship offers should be listed only when confirmed." },
  { number: "06", icon: "Heart" as IconName, title: "Inclusive Culture", description: "Everyone belongs here. Regardless of background, experience level, or major — if you're curious about technology, you're welcome." },
];

const team = [
  { role: "Administrators", description: "Manage club-wide membership, recruitment decisions, team structure, and platform-wide settings.", icon: "Users" as IconName, color: "#0078d4" },
  { role: "Track Leaders", description: "Manage sessions, assignments, attendance, and learning activities within their assigned tracks.", icon: "BookOpen" as IconName, color: "#00b7c3" },
  { role: "Operational-Team Leaders", description: "Coordinate their assigned team, manage day-to-day work, and recommend candidates without independently granting membership.", icon: "Code2" as IconName, color: "#8c52ff" },
  { role: "Team Members", description: "Contribute through one operational team while remaining free to join multiple learning tracks.", icon: "Heart" as IconName, color: "#ffb900" },
];

const stats = [
  { value: "Learn", label: "Explore technology" },
  { value: "Build", label: "Make projects" },
  { value: "Connect", label: "Meet the community" },
  { value: "Share", label: "Show what you learn" },
];

const timeline = [
  { year: "01", title: "Explore", text: "Discover technology topics and public community events." },
  { year: "02", title: "Learn", text: "Join learning tracks and access sessions and materials." },
  { year: "03", title: "Build", text: "Apply what you learn through projects and practical work." },
  { year: "04", title: "Connect", text: "Meet students and take part in the wider community." },
  { year: "05", title: "Contribute", text: "Apply during official recruitment cycles to join an operational team." },
];

export default function AboutPage() {
  return (
    <>
      <BandHero
        crumbs={[{ label: "About" }]}
        kicker="CONNECT · IDENTITY"
        title="More than a club."
        lede="MCC MNU is a student technology community focused on learning, building and connecting — with a visual identity as distinctive as the work its members create."
        color="#0078d4"
        meta={
          <>
            <span className="band-meta-pill"><Users size={14} /> Student community</span>
            <span className="band-meta-pill"><Sparkles size={14} /> Learn · Build · Connect</span>
          </>
        }
        icon={<Users size={56} />}
      />

      <section className="section" aria-labelledby="values-title">
        <div className="container">
<Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">OUR VALUES</span>
              <h2 id="values-title" className="hp-section-title">What drives us.</h2>
            </div>
          </Reveal>
          <Reveal className="lk-steps lk-steps-6" role="list">
            {values.map((value, i) => {
              const Icon = iconComponents[value.icon];
              return (
                <div key={value.title} className="lk-step" role="listitem" style={{ ["--track-color" as string]: ["#0078d4", "#00b7c3", "#8c52ff", "#ffb900", "#10b981", "#ef4444"][i] } as React.CSSProperties}>
                  <span className="lk-step-number">{value.number}</span>
                  <span className="lk-step-icon"><Icon size={24} /></span>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="hp-stats" aria-label="MCC impact">
        <div className="container hp-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="hp-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="structure-title">
        <div className="container">
<Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">COMMUNITY STRUCTURE</span>
              <h2 id="structure-title" className="hp-section-title">How we&apos;re organized.</h2>
            </div>
          </Reveal>

          <div className="cm-about-structure">
            <div className="cm-about-copy">
              <p>
                MCC MNU brings students together through learning tracks, events, projects, and club-wide team membership. Track enrollment and operational-team membership are separate so students can learn across multiple areas.
              </p>
              <p>
                Administrators manage team promotions and appoint operational-team leaders. Leaders coordinate within their assigned scope, while members can nominate replacements when a leadership position becomes vacant.
              </p>
            </div>
            <Reveal className="cm-team-grid" role="list">
              {team.map((member) => {
                const Icon = iconComponents[member.icon];
                return (
                  <SpotlightCard key={member.role} className="cm-team-card" role="listitem" style={{ "--track-color": member.color } as React.CSSProperties}>
                    <span className="cm-team-icon"><Icon size={22} /></span>
                    <h3>{member.role}</h3>
                    <p>{member.description}</p>
                  </SpotlightCard>
                );
              })}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="history-title">
        <div className="container">
<Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">OUR STORY</span>
              <h2 id="history-title" className="hp-section-title">Learn. Build. Connect.</h2>
            </div>
          </Reveal>

          <Reveal className="cm-story">
            <div className="cm-story-copy">
              <h3>How to participate</h3>
              <p>Start by exploring the public tracks, events, and student-project showcase. Track enrollment gives students access to that track&apos;s sessions and learning materials, and students can participate in more than one track at a time.</p>
              <h3>How to contribute</h3>
              <p>Club-wide team membership is handled through formal recruitment cycles. Administrators make final selection and promotion decisions, then assign each team member to one operational team. Graduates may remain active team members with administrator approval.</p>
            </div>
            <ol className="cm-timeline" aria-label="MCC MNU timeline">
              {timeline.map((item) => (
                <li key={item.year} className="cm-timeline-item">
                  <span className="cm-timeline-year">{item.year}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="join-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>BE PART OF IT</span>
            <h2 id="join-title" className="hp-section-title" style={{ color: "#fff" }}>Ready to join?</h2>
            <p>The best way to understand MCC MNU is to participate. Attend an event, start a course, or propose a project.</p>
          </div>
          <Link href="/join" className="lk-cta-btn">
            Join MCC MNU <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
