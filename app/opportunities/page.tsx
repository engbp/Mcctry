import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Award, Target, Clock, Trophy, Lightbulb, Users, Rocket } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { opportunitiesData, formatDate } from "@/lib/data";

const types = [
  { icon: Award, title: "Hackathons", text: "Intensive build events where teams create projects in 24–48 hours. Great for learning, networking, and prizes." },
  { icon: Target, title: "Competitions", text: "Structured challenges with specific goals, judging criteria, and rewards. Often sponsored by industry partners." },
  { icon: Clock, title: "Programs", text: "Multi-week learning programs, fellowships and incubators that provide mentorship, resources, and funding." },
];

const tips = [
  { icon: Rocket, title: "Start early", text: "Applications often require proposals, portfolios or essays. Give yourself time to prepare quality submissions." },
  { icon: Lightbulb, title: "Build in public", text: "Share your progress on GitHub, LinkedIn or the MCC community. Visible work speaks louder than credentials." },
  { icon: Users, title: "Team up", text: "Most opportunities welcome teams. Find complementary skills in the MCC community — designers, developers, researchers." },
  { icon: Target, title: "Ask for feedback", text: "Before submitting, get your application reviewed by peers or mentors. Fresh eyes catch gaps you might miss." },
];

export default function OpportunitiesPage() {
  return (
    <>
      <BandHero
        crumbs={[{ label: "Opportunities" }]}
        kicker="BUILD · DIRECTORY"
        title="Find your next opportunity."
        lede="Challenges, competitions, hackathons and community programs — curated for MCC MNU students. Demo content is clearly marked."
        color="#0078d4"
        meta={<span className="band-meta-pill"><Trophy size={14} /> {opportunitiesData.length} open opportunities</span>}
        icon={<Trophy size={56} />}
      />

      <section className="section" aria-labelledby="opportunities-list-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">CURRENT OPPORTUNITIES</span>
              <h2 id="opportunities-list-title" className="hp-section-title">Open for applications.</h2>
            </div>
          </div>

          <div className="hp-opp-grid" role="list">
            {opportunitiesData.map((opp) => (
              <Link key={opp.slug} href="/opportunities" className="hp-opp-card" role="listitem" style={{ "--track-color": opp.color } as React.CSSProperties}>
                <span className="hp-opp-type">{opp.type}</span>
                <h3>{opp.title}</h3>
                <p>{opp.description}</p>
                <div className="hp-opp-meta">
                  <CalendarDays size={15} />
                  <span>Deadline {formatDate(opp.deadline).day} {formatDate(opp.deadline).month}</span>
                  <ArrowUpRight size={15} style={{ marginLeft: "auto" }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="categories-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">OPPORTUNITY TYPES</span>
              <h2 id="categories-title" className="hp-section-title">Ways to get involved.</h2>
            </div>
          </div>
          <div className="lk-steps" role="list">
            {types.map((type, i) => (
              <div key={type.title} className="lk-step" role="listitem" style={{ ["--track-color" as string]: ["#0078d4", "#00b7c3", "#8c52ff"][i] } as React.CSSProperties}>
                <span className="lk-step-number">0{i + 1}</span>
                <span className="lk-step-icon"><type.icon size={24} /></span>
                <h3>{type.title}</h3>
                <p>{type.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tips-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">TIPS</span>
              <h2 id="tips-title" className="hp-section-title">Make the most of opportunities.</h2>
            </div>
          </div>
          <div className="cm-tip-grid" role="list">
            {tips.map((tip) => (
              <div key={tip.title} className="cm-tip" role="listitem">
                <span className="cm-tip-icon"><tip.icon size={19} /></span>
                <div>
                  <h3>{tip.title}</h3>
                  <p>{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="stay-updated-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>STAY UPDATED</span>
            <h2 id="stay-updated-title" className="hp-section-title" style={{ color: "#fff" }}>Never miss an opportunity.</h2>
            <p>New opportunities are added regularly. Join MCC MNU to get notified about deadlines, new programs and member-exclusive opportunities.</p>
          </div>
          <Link href="/join" className="lk-cta-btn">
            Join MCC MNU <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
