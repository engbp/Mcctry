import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Code2, Github, ExternalLink, Star, Layers, Activity, Github as GithubIcon } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { projectsData } from "@/lib/data";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/SpotlightCard";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return { title: `${project.title} — MCC MNU Projects`, description: project.description };
}

const highlights = ["Student-led initiative", "Open source", "Portfolio-ready", "MCC community project"];

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) notFound();

  const projectIndex = projectsData.findIndex((p) => p.slug === slug);
  const prevProject = projectIndex > 0 ? projectsData[projectIndex - 1] : null;
  const nextProject = projectIndex < projectsData.length - 1 ? projectsData[projectIndex + 1] : null;

  const detailCards = [
    { icon: Code2, title: "Category", main: project.category, sub: "Student project" },
    { icon: Github, title: "Repository", main: project.githubUrl ? "Available" : "Private", sub: project.githubUrl ? "Open in GitHub" : "Not public" },
    { icon: ExternalLink, title: "Live demo", main: project.demoUrl ? "Available" : "Not deployed", sub: project.demoUrl ? "Launch demo" : "Coming soon" },
    { icon: Activity, title: "Status", main: "Demo / prototype", sub: "Presentation build" },
  ];

  return (
    <>
      <BandHero
        crumbs={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
        kicker={`PROJECT · ${project.category.toUpperCase()}`}
        title={project.title}
        lede={project.description}
        color={project.color}
        meta={
          <>
            <span className="band-meta-pill"><Code2 size={14} /> {project.technologies.length} technologies</span>
            <span className="band-meta-pill"><Star size={14} /> Demo project</span>
          </>
        }
        actions={
          <>
            {project.githubUrl && (
              <Button variant="inverse" asChild>
                <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /> Repository</a>
              </Button>
            )}
            {project.demoUrl && (
              <Button variant="outline" asChild>
                <a href={project.demoUrl} target="_blank" rel="noreferrer" style={{ color: "#fff", borderColor: "rgba(255,255,255,.6)" }}>
                  <ExternalLink size={16} /> Live demo
                </a>
              </Button>
            )}
          </>
        }
        icon={<Code2 size={56} />}
      />

      <section className="section" aria-labelledby="project-details-title">
        <div className="container detail-grid">
          <div className="project-main">
            <Reveal className="lk-section-head">
              <div>
                <span className="hp-section-kicker">PROJECT OVERVIEW</span>
                <h2 id="project-details-title" className="hp-section-title">The story behind the build.</h2>
              </div>
            </Reveal>

            <div className="cm-tech-row" aria-label="Technologies">
              {project.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="lk-prose">
              <p>{project.longDescription || project.description}</p>
            </div>

            <div className="cm-highlights">
              <h3>Project highlights</h3>
              <ul>
                {highlights.map((h) => (
                  <li key={h}><Star size={16} aria-hidden="true" /> {h}</li>
                ))}
              </ul>
            </div>

            <Reveal className="lk-section-head" style={{ marginTop: "48px" }}>
              <div>
                <span className="hp-section-kicker">PROJECT DETAILS</span>
                <h2 className="hp-section-title">Technical information.</h2>
              </div>
            </Reveal>

            <Reveal className="cm-detail-grid" role="list">
              {detailCards.map((item) => (
                <SpotlightCard key={item.title} className="cm-detail-card" role="listitem">
                  <span className="cm-detail-icon"><item.icon size={21} /></span>
                  <h3>{item.title}</h3>
                  <strong>{item.main}</strong>
                  <p>{item.sub}</p>
                </SpotlightCard>
              ))}
            </Reveal>
          </div>

          <aside className="project-sidebar" aria-labelledby="related-title">
            <div className="lk-side-card" style={{ position: "sticky", top: "90px" }}>
              <h3 id="related-title">Explore more</h3>
              <div className="lk-side-navlinks" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
                {prevProject && (
                  <Link href={`/projects/${prevProject.slug}`}>
                    <ArrowRight size={14} /> Previous: {prevProject.title}
                  </Link>
                )}
                {nextProject && (
                  <Link href={`/projects/${nextProject.slug}`}>
                    <ArrowRight size={14} /> Next: {nextProject.title}
                  </Link>
                )}
                <Link href="/projects"><Layers size={14} /> View all projects</Link>
              </div>
            </div>

            <div className="lk-side-card lk-side-card-notice">
              <strong>Demo content</strong>
              <p>This is a presentation prototype. Project details, code and demos are simulated for demonstration.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
