import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, SectionHeader } from "@/components/layout/PageHero";
import { TextLink, CardLink } from "@/components/ui/Links";
import { ArrowRight, BookOpen, Code2, Cloud, ShieldCheck, Clock, Users, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { tracksData, getCoursesByTrack } from "@/lib/data";

interface TrackPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { slug } = await params;
  const track = tracksData.find((t) => t.slug === slug);
  if (!track) return { title: "Track Not Found" };
  return {
    title: `${track.title} — MCC MNU`,
    description: track.description,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { slug } = await params;
  const track = tracksData.find((t) => t.slug === slug);
  if (!track) notFound();

  const courses = getCoursesByTrack(slug);

  const trackIcons = {
    "BookOpen": BookOpen,
    "Code2": Code2,
    "Cloud": Cloud,
    "ShieldCheck": ShieldCheck,
  };
  const TrackIcon = trackIcons[track.icon as keyof typeof trackIcons] || BookOpen;

  return (
    <>
      <PageHero
        label="Tracks"
        title={track.title}
        lede={track.description}
        badge={`${track.coursesCount} Courses · ${track.duration}`}
        badgeVariant="blue"
        kicker="01 / TRACK"
        visual={
          <div className="track-hero-visual" aria-hidden="true" style={{ background: track.gradient, borderRadius: "var(--radius-md)", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div className="track-hero-pattern" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px); background-size: 60px 60px;" }} />
            <div className="track-hero-icon" style={{ position: "relative", zIndex: 1, width: "120px", height: "120px", background: "rgba(255,255,255,.15)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
              <TrackIcon size={48} />
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="courses-title">
        <div className="container">
          <SectionHeader number="01" label="COURSES IN THIS TRACK" title={`${track.coursesCount} courses to build your skills.`} />
          <div className="grid-2" role="list" style={{ marginTop: "32px" }}>
            {courses.map((course, i) => (
              <CardLink key={course.slug} href={`/courses/${course.slug}`} className="course-card" role="listitem">
                <CardContent className="course-card-content">
                  <div className="course-card-header">
                    <Badge variant="blue">{course.track}</Badge>
                    <span className="course-card-number">0{i + 1}</span>
                  </div>
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-description">{course.description}</p>
                  <div className="course-card-meta">
                    <span><Clock size={14} /> {course.lessonsCount} lessons</span>
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="course-card-action">
                    <TextLink href={`/courses/${course.slug}`} variant="default">Start course</TextLink>
                  </div>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--mcc-paper)" }} aria-labelledby="track-info-title">
        <div className="container">
          <SectionHeader number="02" label="TRACK DETAILS" title="What you'll gain." />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            <Card variant="default" className="detail-card" role="listitem">
              <CardContent>
                <div className="detail-card-icon" aria-hidden="true"><BookOpen size={24} /></div>
                <h3>Structured Curriculum</h3>
                <p>Courses designed to build on each other, taking you from fundamentals to applied projects.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="detail-card" role="listitem">
              <CardContent>
                <div className="detail-card-icon" aria-hidden="true"><Clock size={24} /></div>
                <h3>Self-Paced Learning</h3>
                <p>Progress through lessons on your schedule. No deadlines, no pressure — just consistent progress.</p>
              </CardContent>
            </Card>
            <Card variant="default" className="detail-card" role="listitem">
              <CardContent>
                <div className="detail-card-icon" aria-hidden="true"><Users size={24} /></div>
                <h3>Community Support</h3>
                <p>Connect with peers in the same track. Share progress, ask questions, collaborate on projects.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="container">
          <SectionHeader number="03" label="EXPLORE MORE" title="Other learning paths." action={<TextLink href="/tracks">View all tracks</TextLink>} />
          <div className="grid-3" role="list" style={{ marginTop: "32px" }}>
            {tracksData.filter((t) => t.slug !== slug).map((otherTrack, i) => (
              <CardLink key={otherTrack.slug} href={`/tracks/${otherTrack.slug}`} className="related-track-card" role="listitem">
                <CardContent className="related-track-content">
                  <div className="related-track-icon" style={{ background: `${otherTrack.color}1a`, color: otherTrack.color }} aria-hidden="true">
                    {otherTrack.icon === "BookOpen" && <BookOpen size={22} />}
                    {otherTrack.icon === "Code2" && <Code2 size={22} />}
                    {otherTrack.icon === "Cloud" && <Cloud size={22} />}
                    {otherTrack.icon === "ShieldCheck" && <ShieldCheck size={22} />}
                  </div>
                  <h3>{otherTrack.title}</h3>
                  <p>{otherTrack.description}</p>
                  <div className="related-track-meta">
                    {otherTrack.coursesCount} courses · {otherTrack.duration}
                  </div>
                </CardContent>
              </CardLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}