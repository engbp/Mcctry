import Link from "next/link";
import { ArrowRight, ArrowUpRight, Trophy, Code2, Users, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/data";
import { loadStories } from "@/lib/content-views";

export const revalidate = 300;

export default async function AchievementsPage() {
  const { items: achievements } = await loadStories("achievement");

  return (
    <div className="mcc-public-page">
      <section className="mcc-public-hero mcc-public-hero-dark">
        <div className="container">
          <span className="mcc-section-label">COMMUNITY / ACHIEVEMENTS</span>
          <h1>Celebrate the<br /> <em>work behind it.</em></h1>
          <p>Projects, milestones, competition results, and community contributions deserve a place to be seen — with context and verified details.</p>
          <div className="mcc-public-hero-actions"><Link href="/projects" className="mcc-button mcc-button-light">Student projects <ArrowUpRight size={16} /></Link><Link href="/about" className="mcc-button mcc-button-outline">About MCC <ArrowUpRight size={16} /></Link></div>
        </div>
      </section>
      <section className="section"><div className="container">
        <div className="mcc-section-heading"><div><span className="mcc-section-label">VERIFIED HIGHLIGHTS</span><h2>Progress worth sharing.</h2></div></div>
        {achievements.length > 0 ? (
          <div className="mcc-public-links" role="list">
            {achievements.map((achievement) => (
              <div key={achievement.slug} role="listitem">
                <Trophy size={22} />
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <span className="mcc-section-label">{formatDate(achievement.date).full}{achievement.category ? ` · ${achievement.category}` : ""}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mcc-empty-public"><span className="mcc-empty-icon"><Trophy size={22} /></span><span className="mcc-section-label">NO VERIFIED ACHIEVEMENTS PUBLISHED HERE YET</span><h2>Make the next milestone visible.</h2><p>Verified achievements can include competition results, published projects, completed initiatives, and approved member contributions. This prototype intentionally avoids inventing awards, statistics, or results.</p><Link href="/projects" className="mcc-text-link">Browse the project showcase <ArrowRight size={16} /></Link></div>
        )}
      </div></section>
      <section className="section mcc-public-soft"><div className="container mcc-public-links"><div><Code2 size={22} /><h3>Projects</h3><p>Explore the current prototype showcase. Sample projects are labeled as demo content.</p><Link href="/projects" className="mcc-text-link">View projects <ArrowRight size={16} /></Link></div><div><Users size={22} /><h3>Community contributions</h3><p>Future profiles can recognize verified contributions without exposing private student information.</p><Link href="/teams" className="mcc-text-link">Meet the community <ArrowRight size={16} /></Link></div></div></section>
    </div>
  );
}
