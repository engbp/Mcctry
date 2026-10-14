import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Globe, Layers, ExternalLink } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { loadResources } from "@/lib/content-views";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";

export const revalidate = 300;

const iconMap = { BookOpen, Code2, Layers, Globe } as const;

export default async function ResourcesPage() {
  const { items: loadedResources } = await loadResources();
  const resources = loadedResources.filter((resource) => Boolean(resource.link.trim()));

  return (
    <>
      <BandHero
        crumbs={[{ label: "Resources" }]}
        kicker="LEARN · LIBRARY"
        title="Resources for learning and building."
        lede="Curated links and references used by the MCC MNU community."
        color="#00b7c3"
        meta={<span className="band-meta-pill"><BookOpen size={14} /> {resources.length} curated resources</span>}
        icon={<BookOpen size={56} />}
      />

      <section className="section" aria-labelledby="resources-grid-title">
        <div className="container">
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">CURATED RESOURCES</span>
              <h2 id="resources-grid-title" className="hp-section-title">Essential tools and references.</h2>
            </div>
          </Reveal>

          {resources.length === 0 ? (
            <div className="mcc-empty-public">
              <span className="mcc-empty-icon"><BookOpen size={22} /></span>
              <span className="mcc-section-label">NO RESOURCES PUBLISHED YET</span>
              <h2>No resources are published yet.</h2>
              <p>Resources published by MCC administrators will appear here.</p>
              <Link href="/courses" className="mcc-text-link">Browse courses <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <Reveal className="cm-res-grid" role="list">
              {resources.map((resource, i) => {
                const Icon = iconMap[resource.icon as keyof typeof iconMap] ?? BookOpen;
                const body = (
                  <>
                    <div className="cm-res-top">
                      <span className="cm-res-icon"><Icon size={24} /></span>
                      <span className="cm-res-index">0{i + 1}</span>
                    </div>
                    {resource.category && <span className="cm-res-cat">{resource.category}</span>}
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
                    <SpotlightCard key={resource.slug ?? resource.title} as="a" href={resource.link} target="_blank" rel="noreferrer" className="cm-res-card" role="listitem">
                      {body}
                    </SpotlightCard>
                  );
                }
                return (
                  <SpotlightCard key={resource.slug ?? resource.title} as="a" href={resource.link} className="cm-res-card" role="listitem">
                    {body}
                  </SpotlightCard>
                );
              })}
            </Reveal>
          )}
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="mcc-resources-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>KEEP LEARNING</span>
            <h2 id="mcc-resources-title" className="hp-section-title" style={{ color: "#fff" }}>Put these resources to work.</h2>
            <p>Explore the published courses and learning tracks connected to your interests.</p>
          </div>
          <Link href="/courses" className="lk-cta-btn">
            Explore courses <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
