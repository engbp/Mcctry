import Link from "next/link";
import { ArrowUpRight, Github, Twitter, Linkedin, Youtube, Mail, GraduationCap } from "lucide-react";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Reveal } from "@/components/fx/Reveal";

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
      <div className="footer-cta">
        <div className="footer-cta-inner">
          <Reveal className="footer-cta-copy">
            <span className="footer-cta-kicker">MCC MNU · MICROSOFT CAMPUS CLUB</span>
            <ScrambleText as="h2" className="footer-cta-title" text="Ready to learn, build and connect?" />
            <p className="footer-cta-lede">Join a student community that turns ideas into working projects.</p>
          </Reveal>
          <div className="footer-cta-actions">
            <MagneticButton>
              <Link href="/join" className="footer-cta-btn footer-cta-btn-solid">
                Join MCC <ArrowUpRight size={17} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/courses" className="footer-cta-btn footer-cta-btn-ghost">
                Explore courses <ArrowUpRight size={17} />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <Reveal className="container footer-grid">
          <div className="footer-brand-section">
            <Link className="footer-brand" href="/">
              <span className="brand-logo" aria-hidden="true"><GraduationCap size={20} /></span>
              MCC <span>MNU</span>
            </Link>
            <p>Microsoft Campus Club · Mansoura National University</p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="footer-social-link" aria-label={social.label}>
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Learn" className="footer-col">
            <h3>LEARN</h3>
            {footerLinks.learn.map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </nav>

          <nav aria-label="Build" className="footer-col">
            <h3>BUILD</h3>
            {footerLinks.build.map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </nav>

          <nav aria-label="Connect" className="footer-col">
            <h3>CONNECT</h3>
            {footerLinks.connect.map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </nav>
        </Reveal>

        <div className="container footer-bottom">
          <span>© MCC MNU · Presentation prototype</span>
          <span>Demo content is clearly marked where applicable.</span>
        </div>
      </div>
    </footer>
  );
}
