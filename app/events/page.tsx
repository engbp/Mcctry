import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, CalendarDays, MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { eventsData, formatDate } from "@/lib/data";

export default function EventsPage() {
  const featuredEvent = eventsData.find((e) => e.featured);
  const otherEvents = eventsData.filter((e) => !e.featured);

  return (
    <>
      <PageHero
        label="Events"
        title="What's happening at MCC."
        lede="Explore community sessions, build nights, and other events. Demo content is clearly marked."
        badge={eventsData.length + " Events"}
        badgeVariant="blue"
        kicker="01 / CALENDAR"
      />

      <section className="section" aria-labelledby="featured-event-title">
        <div className="container">
          <SectionHeader number="01" label="FEATURED EVENT" title="Don't miss this." />
          {featuredEvent && (
            <CardLink href={`/events/${featuredEvent.slug}`} className="featured-event-card" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0", minHeight: "380px", background: "var(--mcc-navy-2)", color: "var(--mcc-white)", overflow: "hidden" }}>
              <div className="featured-event-date" style={{ padding: "32px", borderRight: "1px solid #2b465d", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "var(--mcc-navy-3)" }}>
                <span style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#8fd8ff", textTransform: "uppercase" }}>{formatDate(featuredEvent.date).month.toUpperCase()}</span>
                <strong style={{ fontSize: "72px", lineHeight: 1, fontWeight: 700, letterSpacing: "-0.06em", marginTop: "8px" }}>{formatDate(featuredEvent.date).day}</strong>
                <small style={{ fontSize: "12px", color: "#8ea6b7", marginTop: "8px" }}>{formatDate(featuredEvent.date).year}</small>
              </div>
              <div className="featured-event-content" style={{ padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                  <Badge variant="cyan">{featuredEvent.category}</Badge>
                  <Badge variant="demo">DEMO EVENT</Badge>
                </div>
                <h2 className="display-sm" style={{ marginBottom: "16px", lineHeight: 1.1 }}>{featuredEvent.title}</h2>
                <p className="body-lg" style={{ color: "#c5d4dd", maxWidth: "600px", marginBottom: "24px" }}>{featuredEvent.description}</p>
                <div className="featured-event-meta" style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "24px", fontSize: "14px", color: "#91b3c5" }}>
                  <span><Clock size={14} /> {featuredEvent.time}</span>
                  <span><MapPin size={14} /> {featuredEvent.location}</span>
                  <span><Users size={14} /> Open to all students</span>
                </div>
                <div className="featured-event-action">
                  <TextLink href={`/events/${featuredEvent.slug}`} variant="light" style={{ fontSize: "15px" }}>
                    View event details <ArrowRight size={18} />
                  </TextLink>
                </div>
              </div>
            </CardLink>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="upcoming-title">
        <div className="container">
          <SectionHeader number="02" label="UPCOMING EVENTS" title="More to explore." action={<TextLink href="/events">View all events</TextLink>} />
          <div className="grid-2" role="list" style={{ marginTop: "32px" }}>
            {otherEvents.map((event, i) => (
              <CardLink key={event.slug} href={`/events/${event.slug}`} className="event-card" role="listitem">
                <CardContent className="event-card-content">
                  <div className="event-card-header">
                    <Badge variant="blue">{event.category}</Badge>
                    <Badge variant="demo">Demo</Badge>
                  </div>
                  <div className="event-card-date" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ background: "var(--mcc-blue)", color: "var(--mcc-white)", padding: "12px 16px", borderRadius: "var(--radius-sm)", textAlign: "center", minWidth: "60px" }}>
                      <strong style={{ fontSize: "24px", lineHeight: 1, display: "block" }}>{formatDate(event.date).day}</strong>
                      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{formatDate(event.date).month}</span>
                    </div>
                    <div>
                      <time style={{ fontSize: "13px", fontWeight: 600, color: "var(--mcc-blue)" }}>{formatDate(event.date).day} {formatDate(event.date).month} {formatDate(event.date).year}</time>
                      <div style={{ fontSize: "12px", color: "var(--mcc-text-light)", marginTop: "2px" }}>{event.time} · {event.location}</div>
                    </div>
                  </div>
                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-description" style={{ marginTop: "8px", marginBottom: "16px" }}>{event.description}</p>
                  <div className="event-card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--mcc-line)" }}>
                    <TextLink href={`/events/${event.slug}`} variant="default">View details</TextLink>
                    <ChevronRight size={18} style={{ color: "var(--mcc-blue)" }} />
                  </div>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="past-title">
        <div className="container" style={{ textAlign: "center", maxWidth: "700px" }}>
          <SectionHeader number="03" label="PAST EVENTS" title="Missed something?" />
          <p className="body-lg" style={{ color: "var(--mcc-text-muted)", marginTop: "16px", marginBottom: "32px" }}>Event recordings, resources, and highlights from past sessions are available for MCC members.</p>
          <TextLink href="/events/past" style={{ fontSize: "16px" }}>
            Browse Past Events <ArrowRight size={18} />
          </TextLink>
        </div>
      </section>
    </>
  );
}