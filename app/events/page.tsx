import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Clock, Users, Sparkles } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/data";
import { loadEvents } from "@/lib/content-views";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";

export const revalidate = 300;

export default async function EventsPage() {
  const { items: events } = await loadEvents();
  const featuredEvent = events.find((e) => e.featured) ?? events[0] ?? null;
  const otherEvents = featuredEvent ? events.filter((e) => e.slug !== featuredEvent.slug) : [];
  const fd = featuredEvent ? formatDate(featuredEvent.date) : null;

  return (
    <>
      <BandHero
        crumbs={[{ label: "Events" }]}
        kicker="CONNECT · CALENDAR"
        title="What's happening at MCC."
        lede="Community sessions, build nights and hands-on workshops. Meet people, make things, share what you learn."
        color="#00b7c3"
        meta={
          <>
            <span className="band-meta-pill"><CalendarDays size={14} /> {events.length} upcoming events</span>
            <span className="band-meta-pill"><Users size={14} /> Open to all students</span>
          </>
        }
        icon={<CalendarDays size={56} />}
      />

      {events.length === 0 || !featuredEvent || !fd ? (
        <section className="section" aria-labelledby="featured-event-title">
          <div className="container">
            <div className="mcc-empty-public">
              <span className="mcc-empty-icon"><CalendarDays size={22} /></span>
              <span className="mcc-section-label">NO EVENTS PUBLISHED YET</span>
              <h2>The next event belongs here.</h2>
              <p>Upcoming MCC sessions, build nights and workshops will appear here once administrators publish them.</p>
              <Link href="/join" className="mcc-text-link">Join MCC MNU <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      ) : (
        <>
      <section className="section" aria-labelledby="featured-event-title">
        <div className="container">
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">FEATURED EVENT</span>
              <h2 id="featured-event-title" className="hp-section-title">Don&apos;t miss this.</h2>
            </div>
          </Reveal>

          <SpotlightCard as="a" href={`/events/${featuredEvent.slug}`} className="cm-featured-event">
            <div className="cm-fe-date" aria-hidden="true">
              <span>{fd.month}</span>
              <strong>{fd.day}</strong>
              <small>{fd.year}</small>
            </div>
            <div className="cm-fe-copy">
              <div className="cm-fe-tags">
                <Badge variant="cyan">{featuredEvent.category}</Badge>
                {featuredEvent.demo && <Badge variant="demo">DEMO EVENT</Badge>}
              </div>
              <h3>{featuredEvent.title}</h3>
              <p>{featuredEvent.description}</p>
              <div className="cm-fe-meta">
                <span><Clock size={15} /> {featuredEvent.time}</span>
                <span><MapPin size={15} /> {featuredEvent.location}</span>
              </div>
              <span className="cm-fe-cta">View event details <ArrowRight size={16} /></span>
            </div>
            <span className="cm-fe-arrow" aria-hidden="true"><ArrowRight size={26} /></span>
          </SpotlightCard>
        </div>
      </section>

      <section className="section cm-soft-section" aria-labelledby="upcoming-title">
        <div className="container">
          <Reveal className="lk-section-head">
            <div>
              <span className="hp-section-kicker">UPCOMING EVENTS</span>
              <h2 id="upcoming-title" className="hp-section-title">More to explore.</h2>
            </div>
          </Reveal>

          <Reveal className="cm-event-grid" role="list">
            {otherEvents.map((event) => {
              const d = formatDate(event.date);
              return (
                <SpotlightCard key={event.slug} as="a" href={`/events/${event.slug}`} className="cm-event-card" role="listitem" style={{ "--track-color": event.color } as React.CSSProperties}>
                  <div className="cm-event-card-top">
                    <span className="cm-event-tile">
                      <strong>{d.day}</strong>
                      <small>{d.month}</small>
                    </span>
                    <span className="cm-event-cat">{event.category}</span>
                  </div>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="cm-event-card-meta">
                    <span><Clock size={13} /> {event.time}</span>
                    <span><MapPin size={13} /> {event.location}</span>
                  </div>
                  <span className="cm-event-card-cta">View details <ArrowRight size={15} /></span>
                </SpotlightCard>
              );
            })}
          </Reveal>
        </div>
      </section>
        </>
      )}

      <section className="lk-cta-band" aria-labelledby="past-title">
        <div className="container lk-cta-inner">
          <div>
            <span className="hp-section-kicker" style={{ color: "var(--mcc-cyan)" }}>PAST EVENTS</span>
            <h2 id="past-title" className="hp-section-title" style={{ color: "#fff" }}>Missed something?</h2>
            <p>Event recordings, resources and highlights from past sessions are available for MCC members.</p>
          </div>
          <Link href="/join" className="lk-cta-btn">
            Join to access <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
