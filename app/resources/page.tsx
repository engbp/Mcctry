import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Globe, Layers, ExternalLink } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { loadResources } from "@/lib/content-views";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";

export const revalidate = 300;

const iconMap = { BookOpen, Code2, Layers, Globe } as const;

export default async function ResourcesPage() {
  const { items: resources } = await loadResources();

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
              <h2>The library is being restocked.</h2>
              <p>Approved links, tools and references will appear here once administrators publish them.</p>
              <Link href="/join" className="mcc-text-link">Join MCC MNU <ArrowRight size={16} /></Link>
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
                  <SpotlightCard key={resource.slug ?? resource.title} className="cm-res-card cm-res-card-soon" role="listitem">
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
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>MCC RESOURCES</span>
            <h2 id="mcc-resources-title" className="hp-section-title" style={{ color: "#fff" }}>More materials on the way.</h2>
            <p>Official MCC learning materials will be published here as they are ready.</p>
          </div>
          <Link href="/join" className="lk-cta-btn">
            Join MCC <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
