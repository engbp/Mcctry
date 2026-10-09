import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, ArrowLeft, Code2, Github, ExternalLink, Star, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { projectsData } from "@/lib/data";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — MCC MNU Projects`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) notFound();

  const projectIndex = projectsData.findIndex((p) => p.slug === slug);
  const prevProject = projectIndex > 0 ? projectsData[projectIndex - 1] : null;
  const nextProject = projectIndex < projectsData.length - 1 ? projectsData[projectIndex + 1] : null;

  return (
    <>
      <PageHero
        label="Projects"
        title={project.title}
        lede={project.description}
        badge={`${project.category} · Demo Project`}
        badgeVariant="cyan"
        kicker="01 / PROJECT"
        visual={
          <div className="project-hero-visual" aria-hidden="true" style={{ background: "var(--mcc-navy-2)", borderRadius: "var(--radius-md)", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div className="project-scanline" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#00c7e82b 1px,transparent 1px),linear-gradient(#00c7e82b 1px,transparent 1px); background-size: 55px 55px;" }} />
            <div className="project-browser" style={{ width: "80%", height: "70%", background: "#f6f7f8", boxShadow: "0 20px 45px rgba(0,0,0,.35)", transform: "rotate(-2deg)", borderRadius: "var(--radius-sm)", overflow: "hidden", position: "relative", zIndex: 1 }}>
              <div className="browser-bar" style={{ height: "36px", background: "#e8eaec", display: "flex", alignItems: "center", gap: "6px", padding: "0 12px", color: "#555", fontSize: "10px" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <i style={{ width: "7px", height: "7px", background: "#d13438", borderRadius: "50%" }} />
                  <i style={{ width: "7px", height: "7px", background: "#ffb900", borderRadius: "50%" }} />
                  <i style={{ width: "7px", height: "7px", background: "#107c10", borderRadius: "50%" }} />
                </div>
                <span style={{ marginLeft: "auto" }}>{project.slug}.mcc.mnu</span>
              </div>
              <div className="browser-body" style={{ height: "calc(100% - 36px)", background: "#0c2332", position: "relative", overflow: "hidden" }}>
                <div className="vision-grid" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#50e6ff 1px,transparent 1px),linear-gradient(#50e6ff 1px,transparent 1px); background-size: 40px 40px; opacity: .28" }} />
                <div className="vision-panel" style={{ position: "absolute", left: "9%", bottom: "10%", padding: "20px", background: "var(--mcc-blue)", color: "#fff", width: "54%", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <small style={{ fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{project.category}</small>
                  <strong style={{ fontSize: "24px", fontWeight: 400 }}>{project.title}</strong>
                  <span style={{ fontSize: "12px" }}>{project.technologies.join(" · ")}</span>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="project-details-title">
        <div className="container detail-grid">
          <div className="project-main">
            <SectionHeader number="01" label="PROJECT OVERVIEW" title="The story behind the build." />
            <div className="project-overview" style={{ marginTop: "24px" }}>
              <div className="project-meta" style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" }}>
                <Badge variant="cyan">{project.category}</Badge>
                <Badge variant="demo">Demo Project</Badge>
                {project.githubUrl && <TextLink href={project.githubUrl} variant="default" external><Github size={14} /> Repository</TextLink>}
                {project.demoUrl && <TextLink href={project.demoUrl} variant="default" external><ExternalLink size={14} /> Live Demo</TextLink>}
              </div>

              <div className="project-tech" style={{ marginBottom: "32px" }}>
                <h3 style={{ marginBottom: "12px" }}>Technologies</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {project.technologies.map((tech) => (
                    <span key={tech} style={{ fontSize: "13px", padding: "6px 12px", background: "var(--mcc-paper)", border: "1px solid var(--mcc-line)", color: "var(--mcc-text)", borderRadius: "var(--radius-sm)" }}>{tech}</span>
                  ))}
                </div>
              </div>

              <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginBottom: "24px" }}>{project.longDescription || project.description}</p>

              <div style={{ padding: "24px", background: "var(--mcc-paper)", borderRadius: "var(--radius-md)" }}>
                <h3 style={{ marginBottom: "12px" }}>Project Highlights</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><Star size={16} style={{ color: "var(--mcc-accent-yellow)" }} /> Student-led initiative</li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><Star size={16} style={{ color: "var(--mcc-accent-yellow)" }} /> Open source</li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><Star size={16} style={{ color: "var(--mcc-accent-yellow)" }} /> Portfolio-ready</li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><Star size={16} style={{ color: "var(--mcc-accent-yellow)" }} /> MCC community project</li>
                </ul>
              </div>
            </div>

            <SectionHeader number="02" label="PROJECT DETAILS" title="Technical information." style={{ marginTop: "48px" }} />
            <div className="project-details" style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <Card variant="default" className="detail-item">
                <CardContent>
                  <div className="detail-icon" aria-hidden="true"><Code2 size={24} /></div>
                  <h3>Category</h3>
                  <p>{project.category}</p>
                </CardContent>
              </Card>
              <Card variant="default" className="detail-item">
                <CardContent>
                  <div className="detail-icon" aria-hidden="true"><Github size={24} /></div>
                  <h3>Repository</h3>
                  <p>{project.githubUrl ? "Available" : "Private"}</p>
                </CardContent>
              </Card>
              <Card variant="default" className="detail-item">
                <CardContent>
                  <div className="detail-icon" aria-hidden="true"><ExternalLink size={24} /></div>
                  <h3>Live Demo</h3>
                  <p>{project.demoUrl ? "Available" : "Not deployed"}</p>
                </CardContent>
              </Card>
              <Card variant="default" className="detail-item">
                <CardContent>
                  <div className="detail-icon" aria-hidden="true"><Star size={24} /></div>
                  <h3>Status</h3>
                  <p>Demo / Prototype</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className="project-sidebar" aria-labelledby="related-title">
            <Card variant="default" className="sidebar-card" style={{ position: "sticky", top: "90px" }}>
              <CardContent>
                <h3 id="related-title" style={{ fontSize: "22px", fontWeight: 600, marginBottom: "12px" }}>Explore More</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {prevProject && (
                    <CardLink href={`/projects/${prevProject.slug}`} className="related-project-link" style={{ display: "flex", gap: "12px", padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--mcc-paper)", border: "1px solid var(--mcc-line)" }}>
                      <div className="related-project-icon" style={{ width: "48px", height: "48px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)" }}>
                        <Code2 size={20} />
                      </div>
                      <div>
                        <span className="micro" style={{ color: "var(--mcc-text-light)" }}>Previous Project</span>
                        <h4 style={{ marginTop: "4px", marginBottom: "2px" }}>{prevProject.title}</h4>
                        <p className="body-sm" style={{ color: "var(--mcc-text-muted)", margin: 0 }}>{prevProject.technologies.slice(0, 2).join(" · ")}</p>
                      </div>
                    </CardLink>
                  )}
                  {nextProject && (
                    <CardLink href={`/projects/${nextProject.slug}`} className="related-project-link" style={{ display: "flex", gap: "12px", padding: "12px", borderRadius: "var(--radius-sm)", background: "var(--mcc-paper)", border: "1px solid var(--mcc-line)" }}>
                      <div className="related-project-icon" style={{ width: "48px", height: "48px", background: "var(--mcc-cyan)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "#03121f" }}>
                        <Code2 size={20} />
                      </div>
                      <div>
                        <span className="micro" style={{ color: "var(--mcc-text-light)" }}>Next Project</span>
                        <h4 style={{ marginTop: "4px", marginBottom: "2px" }}>{nextProject.title}</h4>
                        <p className="body-sm" style={{ color: "var(--mcc-text-muted)", margin: 0 }}>{nextProject.technologies.slice(0, 2).join(" · ")}</p>
                      </div>
                    </CardLink>
                  )}
                  <TextLink href="/projects" variant="default" style={{ display: "block", marginTop: "8px", padding: "12px", textAlign: "center" }}>
                    View All Projects <ArrowRight size={16} />
                  </TextLink>
                </div>
              </CardContent>
            </Card>

            <Card variant="default" className="sidebar-card" style={{ marginTop: "24px", borderLeft: "3px solid var(--mcc-accent-yellow)", background: "#fff8e1" }}>
              <CardContent>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ flexShrink: 0, color: "var(--mcc-accent-yellow)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <strong style={{ display: "block", marginBottom: "4px" }}>Demo Content</strong>
                    <p className="body-sm" style={{ color: "#5d4a00", margin: 0 }}>This is a presentation prototype. Project details, code, and demos are simulated for demonstration.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}