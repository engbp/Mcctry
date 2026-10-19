"use client";

import { CheckCircle, ExternalLink, Play } from "lucide-react";

/**
 * Lesson video player.
 *
 * Supports YouTube, Microsoft 365/Teams/SharePoint/OneDrive recordings,
 * and direct http(s) media URLs.
 *
 * Teams meeting-recap links are normalized to their underlying SharePoint
 * recording via the `fileUrl` query parameter. The recap page itself is not
 * the video player and may refuse iframe rendering.
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

function microsoftVideoUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    const isMicrosoftHost =
      host === "teams.microsoft.com" ||
      host.endsWith(".teams.microsoft.com") ||
      host === "stream.microsoft.com" ||
      host.endsWith(".sharepoint.com") ||
      host === "onedrive.live.com" ||
      host === "1drv.ms";

    if (!isMicrosoftHost) return null;

    // Modern Teams recording links contain the actual SharePoint/OneDrive
    // recording in `fileUrl`. Embed that recording instead of the Teams recap
    // page, which is why Teams videos previously appeared blank.
    const fileUrl = u.searchParams.get("fileUrl");
    if (fileUrl) {
      try {
        const recording = new URL(fileUrl);
        const recordingHost = recording.hostname.toLowerCase();
        if (recordingHost.endsWith(".sharepoint.com") || recordingHost === "onedrive.live.com") {
          return recording.toString();
        }
      } catch {
        // Keep the original URL if the embedded file URL is malformed.
      }
    }

    return u.toString();
  } catch {
    return null;
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

  const microsoftUrl = microsoftVideoUrl(videoUrl);
  if (microsoftUrl) {
    return (
      <div className="lesson-player lesson-player-microsoft">
        <iframe
          className="lesson-video-frame"
          src={microsoftUrl}
          title={title}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="lesson-player-external">
          <span>Microsoft 365 video</span>
          <a href={videoUrl} target="_blank" rel="noreferrer">
            Open in Microsoft Teams <ExternalLink size={15} />
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
