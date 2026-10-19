"use client";

import { CheckCircle, ExternalLink, Play, ShieldAlert } from "lucide-react";

/**
 * Lesson video player.
 *
 * Supports YouTube, true Microsoft-provided embed URLs, and direct http(s)
 * media URLs. Ordinary Teams/SharePoint sharing links are opened in Microsoft
 * 365 instead of being placed in an iframe: those pages commonly send
 * anti-framing headers and otherwise produce a large, empty white screen.
 */
interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
}

interface MicrosoftVideo {
  openUrl: string;
  embedUrl: string | null;
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

function isMicrosoftHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return (
    host === "teams.microsoft.com" ||
    host.endsWith(".teams.microsoft.com") ||
    host === "stream.microsoft.com" ||
    host === "stream.office.com" ||
    host === "web.microsoftstream.com" ||
    host.endsWith(".sharepoint.com") ||
    host === "onedrive.live.com" ||
    host === "1drv.ms"
  );
}

function isMicrosoftEmbedUrl(url: URL): boolean {
  // SharePoint/OneDrive's supported video embed URL, or a Microsoft Stream
  // embed URL. A normal sharing/recap URL is not an embed URL.
  return /(?:^|\/)embed(?:\.aspx|\/)/i.test(url.pathname);
}

function microsoftVideo(url: string): MicrosoftVideo | null {
  try {
    const original = new URL(url);
    if (!isMicrosoftHost(original.hostname)) return null;

    // Teams meeting recap links can point at the actual recording via fileUrl.
    // Use it as the target that opens in a new tab, but do not assume it's
    // iframe-safe just because it points at SharePoint.
    let recording = original;
    const fileUrl = original.searchParams.get("fileUrl");
    if (fileUrl) {
      try {
        const candidate = new URL(fileUrl);
        if (isMicrosoftHost(candidate.hostname)) recording = candidate;
      } catch {
        // Ignore malformed fileUrl and retain the original Teams link.
      }
    }

    // Only iframe known Microsoft embed endpoints. Generic sharing pages are
    // frequently blocked by X-Frame-Options / CSP and cause a blank player.
    const embedUrl = isMicrosoftEmbedUrl(recording) ? recording.toString() : null;

    return {
      openUrl: recording.toString(),
      embedUrl,
    };
  } catch {
    return null;
  }
}

const openLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "11px 16px",
  borderRadius: 9,
  background: "#0078d4",
  color: "#fff",
  fontWeight: 700,
  textDecoration: "none",
  lineHeight: 1.2,
};

const secondaryLinkStyle: React.CSSProperties = {
  ...openLinkStyle,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.16)",
};

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

  const microsoft = microsoftVideo(videoUrl);
  if (microsoft) {
    if (microsoft.embedUrl) {
      return (
        <div className="lesson-player lesson-player-yt">
          <iframe
            className="lesson-video-frame"
            src={microsoft.embedUrl}
            title={title}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      );
    }

    // Graceful, usable fallback for a standard Teams/SharePoint share link.
    // Do not render the blocked page in an iframe: open the recording in its
    // normal Microsoft 365 context where sign-in and permissions can work.
    return (
      <div className="lesson-player lesson-player-empty lesson-player-microsoft-fallback" role="group" aria-label="Microsoft 365 video">
        <span className="lesson-player-empty-icon"><Play size={32} /></span>
        <strong style={{ color: "#fff", fontSize: "1.15rem" }}>{title}</strong>
        <p style={{ maxWidth: 520, margin: 0, lineHeight: 1.6 }}>
          This recording is hosted by Microsoft 365 and can’t be embedded from its sharing link.
          Open it in a new tab to play it with your Microsoft account and recording permissions.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 8 }}>
          <a href={microsoft.openUrl} target="_blank" rel="noopener noreferrer" style={openLinkStyle}>
            Watch recording <ExternalLink size={16} />
          </a>
          {microsoft.openUrl !== videoUrl && (
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={secondaryLinkStyle}>
              Open Teams recap <ExternalLink size={16} />
            </a>
          )}
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem", marginTop: 4 }}>
          <ShieldAlert size={14} /> You may need to sign in with your university Microsoft account.
        </span>
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
