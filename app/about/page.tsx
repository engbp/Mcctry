import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink } from "@/components/ui/Links";
import { ArrowRight, Users, BookOpen, Code2, Lightbulb, Target, Heart, ChevronRight, CheckCircle } from "lucide-react";
import { Card, CardContent, FeatureCard, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type IconName = "Users" | "BookOpen" | "Code2" | "Lightbulb" | "Target" | "Heart" | "CheckCircle";

const iconComponents: Record<IconName, React.ComponentType<{ size?: number }>> = {
  Users,
  BookOpen,
  Code2,
  Lightbulb,
  Target,
  Heart,
  CheckCircle,
};

const values = [
  { number: "01", icon: "Users" as IconName, title: "Community First", description: "We believe the best learning happens together. MCC MNU connects students across disciplines to share knowledge, collaborate on projects, and build lasting relationships." },
  { number: "02", icon: "BookOpen" as IconName, title: "Practical Learning", description: "Our courses and workshops focus on applicable skills. Short, focused lessons let you learn at your own pace and immediately apply what you've learned." },
  { number: "03", icon: "Code2" as IconName, title: "Build Real Things", description: "Theory meets practice in our project showcases. Students build portfolio-worthy projects that solve real problems and demonstrate technical competence." },
  { number: "04", icon: "Lightbulb" as IconName, title: "Innovation Mindset", description: "We encourage experimentation and creative problem-solving. Hackathons, build nights, and open challenges push boundaries." },
  { number: "05", icon: "Target" as IconName, title: "Industry Connections", description: "Through Microsoft and partner networks, we provide access to mentors, cloud credits, certifications, and career opportunities." },
  { number: "06", icon: "Heart" as IconName, title: "Inclusive Culture", description: "Everyone belongs here. Regardless of background, experience level, or major — if you're curious about technology, you're welcome." },
];

const team = [
  { role: "Student Leads", description: "Elected student representatives who steer MCC direction, organize events, and advocate for member needs.", icon: "Users" as IconName },
  { role: "Faculty Advisors", description: "University faculty who provide guidance, resources, and institutional support for MCC initiatives.", icon: "BookOpen" as IconName },
  { role: "Microsoft Mentors", description: "Industry professionals from Microsoft who offer technical guidance, career insights, and program support.", icon: "Code2" as IconName },
  { role: "Alumni Network", description: "Graduated MCC members who return as mentors, speakers, and connectors to industry opportunities.", icon: "Heart" as IconName },
];

const stats = [
  { label: "Active Members", value: "150+", icon: "Users" as IconName, trend: { value: "23% this semester", positive: true } },
  { label: "Projects Completed", value: "47", icon: "Code2" as IconName, trend: { value: "12 this year", positive: true } },
  { label: "Events Hosted", value: "28", icon: "Lightbulb" as IconName, trend: { value: "8 upcoming", positive: true } },
  { label: "Learning Hours", value: "2,400+", icon: "BookOpen" as IconName, trend: { value: "340 this month", positive: true } },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        title="More than a club."
        lede="MCC MNU is a student technology community experience focused on learning, building, and connecting. This page presents our identity, values, and structure."
        badge="MCC MNU"
        badgeVariant="blue"
        kicker="01 / IDENTITY"
      />

      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <SectionHeader number="01" label="OUR VALUES" title="What drives us." />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            {values.map((value) => {
              const IconComponent = iconComponents[value.icon];
              return (
                <FeatureCard 
                  key={value.title} 
                  number={value.number}
                  icon={<IconComponent size={28} />}
                  title={value.title}
                  description={value.description}
                  className="value-card"
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="impact-title">
        <div className="container">
          <SectionHeader number="02" label="OUR IMPACT" title="Numbers that matter." />
          <div className="grid-4" role="list" style={{ marginTop: "32px" }}>
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="structure-title">
        <div className="container">
          <SectionHeader number="03" label="COMMUNITY STRUCTURE" title="How we're organized." />
          <div className="grid-2-uneven" style={{ gap: "48px", marginTop: "32px" }}>
            <div>
              <p className="body-lg" style={{ marginBottom: "24px" }}>MCC MNU operates as a student-led organization with support from faculty advisors and Microsoft. This structure ensures student voice drives decisions while maintaining institutional stability.</p>
              <p className="body" style={{ color: "var(--mcc-text-muted)" }}>Leadership roles rotate annually, giving more students the opportunity to develop organizational and leadership skills alongside their technical growth.</p>
            </div>
            <div className="grid-2" role="list">
              {team.map((member) => {
                const IconComponent = iconComponents[member.icon];
                return (
                  <Card key={member.role} variant="default" className="team-card" role="listitem">
                    <CardContent>
                      <div className="team-card-icon" aria-hidden="true" style={{ width: "48px", height: "48px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)", marginBottom: "16px" }}>
                        <IconComponent size={22} />
                      </div>
                      <h3 className="team-card-title">{member.role}</h3>
                      <p className="team-card-description">{member.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="history-title">
        <div className="container">
          <SectionHeader number="04" label="OUR STORY" title="From idea to community." />
          <div className="grid-2-uneven" style={{ gap: "48px", marginTop: "32px", alignItems: "start" }}>
            <div className="story-content">
              <h3 className="heading-md" style={{ marginBottom: "16px" }}>How it started</h3>
              <p className="body" style={{ color: "var(--mcc-text-muted)", marginBottom: "24px" }}>MCC MNU began with a simple observation: students wanted a space to learn technology together, not alone. A small group approached Microsoft's Campus Club program with a vision for a community that would be visually distinctive, technically rigorous, and genuinely welcoming.</p>
              <p className="body" style={{ color: "var(--mcc-text-muted)", marginBottom: "24px" }}>The first events were modest — a few laptops in a classroom, some pizza, and a lot of curiosity. But the energy was real. Students showed up, stayed late, and brought friends.</p>
              <h3 className="heading-md" style={{ marginBottom: "16px", marginTop: "32px" }}>Where we are</h3>
              <p className="body" style={{ color: "var(--mcc-text-muted)", marginBottom: "24px" }}>Today, MCC MNU runs multiple learning tracks, hosts regular workshops and build nights, showcases student projects, and connects members to global opportunities. The community has grown, but the core remains: students learning from students, building together.</p>
              <h3 className="heading-md" style={{ marginBottom: "16px", marginTop: "32px" }}>Where we're going</h3>
              <p className="body" style={{ color: "var(--mcc-text-muted)" }}>We're expanding our curriculum, deepening industry partnerships, and building more ways for students to showcase their work. The next chapter is being written by the current members — and it's open to you.</p>
            </div>
            <div className="story-visual" aria-hidden="true">
              <div className="story-timeline">
                <div className="timeline-item">
                  <span className="timeline-year">2022</span>
                  <h4>Foundation</h4>
                  <p>MCC MNU established at Mansoura National University</p>
                </div>
                <div className="timeline-item">
                  <span className="timeline-year">2023</span>
                  <h4>First Tracks</h4>
                  <p>AI & Data, Software Development tracks launched</p>
                </div>
                <div className="timeline-item">
                  <span className="timeline-year">2024</span>
                  <h4>Growth</h4>
                  <p>Cloud and Cybersecurity tracks added; first hackathon</p>
                </div>
                <div className="timeline-item">
                  <span className="timeline-year">2025</span>
                  <h4>Platform</h4>
                  <p>Learning platform, project showcase, and community hub</p>
                </div>
                <div className="timeline-item">
                  <span className="timeline-year">2026</span>
                  <h4>Today</h4>
                  <p>4 tracks, 30+ courses, regular events, active projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-navy)", color: "var(--mcc-white)" }} aria-labelledby="join-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
          <SectionHeader number="05" label="BE PART OF IT" title="Ready to join?" dark />
          <p className="body-lg" style={{ color: "#d9e5ed", marginTop: "16px", marginBottom: "32px" }}>The best way to understand MCC MNU is to participate. Attend an event, start a course, or propose a project.</p>
          <TextLink href="/join" variant="light" style={{ fontSize: "16px", padding: "16px 24px" }}>
            Join MCC MNU <ArrowRight size={18} />
          </TextLink>
        </div>
      </section>
    </>
  );
}