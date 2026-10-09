import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, Code2, Github, ExternalLink, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { projectsData } from "@/lib/data";

export default function ProjectsPage() {
  const featuredProject = projectsData.find((p) => p.featured);
  const otherProjects = projectsData.filter((p) => !p.featured);

  return (
    <>
      <PageHero
        label="Projects"
        title="See what students are building."
        lede="A developer-showcase view for student projects, experiments, and prototypes. All projects are built by MCC MNU members."
        badge={projectsData.length + " Projects"}
        badgeVariant="blue"
        kicker="01 / SHOWCASE"
      />

      <section className="section" aria-labelledby="featured-project-title">
        <div className="container">
          <SectionHeader number="01" label="FEATURED PROJECT" title="Spotlight build." />
          {featuredProject && (
            <CardLink href={`/projects/${featuredProject.slug}`} className="featured-project-card" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "0", minHeight: "480px", background: "var(--mcc-navy-2)", color: "var(--mcc-white)", overflow: "hidden" }}>
              <div className="featured-project-media" style={{ position: "relative", background: "#0c334c", overflow: "hidden" }}>
                <div className="project-scanline" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#00c7e82b 1px,transparent 1px),linear-gradient(#00c7e82b 1px,transparent 1px); background-size: 55px 55px;" }} />
                <div className="project-ui" style={{ position: "absolute", left: "10%", bottom: "12%", width: "54%", padding: "24px", background: "var(--mcc-blue)", display: "flex", flexDirection: "column", gap: "7px", boxShadow: "15px 18px 0 #03111d" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{featuredProject.category}</span>
                  <strong style={{ fontSize: "38px", fontWeight: 500 }}>{featuredProject.title}</strong>
                  <small style={{ fontSize: "10px", color: "#d7f4ff" }}>{featuredProject.technologies.join(" · ")}</small>
                </div>
                <div className="project-corner" style={{ position: "absolute", right: "5%", top: "7%", fontSize: "10px", color: "#8ed9f0", letterSpacing: "0.1em" }}>MCC / 04</div>
              </div>
              <div className="featured-project-content" style={{ padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Badge variant="featured" style={{ marginBottom: "14px" }}>FEATURED PROJECT</Badge>
                <h2 className="display-sm" style={{ marginBottom: "14px", lineHeight: 1.05 }}>{featuredProject.title}</h2>
                <p className="body-lg" style={{ color: "#c3d1da", maxWidth: "430px", marginBottom: "28px" }}>{featuredProject.description}</p>
                <div className="featured-project-tech" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
                  {featuredProject.technologies.map((tech) => (
                    <span key={tech} style={{ fontSize: "13px", padding: "5px 9px", border: "1px solid #53677b", color: "#d9e6f1", borderRadius: "var(--radius-sm)" }}>{tech}</span>
                  ))}
                </div>
                <div className="featured-project-links" style={{ display: "flex", gap: "12px" }}>
                  <TextLink href={featuredProject.githubUrl || "#"} variant="light" external={!!featuredProject.githubUrl}>
                    <Github size={16} /> Code
                  </TextLink>
                  <TextLink href={featuredProject.demoUrl || "#"} variant="light" external={!!featuredProject.demoUrl}>
                    <ExternalLink size={16} /> Live Demo
                  </TextLink>
                </div>
              </div>
            </CardLink>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="all-projects-title">
        <div className="container">
          <SectionHeader number="02" label="ALL PROJECTS" title="More student work." action={<TextLink href="/projects">View all projects</TextLink>} />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            {otherProjects.map((project, i) => (
              <CardLink key={project.slug} href={`/projects/${project.slug}`} className="project-card" role="listitem" style={{ minHeight: "420px" }}>
                <CardContent className="project-card-content">
                  <div className="project-card-media" aria-hidden="true" style={{ background: project.color ? `linear-gradient(135deg, ${project.color}20, ${project.color}05)` : "var(--mcc-paper)", position: "relative", overflow: "hidden" }}>
                    <div className="project-card-media-bg" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,120,212,.1) 0%, rgba(0,199,232,.1) 100%)" }} />
                    <div className="project-card-overlay" style={{ position: "absolute", inset: 0, background: "rgba(5, 11, 24, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity var(--transition-base)" }}>
                      <TextLink href={`/projects/${project.slug}`} variant="light" style={{ fontSize: "15px" }}>
                        View Project <ArrowRight size={18} />
                      </TextLink>
                    </div>
                    <div className="project-card-media-pattern" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,120,212,.06) 1px,transparent 1px),linear-gradient(rgba(0,120,212,.06) 1px,transparent 1px); background-size: 40px 40px;" }} />
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-header">
                      <Badge variant="cyan">{project.category}</Badge>
                      <Badge variant="demo">Demo</Badge>
                    </div>
                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-description">{project.description}</p>
                    <div className="project-card-tech" style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px", marginBottom: "16px" }}>
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} style={{ fontSize: "11px", padding: "4px 8px", border: "1px solid var(--mcc-line)", color: "var(--mcc-text-muted)", borderRadius: "var(--radius-sm)" }}>{tech}</span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span style={{ fontSize: "11px", padding: "4px 8px", border: "1px solid var(--mcc-line)", color: "var(--mcc-text-muted)", borderRadius: "var(--radius-sm)" }}>+{project.technologies.length - 3} more</span>
                      )}
                    </div>
                    <div className="project-card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--mcc-line)" }}>
                      <TextLink href={`/projects/${project.slug}`} variant="default">View details</TextLink>
                      <ChevronRight size={18} style={{ color: "var(--mcc-blue)" }} />
                    </div>
                  </div>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="submit-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <SectionHeader number="03" label="SHOWCASE YOUR WORK" title="Built something worth sharing?" />
          <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginTop: "16px", marginBottom: "32px" }}>MCC MNU project showcase is open to all members. Submit your project for a chance to be featured.</p>
          <TextLink href="/join" style={{ fontSize: "16px" }}>
            Join MCC to Submit <ArrowRight size={18} />
          </TextLink>
        </div>
      </section>
    </>
  );
}