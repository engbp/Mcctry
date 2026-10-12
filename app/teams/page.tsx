import Link from "next/link";
import { ArrowRight, ArrowUpRight, Users, ShieldCheck, BookOpen, UserRoundCheck } from "lucide-react";
import { loadTeams } from "@/lib/content-views";

export const revalidate = 300;

export default async function TeamsPage() {
  const { items: teams } = await loadTeams();
  return (
    <div className="mcc-public-page">
      <section className="mcc-public-hero">
        <div className="container">
          <span className="mcc-section-label">COMMUNITY / PEOPLE & TEAMS</span>
          <h1>Good work is<br /> <em>never solo.</em></h1>
          <p>MCC MNU brings together students who learn across tracks and contribute through club-wide team membership. Learning tracks and operational teams serve different purposes.</p>
          <div className="mcc-public-hero-actions"><Link href="/join" className="mcc-button mcc-button-light">Recruitment information <ArrowRight size={16} /></Link><Link href="/tracks" className="mcc-button mcc-button-outline">Explore tracks <ArrowUpRight size={16} /></Link></div>
        </div>
      </section>
      <section className="section"><div className="container">
        <div className="mcc-section-heading"><div><span className="mcc-section-label">TWO WAYS TO PARTICIPATE</span><h2>Learn in a track.<br />Contribute on a team.</h2></div></div>
        <div className="mcc-structure-grid">
          <article className="mcc-structure-card"><span><BookOpen size={23} /></span><small>LEARNING</small><h3>Learning tracks</h3><p>Students can join multiple tracks. Membership gives immediate access to that track&apos;s sessions and materials. Track leaders manage learning activity within their assigned scope.</p><Link href="/tracks" className="mcc-text-link">Browse tracks <ArrowRight size={16} /></Link></article>
          <article className="mcc-structure-card"><span><Users size={23} /></span><small>CLUB-WIDE MEMBERSHIP</small><h3>Operational teams</h3><p>Team membership is separate from track enrollment and is granted through formal recruitment. Each team member belongs to one operational team at a time.</p><Link href="/join" className="mcc-text-link">Recruitment details <ArrowRight size={16} /></Link></article>
        </div>
      </div></section>
      <section className="section mcc-public-soft"><div className="container mcc-team-governance">
        <div><span className="mcc-section-label">HOW LEADERSHIP WORKS</span><h2>Clear roles.<br /><em>Shared responsibility.</em></h2></div>
        <div className="mcc-governance-list">
          <p><ShieldCheck size={18} /><span><strong>Administrators</strong><small>Control membership promotions, assign team leaders, oversee team structure, and approve leadership appointments.</small></span></p>
          <p><UserRoundCheck size={18} /><span><strong>Operational-team leaders</strong><small>Coordinate their assigned team and recommend candidates. Their authority stays within the scope granted by administrators.</small></span></p>
          <p><Users size={18} /><span><strong>Team members</strong><small>Participate in one operational team while continuing to join multiple learning tracks as students.</small></span></p>
        </div>
      </div></section>
      {teams.length > 0 ? (
        <section className="section"><div className="container">
          <div className="mcc-section-heading"><div><span className="mcc-section-label">TEAM PROFILES</span><h2>Meet the people behind the work.</h2></div></div>
          <div className="mcc-structure-grid" role="list">
            {teams.map((team) => (
              <article className="mcc-structure-card" key={team.slug} role="listitem">
                <span><Users size={23} /></span>
                <small>OPERATIONAL TEAM</small>
                <h3>{team.name}</h3>
                <p>{team.description}</p>
              </article>
            ))}
          </div>
        </div></section>
      ) : (
        <section className="section"><div className="container mcc-empty-public"><span className="mcc-empty-icon"><Users size={22} /></span><span className="mcc-section-label">TEAM PROFILES</span><h2>Meet the people behind the work.</h2><p>Public operational-team profiles and member spotlights will appear here after MCC administrators publish verified information. No names or team rosters are invented for this prototype.</p><a className="mcc-text-link" href="https://www.linkedin.com/company/mccmnuegypt/" target="_blank" rel="noreferrer">Follow official MCC updates <ArrowUpRight size={16} /></a></div></section>
      )}
    </div>
  );
}
