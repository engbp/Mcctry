import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Home, Search } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";

const suggestions = [
  { href: "/courses", title: "Browse courses", text: "Short, focused lessons across 4 learning tracks.", icon: "hp-pillar-icon-blue" },
  { href: "/events", title: "See events", text: "Workshops, build nights, and meetups coming up.", icon: "hp-pillar-icon-cyan" },
  { href: "/projects", title: "Explore projects", text: "See what MCC students are building right now.", icon: "hp-pillar-icon-purple" },
];

export default function NotFound() {
  return (
    <>
      <BandHero
        crumbs={[{ label: "404" }]}
        kicker="CONNECT · NOT FOUND"
        title="Page not found."
        lede="The page you're looking for doesn't exist or may have moved. Head back home or pick one of the paths below."
        color="#ef4444"
        meta={<span className="band-meta-pill"><Compass size={14} /> Error 404</span>}
        icon={<Search size={56} />}
        actions={
          <>
            <Link href="/" className="band-hero-btn">
              <Home size={17} /> Back home <ArrowRight size={16} />
            </Link>
            <Link href="/join" className="band-hero-btn band-hero-btn-ghost">
              Join MCC <ArrowUpRight size={16} />
            </Link>
          </>
        }
      />

      <section className="section" aria-labelledby="nf-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">TRY ONE OF THESE</span>
              <h2 id="nf-title" className="hp-section-title">Keep exploring.</h2>
            </div>
          </div>
          <div className="hp-pillar-grid" role="list">
            {suggestions.map((item) => (
              <Link key={item.href} href={item.href} className="hp-pillar" role="listitem">
                <span className={`hp-pillar-icon ${item.icon}`}>
                  <Compass size={22} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="hp-pillar-link">
                  Open <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
