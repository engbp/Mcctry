import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Globe, Layers, ExternalLink, Sparkles, Send } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { resourcesData } from "@/lib/data";

const iconMap = { BookOpen, Code2, Layers, Globe } as const;

const categories = [
  { title: "AI & Machine Learning", icon: BookOpen, count: "12 resources", color: "#0078d4" },
  { title: "Web Development", icon: Code2, count: "18 resources", color: "#00b7c3" },
  { title: "Cloud & DevOps", icon: Globe, count: "8 resources", color: "#5c2d91" },
  { title: "Design & UX", icon: Layers, count: "6 resources", color: "#ffb900" },
];

export default function ResourcesPage() {
  return (
    <>
      <BandHero
        crumbs={[{ label: "Resources" }]}
        kicker="LEARN · LIBRARY"
        title="Resources for learning and building."
        lede="A documentation-style home for useful links, tools and references — curated by the MCC MNU community."
        color="#00b7c3"
        meta={<span className="band-meta-pill"><BookOpen size={14} /> {resourcesData.length} curated resources</span>}
        icon={<BookOpen size={56} />}
      />

      <section className="section" aria-labelledby="resources-grid-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">CURATED RESOURCES</span>
              <h2 id="resources-grid-title" className="hp-section-title">Essential tools and references.</h2>
            </div>
          </div>

          <div className="cm-res-grid" role="list">
            {resourcesData.map((resource, i) => {
              const Icon = iconMap[resource.icon as keyof typeof iconMap] ?? BookOpen;
              const body = (
                <>
                  <div className="cm-res-top">
                    <span className="cm-res-icon"><Icon size={24} /></span>
                    <span className="cm-res-index">0{i + 1}</span>
                  </div>
                  <span className="cm-res-cat">{resource.category}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <span className="cm-res-cta">
                    {resource.external ? "Visit site" : "Explore"} <ArrowRight size={15} />
                    {resource.external && <ExternalLink size={13} />}
                  </span>
                </>
              );

              if (resource.external) {
                return (
                  <a key={resource.title} href={resource.link} target="_blank" rel="noreferrer" className="cm-res-card" role="listitem">
                    {body}
                  </a>
                );
              }
              return (
                <div key={resource.title} className="cm-res-card cm-res-card-soon" role="listitem">
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="categories-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">RESOURCE CATEGORIES</span>
              <h2 id="categories-title" className="hp-section-title">Browse by topic.</h2>
            </div>
          </div>
          <div className="cm-cat-grid" role="list">
            {categories.map((cat) => (
              <Link key={cat.title} href="/resources" className="cm-cat-card" role="listitem" style={{ "--track-color": cat.color } as React.CSSProperties}>
                <span className="cm-cat-icon"><cat.icon size={22} /></span>
                <h3>{cat.title}</h3>
                <p>{cat.count}</p>
                <ArrowRight size={16} className="cm-cat-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="contribute-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">CONTRIBUTE</span>
              <h2 id="contribute-title" className="hp-section-title">Help grow the library.</h2>
            </div>
          </div>
          <div className="cm-tip-grid" role="list">
            <div className="cm-tip" role="listitem">
              <span className="cm-tip-icon"><Send size={19} /></span>
              <div>
                <h3>Suggest a resource</h3>
                <p>Found a great tutorial, tool or article? Share it with the community and we&apos;ll add it to the library.</p>
              </div>
            </div>
            <div className="cm-tip" role="listitem">
              <span className="cm-tip-icon"><Sparkles size={19} /></span>
              <div>
                <h3>Create MCC resources</h3>
                <p>Help create official MCC learning materials — guides, cheat sheets, project templates, and more.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="mcc-resources-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>MCC RESOURCES</span>
            <h2 id="mcc-resources-title" className="hp-section-title" style={{ color: "#fff" }}>Coming soon: official MCC materials.</h2>
            <p>A dedicated space for MCC-approved learning paths, project templates, workshop materials and member-contributed guides.</p>
          </div>
          <Link href="/join" className="lk-cta-btn">
            Join to access <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
