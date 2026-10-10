import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail, GraduationCap } from "lucide-react";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Reveal } from "@/components/fx/Reveal";

const footerLinks = {
  discover: [
    { label: "Learning Tracks", href: "/tracks" },
    { label: "Courses & Resources", href: "/courses" },
    { label: "Events & Workshops", href: "/events" },
  ],
  community: [
    { label: "People & Teams", href: "/teams" },
    { label: "Student Projects", href: "/projects" },
    { label: "Achievements", href: "/achievements" },
  ],
  updates: [
    { label: "News & Updates", href: "/news" },
    { label: "About MCC", href: "/about" },
    { label: "Recruitment", href: "/join" },
    { label: "Admin Workspace (Demo)", href: "/demo/admin" },
  ],
};

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/share/14sQQMH2mxJ/", icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mccmnuegypt/", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/mcc_mansnu?xtok=ejFyYmJlMDhtZHBy", icon: Instagram },
];

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-cta">
        <div className="footer-cta-inner">
          <Reveal className="footer-cta-copy">
            <span className="footer-cta-kicker">MCC MNU · MICROSOFT CAMPUS CLUB</span>
            <ScrambleText as="h2" className="footer-cta-title" text="Curiosity is a good place to start." />
            <p className="footer-cta-lede">Explore the tracks, meet the community, and find your next thing to build.</p>
          </Reveal>
          <div className="footer-cta-actions">
            <MagneticButton><Link href="/tracks" className="footer-cta-btn footer-cta-btn-solid">Explore tracks <ArrowUpRight size={17} /></Link></MagneticButton>
            <MagneticButton><Link href="/join" className="footer-cta-btn footer-cta-btn-ghost">Recruitment info <ArrowUpRight size={17} /></Link></MagneticButton>
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
                <a key={social.label} href={social.href} className="footer-social-link" aria-label={social.label} target="_blank" rel="noreferrer">
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <nav key={group} aria-label={group} className="footer-col">
              <h3>{group.toUpperCase()}</h3>
              {links.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
            </nav>
          ))}
        </Reveal>
        <div className="container footer-bottom">
          <span>© MCC MNU · Community platform preview</span>
          <span>Sample content is labeled. Live accounts and publishing need backend integration.</span>
        </div>
      </div>
    </footer>
  );
}
