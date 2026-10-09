"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Layers } from "lucide-react";
import { tracksData, coursesData, eventsData, formatDate } from "@/lib/data";

type TabKey = "courses" | "tracks" | "events";

const tabs: { key: TabKey; label: string; icon: typeof BookOpen }[] = [
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "tracks", label: "Tracks", icon: Layers },
  { key: "events", label: "Events", icon: CalendarDays },
];

export function LearningTabs() {
  const [active, setActive] = useState<TabKey>("courses");

  return (
    <div className="hp-tabs">
      <div className="hp-tablist" role="tablist" aria-label="Explore MCC content">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            className={`hp-tab ${active === tab.key ? "hp-tab-active" : ""}`}
            onClick={() => setActive(tab.key)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="hp-tabpanel" role="tabpanel">
        {active === "courses" && (
          <div className="hp-tab-grid">
            {coursesData.slice(0, 4).map((course, i) => (
              <Link key={course.slug} href={`/courses/${course.slug}`} className="hp-mini-card">
                <span className="hp-mini-index">0{i + 1}</span>
                <span className="hp-mini-track">{course.track}</span>
                <strong>{course.title}</strong>
                <small>{course.lessonsCount} lessons · {course.duration} · {course.level}</small>
                <span className="hp-mini-arrow"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        )}

        {active === "tracks" && (
          <div className="hp-tab-grid">
            {tracksData.map((track, i) => (
              <Link key={track.slug} href={`/tracks/${track.slug}`} className="hp-mini-card">
                <span className="hp-mini-index">0{i + 1}</span>
                <span className="hp-mini-track">Track</span>
                <strong>{track.title}</strong>
                <small>{track.coursesCount} courses · {track.duration}</small>
                <span className="hp-mini-arrow"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        )}

        {active === "events" && (
          <div className="hp-tab-grid">
            {eventsData.map((event) => {
              const d = formatDate(event.date);
              return (
                <Link key={event.slug} href={`/events/${event.slug}`} className="hp-mini-card">
                  <span className="hp-mini-date">{d.day} {d.month}</span>
                  <span className="hp-mini-track">{event.location}</span>
                  <strong>{event.title}</strong>
                  <small>{event.category} · {event.time}</small>
                  <span className="hp-mini-arrow"><ArrowRight size={16} /></span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="hp-tab-footer">
        <Link href={active === "courses" ? "/courses" : active === "tracks" ? "/tracks" : "/events"} className="hp-tab-all">
          View all {active} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
