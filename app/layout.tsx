import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

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
        {/* Google AdSense — replace ca-pub-XXXXXXXX with your real publisher ID */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="bg-black text-zinc-50 antialiased relative min-h-screen selection:bg-emerald-500/30 flex flex-col">
        {/* Modern Background Effects */}
        <div className="fixed inset-0 z-[-1] h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]"></div>

        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <ScrollToTop />
        <SpeedInsights />
      </body>
    </html>
  );
}