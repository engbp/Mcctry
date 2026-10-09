"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, BookOpen, ArrowRight, X } from "lucide-react";
import { coursesData, tracksData } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Reveal } from "@/components/fx/Reveal";

const levels = ["Beginner", "Intermediate"];

export function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coursesData.filter((c) => {
      if (track && c.track !== track) return false;
      if (level && c.level !== level) return false;
      if (q && !`${c.title} ${c.description} ${c.track}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, track, level]);

  const clearAll = () => {
    setQuery("");
    setTrack(null);
    setLevel(null);
  };
  const hasFilters = query || track || level;

  return (
    <div className="cat">
      <div className="cat-toolbar">
        <div className="cat-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            aria-label="Search courses"
          />
          {query && (
            <button className="cat-clear" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={15} />
            </button>
          )}
        </div>

        <div className="cat-filters" role="group" aria-label="Filter by track">
          <button className={`cat-chip ${!track ? "cat-chip-active" : ""}`} onClick={() => setTrack(null)}>
            All tracks
          </button>
          {tracksData.map((t) => (
            <button
              key={t.slug}
              className={`cat-chip ${track === t.title ? "cat-chip-active" : ""}`}
              onClick={() => setTrack(track === t.title ? null : t.title)}
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="cat-filters" role="group" aria-label="Filter by level">
          {levels.map((l) => (
            <button
              key={l}
              className={`cat-chip cat-chip-level ${level === l ? "cat-chip-active" : ""}`}
              onClick={() => setLevel(level === l ? null : l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="cat-status" role="status">
        <span>
          <strong>{filtered.length}</strong> of {coursesData.length} courses
        </span>
        {hasFilters && (
          <button className="cat-reset" onClick={clearAll}>
            Reset filters <X size={14} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="cat-empty">
          <Search size={28} aria-hidden="true" />
          <h3>No courses match your filters</h3>
          <p>Try a different search term, or reset the filters to see everything.</p>
          <button className="cat-chip cat-chip-active" onClick={clearAll}>
            Reset filters
          </button>
        </div>
      ) : (
        <Reveal className="cat-grid" role="list">
          {filtered.map((course, i) => (
            <SpotlightCard key={course.slug} as="a" href={`/courses/${course.slug}`} className="cat-card" role="listitem" style={{ "--track-color": course.color } as React.CSSProperties}>
              <div className="cat-card-media" aria-hidden="true">
                <span className="cat-card-index">0{i + 1}</span>
                {course.featured && <span className="cat-card-flag">Featured</span>}
                <span className="cat-card-play"><BookOpen size={20} /></span>
              </div>
              <div className="cat-card-body">
                <Badge variant="blue">{course.track}</Badge>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="cat-card-meta">
                  <span><BookOpen size={14} /> {course.lessonsCount} lessons</span>
                  <span><Clock size={14} /> {course.duration}</span>
                  <span className="cat-card-level">{course.level}</span>
                </div>
                <span className="cat-card-cta">
                  Start course <ArrowRight size={15} />
                </span>
              </div>
            </SpotlightCard>
          ))}
        </Reveal>
      )}
    </div>
  );
}
