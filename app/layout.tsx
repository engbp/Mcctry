import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "./mcc-feature-styles-01.css";
import "./mcc-feature-styles-02.css";
import "./mcc-feature-styles-03.css";
import "./mcc-feature-styles-04.css";
import "./mcc-feature-styles-05.css";
import "./mcc-feature-styles-06.css";
import "./mcc-redesign.css";
import { MainLayout } from "@/components/layout/MainLayout";
import { GlobalEffects } from "@/components/fx/GlobalEffects";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mcctry.vercel.app"),
  title: "MCC MNU — Microsoft Campus Club at Mansoura National University",
  description: "MCC MNU — a student community for learning, building, and connecting through technology.",
  keywords: ["MCC", "Microsoft Campus Club", "Mansoura National University", "student community", "technology learning", "AI", "web development", "cloud", "cybersecurity"],
  authors: [{ name: "MCC MNU" }],
  creator: "MCC MNU",
  publisher: "MCC MNU",
  icons: { icon: "/mcc-mnu-logo.svg" },
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mcctry.vercel.app",
    siteName: "MCC MNU",
    title: "MCC MNU — Microsoft Campus Club at Mansoura National University",
    description: "A student community for learning, building, and connecting through technology.",
    images: [
      {
        url: "/mcc-og.svg",
        width: 1200,
        height: 630,
        alt: "MCC MNU",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCC MNU",
    description: "Microsoft Campus Club at Mansoura National University",
    images: ["/mcc-og.svg"],
  },
  verification: {
    other: {
      "microsoft-campus-club": "MCC MNU",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050b18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <GlobalEffects />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
