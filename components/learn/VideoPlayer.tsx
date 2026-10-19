"use client";

import { CheckCircle, ExternalLink, Play } from "lucide-react";

/**
 * Lesson video player.
 *
 * Supports:
 * - YouTube watch/embed/youtu.be URLs via the privacy-enhanced player.
 * - Microsoft 365 video/recording links (Teams, Stream, SharePoint, OneDrive)
 *   via an iframe, with a direct-link fallback because Microsoft permissions
 *   and tenant policies can prevent third-party iframe playback.
 * - Direct http(s) media URLs via the native HTML5 video element.
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

function isMicrosoftVideoUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    return (
      host === "teams.microsoft.com" ||
      host.endsWith(".teams.microsoft.com") ||
      host === "stream.microsoft.com" ||
      host.endsWith(".sharepoint.com") ||
      host === "onedrive.live.com" ||
      host === "1drv.ms"
    );
  } catch {
    return false;
  }
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

  if (isMicrosoftVideoUrl(videoUrl)) {
    return (
      <div className="lesson-player lesson-player-microsoft">
        <iframe
          className="lesson-video-frame"
          src={videoUrl}
          title={title}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <div className="lesson-player-external">
          <span>Microsoft 365 video</span>
          <a href={videoUrl} target="_blank" rel="noreferrer">
            Open in Microsoft <ExternalLink size={15} />
          </a>
        </div>
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
