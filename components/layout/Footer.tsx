import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/share/14sQQMH2mxJ/", Icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mccmnuegypt/", Icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/mcc_mansnu/", Icon: Instagram },
];

export async function Footer() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const homeAccountLink = user ? (profile?.role === "admin" || profile?.role === "leader" ? "/admin" : "/dashboard") : "/signup";
  const homeAccountLabel = user ? (profile?.role === "admin" || profile?.role === "leader" ? "Workspace" : "My dashboard") : "Create account";

  return <footer className="mcc-v2-footer">
    <div className="mcc-v2-footer-main">
      <div className="mcc-v2-footer-brand"><Link href="/" aria-label="MCC MNU home"><Image src="/mcc-mnu-logo.svg" alt="Microsoft Campus Club — Mansoura National University" width={228} height={54} /></Link><p>A student community for learning, building, and connecting through technology.</p><div className="mcc-v2-socials">{socials.map(({label,href,Icon}) => <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer"><Icon size={17} /></a>)}</div></div>
      <div className="mcc-v2-footer-col"><h3>Learn</h3><Link href="/courses">Courses</Link><Link href="/tracks">Learning tracks</Link><Link href="/resources">Resources</Link></div>
      <div className="mcc-v2-footer-col"><h3>Club</h3><Link href="/about">About MCC</Link><Link href="/privacy">Privacy policy</Link></div>
      <div className="mcc-v2-footer-col"><h3>Your space</h3><Link href={homeAccountLink}>{homeAccountLabel}</Link>{!user && <Link href="/login">Sign in</Link>}<Link href="/dashboard">Student dashboard</Link></div>
    </div>
    <div className="mcc-v2-footer-bottom"><span>© {new Date().getFullYear()} Microsoft Campus Club — Mansoura National University</span><span className="mcc-v2-footer-note">LEARN <i /> BUILD <i /> GROW</span><Link href="/privacy">Privacy &amp; data <ArrowUpRight size={13} /></Link></div>
  </footer>;
}
