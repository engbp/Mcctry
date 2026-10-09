import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Clock, Users, Share2, CheckCircle, Ticket, NotebookPen } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { eventsData, formatDate } from "@/lib/data";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/SpotlightCard";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = eventsData.find((e) => e.slug === slug);
  if (!event) return { title: "Event Not Found" };
  return { title: `${event.title} — MCC MNU`, description: event.description };
}

const agenda = [
  { time: "18:00", tag: "ARRIVAL", title: "Welcome & Introductions", text: "Meet fellow attendees, overview of the evening" },
  { time: "18:30", tag: "MAIN", title: "Build Session: From Idea to Prototype", text: "Hands-on workshop with guided exercises" },
  { time: "20:30", tag: "SHARE", title: "Demo & Networking", text: "Show what you built, connect with others" },
  { time: "21:00", tag: "CLOSE", title: "Wrap Up", text: "Next steps, upcoming events, stay connected" },
];

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = eventsData.find((e) => e.slug === slug);
  if (!event) notFound();

  const eventIndex = eventsData.findIndex((e) => e.slug === slug);
  const prevEvent = eventIndex > 0 ? eventsData[eventIndex - 1] : null;
  const nextEvent = eventIndex < eventsData.length - 1 ? eventsData[eventIndex + 1] : null;
  const d = formatDate(event.date);

  const detailCards = [
    { icon: CalendarDays, title: "Date & time", main: `${d.day} ${d.month} ${d.year}`, sub: event.time },
    { icon: MapPin, title: "Location", main: event.location, sub: "In-person event" },
    { icon: Users, title: "Audience", main: "All MNU students", sub: "No prerequisites" },
    { icon: Share2, title: "Category", main: event.category, sub: event.demo ? "Demo event" : "Official event" },
  ];

  return (
    <>
      <BandHero
        crumbs={[{ label: "Events", href: "/events" }, { label: event.title }]}
        kicker={`EVENT · ${event.category.toUpperCase()}`}
        title={event.title}
        lede={event.description}
        color={event.color}
        meta={
          <>
            <span className="band-meta-pill"><CalendarDays size={14} /> {d.day} {d.month} {d.year}</span>
            <span className="band-meta-pill"><Clock size={14} /> {event.time}</span>
            <span className="band-meta-pill"><MapPin size={14} /> {event.location}</span>
          </>
        }
        icon={<CalendarDays size={56} />}
      />

      <section className="section" aria-labelledby="event-details-title">
        <div className="container detail-grid">
          <div className="event-main">
            <Reveal className="lk-section-head">
              <div>
                <span className="hp-section-kicker">EVENT DETAILS</span>
                <h2 id="event-details-title" className="hp-section-title">Everything you need to know.</h2>
              </div>
            </Reveal>

            <Reveal className="cm-detail-grid" role="list">
              {detailCards.map((item) => (
                <SpotlightCard key={item.title} className="cm-detail-card" role="listitem">
                  <span className="cm-detail-icon"><item.icon size={21} /></span>
                  <h3>{item.title}</h3>
                  <strong>{item.main}</strong>
                  <p>{item.sub}</p>
                </SpotlightCard>
              ))}
            </Reveal>

            <div className="cm-about-box">
              <h3>About this event</h3>
              <p>{event.description}</p>
              <p>This is a demo event for presentation purposes. Actual event details, speakers, agenda and registration will be confirmed closer to the date.</p>
            </div>

            <Reveal className="lk-section-head" style={{ marginTop: "48px" }}>
              <div>
                <span className="hp-section-kicker">AGENDA</span>
                <h2 className="hp-section-title">What&apos;s happening.</h2>
              </div>
            </Reveal>

            <ol className="cm-agenda">
              {agenda.map((item) => (
                <li key={item.time} className="cm-agenda-item">
                  <span className="cm-agenda-time">
                    <strong>{item.time}</strong>
                    <small>{item.tag}</small>
                  </span>
                  <span className="cm-agenda-dot" aria-hidden="true" />
                  <div className="cm-agenda-copy">
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="event-sidebar" aria-labelledby="register-title">
            <div className="lk-side-card" style={{ position: "sticky", top: "90px" }}>
              <h3 id="register-title">Register for this event</h3>
              <p className="lk-side-sub">Spots are limited. Reserve your place now.</p>
              <Button variant="primary" asChild size="lg" style={{ width: "100%" }}>
                <Link href="/join"><Ticket size={17} /> Reserve spot</Link>
              </Button>
              <div className="lk-side-navlinks">
                <Link href="/events"><NotebookPen size={14} /> All events</Link>
                {prevEvent && <Link href={`/events/${prevEvent.slug}`}><ArrowRight size={14} /> Previous: {prevEvent.title}</Link>}
                {nextEvent && <Link href={`/events/${nextEvent.slug}`}><ArrowRight size={14} /> Next: {nextEvent.title}</Link>}
              </div>
            </div>

            <div className="lk-side-card">
              <h3>What to bring</h3>
              <ul className="lk-skills">
                <li><CheckCircle size={16} aria-hidden="true" /> Laptop (recommended)</li>
                <li><CheckCircle size={16} aria-hidden="true" /> Curiosity &amp; ideas</li>
                <li><CheckCircle size={16} aria-hidden="true" /> Willingness to build</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
