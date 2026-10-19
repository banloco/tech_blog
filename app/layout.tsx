import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import "./tiptap.css";

// Self-hosted by Next.js (no request to Google at runtime), only the latin subset
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const heading = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-heading", display: "swap" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FAF7F2',
};

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  alternates: { types: { "application/rss+xml": [{ url: "/feed.xml", title: SITE.name }] } },
  metadataBase: new URL(SITE.url),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    // Large images and full snippets: required to appear in Google Discover
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

const SITE_URL = SITE.url;

const websiteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Le Plan B",
    description: SITE.description,
    inLanguage: "fr-FR",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Le Plan B",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.png`,
      width: 512,
      height: 512,
    },
    founder: {
      "@type": "Person",
      name: "Christ Banidje",
    },
    sameAs: [],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions add their own attributes to <html> (e.g. "foxified")
    <html lang="fr" className={`${body.variable} ${heading.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Google AdSense: a plain tag in <head>, as Google asks, so its crawler sees it in the HTML */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}`}
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content={SITE.adsenseClient}></meta>
      </head>
      <body className="antialiased relative min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
        {/* Skip to main content for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:font-semibold focus:shadow-lg"
          style={{ background: 'var(--brand)', color: '#fff' }}
        >
          Passer au contenu principal
        </a>
        
        <LanguageProvider>
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </LanguageProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}