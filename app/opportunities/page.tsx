import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, CalendarDays, Award, Target, ChevronRight, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { opportunitiesData, formatDate } from "@/lib/data";

export default function OpportunitiesPage() {
  return (
    <>
      <PageHero
        label="Opportunities"
        title="Find your next opportunity."
        lede="A curated directory for challenges, competitions, hackathons, and community opportunities. Demo content is clearly marked."
        badge={opportunitiesData.length + " Opportunities"}
        badgeVariant="blue"
        kicker="01 / DIRECTORY"
      />

      <section className="section" aria-labelledby="opportunities-list-title">
        <div className="container">
          <SectionHeader number="01" label="CURRENT OPPORTUNITIES" title="Open for applications." />
          <div className="opportunities-list" role="list" style={{ marginTop: "24px" }}>
            {opportunitiesData.map((opp, i) => (
              <CardLink key={opp.slug} href="/opportunities" className="opportunity-row" role="listitem" style={{ display: "grid", gridTemplateColumns: "40px 1.5fr 0.7fr 0.5fr 40px", gap: "18px", alignItems: "center", padding: "24px 16px", borderBottom: "1px solid var(--mcc-line)", transition: "background var(--transition-fast)" }}>
                <span style={{ fontSize: "10px", color: "#7c8d96", fontWeight: 800 }}>0{i + 1}</span>
                <div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <Badge variant="blue">{opp.type}</Badge>
                    <Badge variant="demo">Demo</Badge>
                  </div>
                  <h3 style={{ fontSize: "19px", fontWeight: 600, marginBottom: "4px" }}>{opp.title}</h3>
                  <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>{opp.description}</p>
                </div>
                <time style={{ fontSize: "12px", color: "#5c707c", fontWeight: 600 }}>{formatDate(opp.date).day} {formatDate(opp.date).month} {formatDate(opp.date).year}</time>
                <span style={{ fontSize: "12px", color: "#5c707c" }}>Deadline: {formatDate(opp.deadline).day} {formatDate(opp.deadline).month}</span>
                <ArrowRight className="arrow-icon" size={16} style={{ color: "var(--mcc-blue)" }} />
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="categories-title">
        <div className="container">
          <SectionHeader number="02" label="OPPORTUNITY TYPES" title="Ways to get involved." />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            <Card variant="default" className="type-card" role="listitem">
              <CardContent>
                <div className="type-icon" aria-hidden="true"><Award size={28} /></div>
                <h3>Hackathons</h3>
                <p>Intensive build events where teams create projects in 24-48 hours. Great for learning, networking, and prizes.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="type-card" role="listitem">
              <CardContent>
                <div className="type-icon" aria-hidden="true"><Target size={28} /></div>
                <h3>Competitions</h3>
                <p>Structured challenges with specific goals, judging criteria, and rewards. Often sponsored by industry partners.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="type-card" role="listitem">
              <CardContent>
                <div className="type-icon" aria-hidden="true"><Clock size={28} /></div>
                <h3>Programs</h3>
                <p>Multi-week learning programs, fellowships, and incubators that provide mentorship, resources, and funding.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tips-title">
        <div className="container" style={{ maxWidth: "800px" }}>
          <SectionHeader number="03" label="TIPS" title="Make the most of opportunities." />
          <div className="grid-2" style={{ marginTop: "32px" }}>
            <Card variant="default" className="tip-card">
              <CardContent>
                <h3>Start Early</h3>
                <p>Applications often require project proposals, portfolios, or essays. Give yourself time to prepare quality submissions.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="tip-card">
              <CardContent>
                <h3>Build in Public</h3>
                <p>Share your progress on GitHub, LinkedIn, or the MCC community. Visible work speaks louder than credentials alone.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="tip-card">
              <CardContent>
                <h3>Team Up</h3>
                <p>Most opportunities welcome teams. Find complementary skills in the MCC community — designers, developers, researchers.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="tip-card">
              <CardContent>
                <h3>Ask for Feedback</h3>
                <p>Before submitting, get your application reviewed by peers or mentors. Fresh eyes catch gaps you might miss.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-navy)", color: "var(--mcc-white)" }} aria-labelledby="stay-updated-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <SectionHeader number="04" label="STAY UPDATED" title="Never miss an opportunity." dark />
          <p className="body-lg" style={{ color: "#d9e5ed", marginTop: "16px", marginBottom: "32px" }}>New opportunities are added regularly. Join MCC MNU to get notified about deadlines, new programs, and exclusive member opportunities.</p>
          <TextLink href="/join" variant="light" style={{ fontSize: "16px", padding: "16px 24px" }}>
            Join MCC MNU <ArrowRight size={18} />
          </TextLink>
        </div>
      </section>
    </>
  );
}