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
  { number: "03", icon: "Code2" as IconName, title: "Build Real Things", description: "Theory meets practice when students apply what they learn to real problems and practical work." },
  { number: "04", icon: "Lightbulb" as IconName, title: "Innovation Mindset", description: "We encourage experimentation and creative problem-solving. Hackathons, build nights, and open challenges push boundaries." },
  { number: "05", icon: "Target" as IconName, title: "Industry Connections", description: "External programs and learning opportunities are shared only when details are confirmed and relevant to students." },
  { number: "06", icon: "Heart" as IconName, title: "Inclusive Culture", description: "Everyone belongs here. Regardless of background, experience level, or major — if you're curious about technology, you're welcome." },
];

const team = [
  { role: "Administrators", description: "Manage user roles, learning content, and platform-wide settings.", icon: "Users" as IconName, color: "#0078d4" },
  { role: "Track Leaders", description: "Manage learning tracks, courses, video lessons, and resources within their assigned tracks.", icon: "BookOpen" as IconName, color: "#00b7c3" },
];

const stats = [
  { value: "Learn", label: "Explore technology" },
  { value: "Build", label: "Make projects" },
  { value: "Connect", label: "Meet the community" },
  { value: "Share", label: "Show what you learn" },
];

const timeline = [
  { year: "01", title: "Explore", text: "Discover technology topics and published learning tracks." },
  { year: "02", title: "Learn", text: "Join learning tracks and access sessions and materials." },
  { year: "03", title: "Build", text: "Apply what you learn through projects and practical work." },
  { year: "04", title: "Connect", text: "Use community resources and learn alongside other students." },
  { year: "05", title: "Contribute", text: "Share what you learn and help others solve practical problems." },
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
                MCC MNU brings students together through published learning tracks, video courses, and shared resources. Students can explore multiple areas and keep track of their own learning progress.
              </p>
              <p>
                Administrators manage user roles and track assignments. Track leaders can edit learning content and resources only within the tracks assigned to them.
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
              <p>Start by exploring the published tracks and courses. Follow video lessons, save your progress, and use the resources published alongside learning content.</p>
              <h3>How to contribute</h3>
              <p>Administrators manage platform roles and assign track leaders. Track leaders focus on keeping learning content useful, organized, and up to date.</p>
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
            <h2 id="join-title" className="hp-section-title" style={{ color: "#fff" }}>Ready to start learning?</h2>
            <p>Explore a course, follow a learning track, or start with a trusted resource.</p>
          </div>
          <Link href="/courses" className="lk-cta-btn">
            Explore courses <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
