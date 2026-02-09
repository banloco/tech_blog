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
  themeColor: '#000000',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <head>
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
      <body className="bg-black text-zinc-50 antialiased relative min-h-screen selection:bg-emerald-500/30 flex flex-col">
        {/* Skip to main content for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-emerald-500 focus:text-white focus:px-6 focus:py-3 focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Passer au contenu principal
        </a>
        
        {/* Modern Background Effects */}
        <div className="fixed inset-0 z-[-1] h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>

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