import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Code2, Cloud, ShieldCheck, Clock, Users, Layers, Sparkles, Award } from "lucide-react";
import { BandHero } from "@/components/layout/BandHero";
import { Badge } from "@/components/ui/Badge";
import { tracksData, getCoursesByTrack } from "@/lib/data";

const trackIcons = { BookOpen, Code2, Cloud, ShieldCheck } as const;

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
  const TrackIcon = trackIcons[track.icon as keyof typeof trackIcons] ?? BookOpen;

  const gains = [
    { icon: BookOpen, title: "Structured Curriculum", text: "Courses designed to build on each other, taking you from fundamentals to applied projects." },
    { icon: Clock, title: "Self-Paced Learning", text: "Progress through lessons on your schedule. No deadlines, no pressure — just consistent progress." },
    { icon: Users, title: "Community Support", text: "Connect with peers in the same track. Share progress, ask questions, collaborate on projects." },
  ];

  return (
    <>
      <BandHero
        crumbs={[{ label: "Tracks", href: "/tracks" }, { label: track.title }]}
        kicker={`TRACK · ${track.title.toUpperCase()}`}
        title={track.title}
        lede={track.description}
        color={track.color}
        meta={
          <>
            <span className="band-meta-pill"><BookOpen size={14} /> {track.coursesCount} courses</span>
            <span className="band-meta-pill"><Clock size={14} /> {track.duration}</span>
          </>
        }
        icon={<TrackIcon size={56} />}
      />

      <section className="section" aria-labelledby="courses-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">COURSES IN THIS TRACK</span>
              <h2 id="courses-title" className="hp-section-title">{courses.length} courses to build your skills.</h2>
            </div>
            <Link href="/courses" className="hp-section-link">All courses <ArrowRight size={15} /></Link>
          </div>

          <div className="lk-course-rows" role="list">
            {courses.map((course, i) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="lk-course-row" role="listitem" style={{ "--track-color": course.color } as React.CSSProperties}>
                <span className="lk-course-row-index">0{i + 1}</span>
                <div className="lk-course-row-main">
                  <div className="lk-course-row-tags">
                    <Badge variant="blue">{course.track}</Badge>
                    <span className="lk-course-row-level">{course.level}</span>
                    {course.featured && <span className="lk-course-row-flag">Featured</span>}
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </div>
                <div className="lk-course-row-meta">
                  <span><BookOpen size={14} /> {course.lessonsCount} lessons</span>
                  <span><Clock size={14} /> {course.duration}</span>
                </div>
                <span className="lk-course-row-arrow"><ArrowRight size={18} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section lk-steps-section" aria-labelledby="track-info-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">TRACK DETAILS</span>
              <h2 id="track-info-title" className="hp-section-title">What you&apos;ll gain.</h2>
            </div>
          </div>
          <div className="lk-steps" role="list">
            {gains.map((gain, i) => (
              <div key={gain.title} className="lk-step" role="listitem" style={{ "--track-color": track.color } as React.CSSProperties}>
                <span className="lk-step-number">0{i + 1}</span>
                <span className="lk-step-icon"><gain.icon size={24} /></span>
                <h3>{gain.title}</h3>
                <p>{gain.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="container">
          <div className="lk-section-head">
            <div>
              <span className="hp-section-kicker">EXPLORE MORE</span>
              <h2 id="related-title" className="hp-section-title">Other learning paths.</h2>
            </div>
            <Link href="/tracks" className="hp-section-link">View all tracks <ArrowRight size={15} /></Link>
          </div>
          <div className="hp-track-grid" role="list">
            {tracksData.filter((t) => t.slug !== slug).map((otherTrack) => {
              const OtherIcon = trackIcons[otherTrack.icon as keyof typeof trackIcons] ?? BookOpen;
              return (
                <Link key={otherTrack.slug} href={`/tracks/${otherTrack.slug}`} className="hp-track-card" role="listitem" style={{ "--track-color": otherTrack.color } as React.CSSProperties}>
                  <div className="hp-track-top">
                    <span className="hp-track-icon"><OtherIcon size={24} /></span>
                  </div>
                  <h3>{otherTrack.title}</h3>
                  <p>{otherTrack.description}</p>
                  <div className="hp-track-meta">
                    <span>{otherTrack.coursesCount} courses</span>
                    <span aria-hidden="true">·</span>
                    <span>{otherTrack.duration}</span>
                    <span className="hp-track-arrow"><ArrowRight size={16} /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
