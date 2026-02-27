import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import "./tiptap.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#121212',
};

export const metadata: Metadata = {
  title: {
    default: "IA & Capital | Le Blog Tech Finance",
    template: "%s | IA & Capital",
  },
  description:
    "Décryptez l'impact de l'intelligence artificielle sur vos finances. Analyses, outils IA et actualités bourse & crypto.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "IA & Capital",
    title: "IA & Capital | Le Blog Tech Finance",
    description:
      "Décryptez l'impact de l'intelligence artificielle sur vos finances.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-and-capital.tech";

const websiteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "IA & Capital",
    description: "Blog francophone sur l'IA appliquée à la finance, la crypto et l'investissement.",
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "IA & Capital",
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
    <html lang="fr" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <meta name="google-adsense-account" content="ca-pub-6021784377387721"></meta>
      </head>
      <body className="antialiased relative min-h-screen flex flex-col" style={{ background: '#121212', color: '#e8e8e8' }}>
        {/* Skip to main content for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:text-black focus:px-6 focus:py-3 focus:font-semibold focus:shadow-lg"
          style={{ background: 'var(--accent-cyan)' } as React.CSSProperties}
        >
          Passer au contenu principal
        </a>
        
        {/* Subtle technical grid background */}
        <div className="fixed inset-0 z-[-1]" style={{ background: '#121212', backgroundImage: 'linear-gradient(to right, #2a2a2a22 1px, transparent 1px), linear-gradient(to bottom, #2a2a2a22 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

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