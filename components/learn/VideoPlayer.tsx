"use client";

import { CheckCircle, ExternalLink, Play, ShieldAlert } from "lucide-react";
import type { CSSProperties } from "react";

/**
 * Lesson video player.
 *
 * Supports YouTube, official Microsoft video embed URLs (including safe
 * conversions for normal SharePoint file paths), and direct HTTP media URLs.
 * Opaque sharing/recap links are opened in Microsoft 365 rather than framed.
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
  return /(?:^|\/)embed(?:\.aspx|\/)/i.test(url.pathname);
}

function microsoftEmbedUrl(recording: URL): string | null {
  if (isMicrosoftEmbedUrl(recording)) return recording.toString();

  const streamPage = recording.pathname.match(/^(.*\/_layouts\/15\/)stream\.aspx$/i);
  if (streamPage && recording.hostname.toLowerCase().endsWith(".sharepoint.com")) {
    const embed = new URL(recording.toString());
    embed.pathname = `${streamPage[1]}embed.aspx`;
    embed.searchParams.set("embed", "1");
    return embed.toString();
  }

  if (!recording.hostname.toLowerCase().endsWith(".sharepoint.com")) return null;

  // Some Teams fileUrl values resolve to the actual .mp4 path. SharePoint's
  // supported embed.aspx endpoint can embed that path; opaque short-share
  // tokens cannot be converted reliably and must use the external fallback.
  let filePath = recording.pathname;
  const routedShare = filePath.match(/^\/:([^/]+)\/r(\/.*)$/i);
  if (routedShare) filePath = routedShare[2];

  if (!/\.(?:mp4|m4v|mov|webm|wmv|avi)$/i.test(filePath)) return null;
  const siteRootMatch = filePath.match(/^\/(personal|sites|teams)\/([^/]+)/i);
  const siteRoot = siteRootMatch ? `/${siteRootMatch[1]}/${siteRootMatch[2]}` : "";
  const embed = new URL(`${siteRoot}/_layouts/15/embed.aspx`, recording.origin);
  embed.searchParams.set("id", `${recording.origin}${filePath}`);
  embed.searchParams.set("embed", "1");
  return embed.toString();
}

function microsoftVideo(url: string): MicrosoftVideo | null {
  try {
    const original = new URL(url);
    if (!isMicrosoftHost(original.hostname)) return null;

    let recording = original;
    const fileUrl = original.searchParams.get("fileUrl");
    if (fileUrl) {
      try {
        const candidate = new URL(fileUrl);
        if (isMicrosoftHost(candidate.hostname)) recording = candidate;
      } catch {
        // Keep the original Teams URL if fileUrl is malformed.
      }
    }

    return {
      openUrl: recording.toString(),
      embedUrl: microsoftEmbedUrl(recording),
    };
  } catch {
    return null;
  }
}

const openLinkStyle: CSSProperties = {
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

const secondaryLinkStyle: CSSProperties = {
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
        <div className="lesson-player-microsoft-embed">
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
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10 }}>
            <a href={microsoft.openUrl} target="_blank" rel="noopener noreferrer" style={secondaryLinkStyle}>
              Open recording in Microsoft 365 <ExternalLink size={15} />
            </a>
          </div>
        </div>
      );
    }

    // Ordinary/opaque share links cannot safely be framed. Render a usable
    // branded state instead of the giant white "refused to connect" page.
    return (
      <div className="lesson-player lesson-player-empty lesson-player-microsoft-fallback" role="group" aria-label="Microsoft 365 video">
        <span className="lesson-player-empty-icon"><Play size={32} /></span>
        <strong style={{ color: "#fff", fontSize: "1.15rem" }}>{title}</strong>
        <p style={{ maxWidth: 520, margin: 0, lineHeight: 1.6 }}>
          This Microsoft Teams link does not expose an embeddable video URL.
          Open the recording in a new tab to play it with your university Microsoft account.
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
          <ShieldAlert size={14} /> Video access is controlled by Microsoft 365 sharing permissions.
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
