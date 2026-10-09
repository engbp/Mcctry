import Link from "next/link";
import { ArrowRight, Code2, Github, ExternalLink, Rocket } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { Badge } from "@/components/ui/Badge";
import { projectsData } from "@/lib/data";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";

export default function ProjectsPage() {
  const featuredProject = projectsData.find((p) => p.featured) ?? projectsData[0];
  const otherProjects = projectsData.filter((p) => p.slug !== featuredProject.slug);

  return (
    <>
      <BandHero
        crumbs={[{ label: "Projects" }]}
        kicker="BUILD · SHOWCASE"
        title="See what students are building."
        lede="Experiments, prototypes and full products — all built by MCC MNU members. This is what learning looks like when it leaves the screen."
        color="#5c2d91"
        meta={
          <>
            <span className="band-meta-pill"><Rocket size={14} /> {projectsData.length} projects</span>
            <span className="band-meta-pill"><Code2 size={14} /> Student-built</span>
          </>
        }
        icon={<Code2 size={56} />}
      />

      <section className="section" aria-labelledby="featured-project-title">
        <div className="container">
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">FEATURED PROJECT</span>
              <h2 id="featured-project-title" className="hp-section-title">Spotlight build.</h2>
            </div>
          </Reveal>

          <SpotlightCard as="a" href={`/projects/${featuredProject.slug}`} className="cm-featured-project" style={{ "--track-color": featuredProject.color } as React.CSSProperties}>
            <div className="cm-fp-visual" aria-hidden="true">
              <div className="cm-fp-window">
                <div className="hp-window-bar">
                  <i /><i /><i />
                  <span>{featuredProject.slug}.mcc</span>
                </div>
                <div className="cm-fp-screen">
                  <span>{featuredProject.category}</span>
                  <strong>{featuredProject.title}</strong>
                  <div className="hp-project-tags">
                    {featuredProject.technologies.map((t) => <em key={t}>{t}</em>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="cm-fp-copy">
              <Badge variant="featured">FEATURED PROJECT</Badge>
              <h3>{featuredProject.title}</h3>
              <p>{featuredProject.description}</p>
              <div className="cm-fp-links">
                <span className="cm-fp-link"><Github size={15} /> Code</span>
                <span className="cm-fp-link"><ExternalLink size={15} /> Live demo</span>
              </div>
              <span className="cm-fe-cta">View project <ArrowRight size={16} /></span>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <section className="section cm-soft-section" aria-labelledby="all-projects-title">
        <div className="container">
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">ALL PROJECTS</span>
              <h2 id="all-projects-title" className="hp-section-title">More student work.</h2>
            </div>
          </Reveal>

          <Reveal className="cm-project-grid" role="list">
            {otherProjects.map((project) => (
              <SpotlightCard key={project.slug} as="a" href={`/projects/${project.slug}`} className="cm-project-card" role="listitem" style={{ "--track-color": project.color } as React.CSSProperties}>
                <div className="cm-project-media" aria-hidden="true">
                  <span className="cm-project-code">{project.slug}</span>
                  <strong>{project.title}</strong>
                </div>
                <div className="cm-project-body">
                  <div className="cm-project-tags">
                    <Badge variant="cyan">{project.category}</Badge>
                    <Badge variant="demo">Demo</Badge>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="cm-project-tech">
                    {project.technologies.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                    {project.technologies.length > 3 && <span>+{project.technologies.length - 3}</span>}
                  </div>
                  <span className="cm-event-card-cta">View details <ArrowRight size={15} /></span>
                </div>
              </SpotlightCard>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="lk-cta-band" aria-labelledby="submit-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>SHOWCASE YOUR WORK</span>
            <h2 id="submit-title" className="hp-section-title" style={{ color: "#fff" }}>Built something worth sharing?</h2>
            <p>The MCC MNU project showcase is open to all members. Submit your project for a chance to be featured.</p>
          </div>
          <Link href="/join" className="lk-cta-btn">
            Join MCC to submit <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
