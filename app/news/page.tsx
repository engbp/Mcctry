import Link from "next/link";
import { ArrowRight, ArrowUpRight, Newspaper, CalendarDays } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="mcc-public-page">
      <section className="mcc-public-hero mcc-public-hero-cyan">
        <div className="container">
          <span className="mcc-section-label">COMMUNITY / NEWS & UPDATES</span>
          <h1>Keep up with<br /> <em>what&apos;s moving.</em></h1>
          <p>Official announcements, recruitment windows, event updates, and stories from the MCC MNU community — gathered in one place.</p>
          <div className="mcc-public-hero-actions"><a href="https://www.facebook.com/share/14sQQMH2mxJ/" target="_blank" rel="noreferrer" className="mcc-button mcc-button-light">Official Facebook <ArrowUpRight size={16} /></a><a href="https://www.instagram.com/mcc_mansnu?xtok=ejFyYmJlMDhtZHBy" target="_blank" rel="noreferrer" className="mcc-button mcc-button-outline">Instagram <ArrowUpRight size={16} /></a></div>
        </div>
      </section>
      <section className="section"><div className="container">
        <div className="mcc-section-heading"><div><span className="mcc-section-label">LATEST PUBLICATIONS</span><h2>Stories from the club.</h2></div></div>
        <div className="mcc-empty-public"><span className="mcc-empty-icon"><Newspaper size={22} /></span><span className="mcc-section-label">NO VERIFIED POSTS PUBLISHED HERE YET</span><h2>The next update belongs here.</h2><p>This section is ready for approved public news and announcements. Live publishing, drafts, scheduling, and timed publication require the platform&apos;s administrative publishing workflow and a connected data store.</p><Link href="/events" className="mcc-text-link">Explore listed events <ArrowRight size={16} /></Link></div>
      </div></section>
      <section className="section mcc-public-soft"><div className="container mcc-public-links"><div><CalendarDays size={22} /><h3>Recruitment windows</h3><p>Team recruitment runs in formal cycles with announced opening and closing dates.</p><Link href="/join" className="mcc-text-link">Recruitment information <ArrowRight size={16} /></Link></div><div><Newspaper size={22} /><h3>Official updates</h3><p>Until the website publishing workflow is connected, use MCC MNU&apos;s official channels for current announcements.</p><a href="https://www.linkedin.com/company/mccmnuegypt/" target="_blank" rel="noreferrer" className="mcc-text-link">MCC MNU on LinkedIn <ArrowUpRight size={16} /></a></div></div></section>
    </div>
  );
}
