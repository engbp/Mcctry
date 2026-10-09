import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, BookOpen, Code2, Globe, Layers, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { resourcesData } from "@/lib/data";

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        label="Resources"
        title="Resources for learning and building."
        lede="A documentation-style place for useful links, tools, and references. Curated by the MCC MNU community."
        badge={resourcesData.length + " Resources"}
        badgeVariant="blue"
        kicker="01 / LIBRARY"
      />

      <section className="section" aria-labelledby="resources-grid-title">
        <div className="container">
          <SectionHeader number="01" label="CURATED RESOURCES" title="Essential tools and references." />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            {resourcesData.map((resource, i) => (
              <CardLink key={resource.title} href={resource.link} className="resource-card" role="listitem" external={resource.external} style={{ minHeight: "280px" }}>
                <CardContent className="resource-card-content">
                  <div className="resource-card-header">
                    <Badge variant="blue">{resource.category}</Badge>
                    <span className="resource-card-number">0{i + 1}</span>
                  </div>
                  <div className="resource-card-icon" aria-hidden="true" style={{ width: "56px", height: "56px", background: "var(--mcc-paper)", border: "1px solid var(--mcc-line)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: "var(--mcc-blue)" }}>
                    {resource.category === "Learning" && <BookOpen size={24} />}
                    {resource.category === "Development" && <Code2 size={24} />}
                    {resource.category === "Design" && <Layers size={24} />}
                    {resource.category === "MCC MNU" && <Globe size={24} />}
                  </div>
                  <h3 className="resource-card-title">{resource.title}</h3>
                  <p className="resource-card-description">{resource.description}</p>
                  <div className="resource-card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--mcc-line)", marginTop: "auto" }}>
                    <TextLink href={resource.link} variant="default" external={resource.external}>
                      {resource.external ? "Visit Site" : "Explore"} <ArrowRight size={16} />
                    </TextLink>
                    {resource.external && <ExternalLink size={16} style={{ color: "var(--mcc-text-light)" }} />}
                  </div>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="categories-title">
        <div className="container">
          <SectionHeader number="02" label="RESOURCE CATEGORIES" title="Browse by topic." />
          <div className="grid-4" role="list" style={{ marginTop: "32px" }}>
            {[
              { title: "AI & Machine Learning", icon: BookOpen, count: "12 resources", href: "/resources/ai" },
              { title: "Web Development", icon: Code2, count: "18 resources", href: "/resources/web" },
              { title: "Cloud & DevOps", icon: Globe, count: "8 resources", href: "/resources/cloud" },
              { title: "Design & UX", icon: Layers, count: "6 resources", href: "/resources/design" },
            ].map((cat, i) => (
              <CardLink key={cat.title} href={cat.href} className="category-card" role="listitem">
                <CardContent className="category-card-content">
                  <div className="category-icon" aria-hidden="true" style={{ width: "48px", height: "48px", background: "var(--mcc-blue)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--mcc-white)", marginBottom: "16px" }}>
                    <cat.icon size={22} />
                  </div>
                  <h3>{cat.title}</h3>
                  <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>{cat.count}</p>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="contribute-title">
        <div className="container" style={{ maxWidth: "800px" }}>
          <SectionHeader number="03" label="CONTRIBUTE" title="Help grow the library." />
          <div className="grid-2" style={{ marginTop: "32px", gap: "24px" }}>
            <Card variant="default" className="contribute-card">
              <CardContent>
                <h3>Suggest a Resource</h3>
                <p>Found a great tutorial, tool, or article? Share it with the community and we'll add it to the library.</p>
                <TextLink href="/join" variant="default" style={{ marginTop: "16px", display: "inline-flex" }}>
                  Submit a Resource <ArrowRight size={16} />
                </TextLink>
              </CardContent>
            </Card>
            <Card variant="default" className="contribute-card">
              <CardContent>
                <h3>Create MCC Resources</h3>
                <p>Help create official MCC learning materials — guides, cheat sheets, project templates, and more.</p>
                <TextLink href="/join" variant="default" style={{ marginTop: "16px", display: "inline-flex" }}>
                  Become a Contributor <ArrowRight size={16} />
                </TextLink>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-navy)", color: "var(--mcc-white)" }} aria-labelledby="mcc-resources-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <SectionHeader number="04" label="MCC RESOURCES" title="Coming soon: Official MCC materials." dark />
          <p className="body-lg" style={{ color: "#d9e5ed", marginTop: "16px", marginBottom: "32px" }}>A dedicated space for MCC-approved learning paths, project templates, workshop materials, and member-contributed guides.</p>
          <TextLink href="/join" variant="light" style={{ fontSize: "16px", padding: "16px 24px" }}>
            Join to Access <ArrowRight size={18} />
          </TextLink>
        </div>
      </section>
    </>
  );
}