import Link from "next/link";
import { ArrowRight, Github, Twitter, Linkedin, Youtube, Mail } from "lucide-react";

const footerLinks = {
  learn: [
    { label: "All Courses", href: "/courses" },
    { label: "Learning Tracks", href: "/tracks" },
    { label: "Resources", href: "/resources" },
  ],
  build: [
    { label: "Student Projects", href: "/projects" },
    { label: "Events & Workshops", href: "/events" },
    { label: "Opportunities", href: "/opportunities" },
  ],
  connect: [
    { label: "About MCC", href: "/about" },
    { label: "Join MCC", href: "/join" },
    { label: "Student Dashboard", href: "/demo/dashboard" },
  ],
};

const socialLinks = [
  { label: "GitHub", href: "#", icon: Github },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "Email", href: "#", icon: Mail },
];

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-grid">
        <div className="footer-brand-section">
          <div className="footer-brand">
            MCC <span>MNU</span>
          </div>
          <p>Microsoft Campus Club · Mansoura National University</p>
          <div className="footer-social" style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} className="footer-social-link" aria-label={social.label} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", border: "1px solid var(--mcc-line)", borderRadius: "var(--radius-sm)", color: "var(--mcc-text-light)", transition: "all var(--transition-fast)" }}>
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Learn">
          <h3>LEARN</h3>
          {footerLinks.learn.map((link) => (
            <Link key={link.label} href={link.href}>{link.label}</Link>
          ))}
        </nav>

        <nav aria-label="Build">
          <h3>BUILD</h3>
          {footerLinks.build.map((link) => (
            <Link key={link.label} href={link.href}>{link.label}</Link>
          ))}
        </nav>

        <nav aria-label="Connect">
          <h3>CONNECT</h3>
          {footerLinks.connect.map((link) => (
            <Link key={link.label} href={link.href}>{link.label}</Link>
          ))}
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>© MCC MNU · Presentation prototype</span>
        <span>Demo content is clearly marked where applicable.</span>
      </div>
    </footer>
  );
}