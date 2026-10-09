import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, ArrowLeft, CalendarDays, MapPin, Clock, Users, Share2, CheckCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { eventsData, formatDate } from "@/lib/data";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = eventsData.find((e) => e.slug === slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} — MCC MNU`,
    description: event.description,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = eventsData.find((e) => e.slug === slug);
  if (!event) notFound();

  const eventIndex = eventsData.findIndex((e) => e.slug === slug);
  const prevEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;

  return (
    <>
      <PageHero
        label="Events"
        title={event.title}
        lede={event.description}
        badge={`${event.category} · ${formatDate(event.date).day} ${formatDate(event.date).month} ${formatDate(event.date).year}`}
        badgeVariant="cyan"
        kicker="01 / EVENT"
        visual={
          <div className="event-hero-visual" aria-hidden="true" style={{ background: "var(--mcc-navy-2)", borderRadius: "var(--radius-md)", minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px", position: "relative", overflow: "hidden" }}>
            <div className="event-hero-pattern" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(0,199,232,.08) 1px,transparent 1px),linear-gradient(rgba(0,199,232,.08) 1px,transparent 1px); background-size: 60px 60px;" }} />
            <div className="event-hero-poster" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.15em", display: "block", marginBottom: "8px", color: "var(--mcc-cyan)" }}>{event.category.toUpperCase()}</span>
              <strong style={{ fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 0.9, fontWeight: 800, letterSpacing: "-0.05em" }}>
                {event.title.toUpperCase().split(" ").join("<br />")}
              </strong>
              <small style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", display: "block", marginTop: "12px", color: "var(--mcc-cyan)" }}>MCC MNU</small>
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="event-details-title">
        <div className="container detail-grid">
          <div className="event-main">
            <SectionHeader number="01" label="EVENT DETAILS" title="Everything you need to know." />
            <div className="event-details" style={{ marginTop: "24px" }}>
              <div className="event-detail-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginBottom: "32px" }}>
                <Card variant="default" className="detail-item">
                  <CardContent>
                    <div className="detail-icon" aria-hidden="true"><CalendarDays size={24} /></div>
                    <h3>Date & Time</h3>
                    <p>{formatDate(event.date).day} {formatDate(event.date).month} {formatDate(event.date).year}</p>
                    <p>{event.time}</p>
                  </CardContent>
                </Card>
                <Card variant="default" className="detail-item">
                  <CardContent>
                    <div className="detail-icon" aria-hidden="true"><MapPin size={24} /></div>
                    <h3>Location</h3>
                    <p>{event.location}</p>
                    <p style={{ fontSize: "13px", color: "var(--mcc-text-light)" }}>In-person event</p>
                  </CardContent>
                </Card>
                <Card variant="default" className="detail-item">
                  <CardContent>
                    <div className="detail-icon" aria-hidden="true"><Users size={24} /></div>
                    <h3>Audience</h3>
                    <p>All MNU students welcome</p>
                    <p style={{ fontSize: "13px", color: "var(--mcc-text-light)" }}>No prerequisites</p>
                  </CardContent>
                </Card>
                <Card variant="default" className="detail-item">
                  <CardContent>
                    <div className="detail-icon" aria-hidden="true"><Share2 size={24} /></div>
                    <h3>Category</h3>
                    <p><Badge variant="blue">{event.category}</Badge></p>
                    <p style={{ fontSize: "13px", color: "var(--mcc-text-light)" }}>{event.demo ? "Demo Event" : "Official Event"}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="event-description" style={{ padding: "24px", background: "var(--mcc-paper)", borderRadius: "var(--radius-md)" }}>
                <h3 style={{ marginBottom: "12px" }}>About This Event</h3>
                <p className="body" style={{ color: "var(--mcc-text-muted)", margin: 0 }}>{event.description}</p>
                <p className="body" style={{ color: "var(--mcc-text-muted)", marginTop: "16px", margin: 0 }}>This is a demo event for presentation purposes. Actual event details, speakers, agenda, and registration will be confirmed closer to the date.</p>
              </div>

              <SectionHeader number="02" label="AGENDA" title="What's happening." style={{ marginTop: "48px" }} />
              <div className="agenda" style={{ marginTop: "24px" }}>
                <Card variant="default" className="agenda-item">
                  <CardContent style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, width: "60px", textAlign: "center" }}>
                      <strong style={{ fontSize: "18px", display: "block" }}>18:00</strong>
                      <span style={{ fontSize: "11px", color: "var(--mcc-text-light)" }}>ARRIVAL</span>
                    </div>
                    <div>
                      <h4>Welcome & Introductions</h4>
                      <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>Meet fellow attendees, overview of the evening</p>
                    </div>
                  </CardContent>
                </Card>
                <Card variant="default" className="agenda-item" style={{ marginTop: "12px" }}>
                  <CardContent style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, width: "60px", textAlign: "center" }}>
                      <strong style={{ fontSize: "18px", display: "block" }}>18:30</strong>
                      <span style={{ fontSize: "11px", color: "var(--mcc-text-light)" }}>MAIN</span>
                    </div>
                    <div>
                      <h4>Build Session: From Idea to Prototype</h4>
                      <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>Hands-on workshop with guided exercises</p>
                    </div>
                  </CardContent>
                </Card>
                <Card variant="default" className="agenda-item" style={{ marginTop: "12px" }}>
                  <CardContent style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, width: "60px", textAlign: "center" }}>
                      <strong style={{ fontSize: "18px", display: "block" }}>20:30</strong>
                      <span style={{ fontSize: "11px", color: "var(--mcc-text-light)" }}>SHARE</span>
                    </div>
                    <div>
                      <h4>Demo & Networking</h4>
                      <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>Show what you built, connect with others</p>
                    </div>
                  </CardContent>
                </Card>
                <Card variant="default" className="agenda-item" style={{ marginTop: "12px" }}>
                  <CardContent style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, width: "60px", textAlign: "center" }}>
                      <strong style={{ fontSize: "18px", display: "block" }}>21:00</strong>
                      <span style={{ fontSize: "11px", color: "var(--mcc-text-light)" }}>CLOSE</span>
                    </div>
                    <div>
                      <h4>Wrap Up</h4>
                      <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>Next steps, upcoming events, stay connected</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <aside className="event-sidebar" aria-labelledby="register-title">
            <Card variant="default" className="sidebar-card" style={{ position: "sticky", top: "90px" }}>
              <CardContent>
                <h3 id="register-title" style={{ fontSize: "22px", fontWeight: 600, marginBottom: "8px" }}>Register for This Event</h3>
                <p className="body-sm" style={{ color: "var(--mcc-text-muted)", marginBottom: "20px" }}>Spots are limited. Reserve your place now.</p>
                <Button variant="primary" asChild size="lg" style={{ width: "100%", marginBottom: "12px" }}>
                  <Link href="/join">Reserve Spot <ArrowRight size={18} /></Link>
                </Button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button variant="secondary" size="sm" style={{ flex: 1 }}>Add to Calendar</Button>
                  <Button variant="ghost" size="sm" aria-label="Share event"><Share2 size={16} /></Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="default" className="sidebar-card" style={{ marginTop: "24px" }}>
              <CardContent>
                <h3 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "12px" }}>What to Bring</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle size={16} style={{ color: "var(--mcc-accent-green)" }} /> Laptop (recommended)</li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle size={16} style={{ color: "var(--mcc-accent-green)" }} /> Curiosity & ideas</li>
                  <li style={{ display: "flex", alignItems: "center", gap: "10px" }}><CheckCircle size={16} style={{ color: "var(--mcc-accent-green)" }} /> Willingness to build</li>
                </ul>
              </CardContent>
            </Card>

            {prevEvent && (
              <CardLink href={`/events/${prevEvent.slug}`} className="sidebar-card" style={{ marginTop: "24px" }}>
                <CardContent>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>Previous Event</span>
                  <h3 style={{ marginTop: "8px", marginBottom: "4px" }}>{prevEvent.title}</h3>
                  <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>{formatDate(prevEvent.date).day} {formatDate(prevEvent.date).month}</p>
                </CardContent>
              </CardLink>
            )}
            {nextEvent && (
              <CardLink href={`/events/${nextEvent.slug}`} className="sidebar-card" style={{ marginTop: "12px" }}>
                <CardContent>
                  <span className="micro" style={{ color: "var(--mcc-text-light)" }}>Next Event</span>
                  <h3 style={{ marginTop: "8px", marginBottom: "4px" }}>{nextEvent.title}</h3>
                  <p className="body-sm" style={{ color: "var(--mcc-text-muted)" }}>{formatDate(nextEvent.date).day} {formatDate(nextEvent.date).month}</p>
                </CardContent>
              </CardLink>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}