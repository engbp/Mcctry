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
  { number: "02", icon: "BookOpen" as IconName, title: "Practical Learning", description: "Courses and workshops focus on applicable skills. Short, focused lessons let you learn at your own pace and immediately apply what you've learned." },
  { number: "03", icon: "Code2" as IconName, title: "Build Real Things", description: "Theory meets practice in our project showcases. Students build portfolio-worthy projects that solve real problems." },
  { number: "04", icon: "Lightbulb" as IconName, title: "Innovation Mindset", description: "We encourage experimentation and creative problem-solving. Hackathons, build nights, and open challenges push boundaries." },
  { number: "05", icon: "Target" as IconName, title: "Industry Connections", description: "Through Microsoft and partner networks, we provide access to mentors, cloud credits, certifications, and career opportunities." },
  { number: "06", icon: "Heart" as IconName, title: "Inclusive Culture", description: "Everyone belongs here. Regardless of background, experience level, or major — if you're curious about technology, you're welcome." },
];

const team = [
  { role: "Student Leads", description: "Elected student representatives who steer MCC direction, organize events, and advocate for member needs.", icon: "Users" as IconName, color: "#0078d4" },
  { role: "Faculty Advisors", description: "University faculty who provide guidance, resources, and institutional support for MCC initiatives.", icon: "BookOpen" as IconName, color: "#00b7c3" },
  { role: "Microsoft Mentors", description: "Industry professionals from Microsoft who offer technical guidance, career insights, and program support.", icon: "Code2" as IconName, color: "#8c52ff" },
  { role: "Alumni Network", description: "Graduated MCC members who return as mentors, speakers, and connectors to industry opportunities.", icon: "Heart" as IconName, color: "#ffb900" },
];

const stats = [
  { value: "150+", label: "Active members" },
  { value: "47", label: "Projects completed" },
  { value: "28", label: "Events hosted" },
  { value: "2,400+", label: "Learning hours" },
];

const timeline = [
  { year: "2022", title: "Foundation", text: "MCC MNU established at Mansoura National University" },
  { year: "2023", title: "First Tracks", text: "AI & Data and Software Development tracks launched" },
  { year: "2024", title: "Growth", text: "Cloud and Cybersecurity tracks added; first hackathon" },
  { year: "2025", title: "Platform", text: "Learning platform, project showcase, and community hub" },
  { year: "2026", title: "Today", text: "4 tracks, 30+ courses, regular events, active projects" },
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
            <span className="band-meta-pill"><Users size={14} /> 150+ members</span>
            <span className="band-meta-pill"><Sparkles size={14} /> Since 2022</span>
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
                MCC MNU operates as a student-led organization with support from faculty advisors
                and Microsoft. This structure ensures student voice drives decisions while
                maintaining institutional stability.
              </p>
              <p>
                Leadership roles rotate annually, giving more students the opportunity to develop
                organizational and leadership skills alongside their technical growth.
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
              <h2 id="history-title" className="hp-section-title">From idea to community.</h2>
            </div>
          </Reveal>

          <Reveal className="cm-story">
            <div className="cm-story-copy">
              <h3>How it started</h3>
              <p>MCC MNU began with a simple observation: students wanted a space to learn technology together, not alone. A small group approached Microsoft&apos;s Campus Club program with a vision for a community that would be visually distinctive, technically rigorous, and genuinely welcoming.</p>
              <p>The first events were modest — a few laptops in a classroom, some pizza, and a lot of curiosity. But the energy was real. Students showed up, stayed late, and brought friends.</p>
              <h3>Where we&apos;re going</h3>
              <p>We&apos;re expanding our curriculum, deepening industry partnerships, and building more ways for students to showcase their work. The next chapter is being written by the current members — and it&apos;s open to you.</p>
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
