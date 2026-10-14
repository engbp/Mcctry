"use client";

import { CheckCircle, Play } from "lucide-react";

/**
 * Real video player. Recognizes YouTube watch/embed/youtu.be URLs and renders
 * the official privacy-enhanced iframe; any other http(s) URL renders a
 * native HTML5 <video> element. When no URL is set, shows an honest empty
 * state instead of a fake player.
 */
interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
}

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const embed = u.pathname.match(/^\/embed\/([\w-]{6,})/);
      if (embed) return embed[1];
      const short = u.pathname.match(/^\/v\/([\w-]{6,})/);
      if (short) return short[1];
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (/^[\w-]{6,}$/.test(id)) return id;
    }
  } catch {
    return null;
  }
  return null;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="lesson-player lesson-player-empty" role="status">
        <span className="lesson-player-empty-icon"><Play size={30} /></span>
        <strong>No video published yet</strong>
        <p>This lesson does not have a video link. Check back soon.</p>
      </div>
    );
  }

  const ytId = youtubeId(videoUrl);
  if (ytId) {
    return (
      <div className="lesson-player lesson-player-yt">
        <iframe
          className="lesson-video-frame"
          src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="lesson-player lesson-player-native">
      <video className="lesson-video-el" controls preload="metadata" src={videoUrl} title={title}>
        Your browser does not support embedded video.
      </video>
    </div>
  );
}

export function CompletionBadge({ done }: { done: boolean }) {
  if (!done) return null;
  return (
    <span className="lesson-complete-badge">
      <CheckCircle size={15} /> Completed
    </span>
  );
}
