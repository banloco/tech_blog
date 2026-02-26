"use client";

import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import Image from "next/image";
import logo from "../public/ia_&_capital.png";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ borderTop: "1px solid #2a2a2a", background: "#0e0e0e" }}>
      {/* Main footer grid */}
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14"
        style={{ maxWidth: "1280px" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src={logo} alt="AI & Capital" className="w-7 h-7 object-contain" />
              <span
                className="font-bold leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "14px", color: "#e8e8e8" }}
              >
                AI<span style={{ color: "#C19A6B", margin: "0 2px", fontWeight: 400 }}>&amp;</span>CAPITAL
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: "#666", maxWidth: "220px" }}>
              {t("brandDescription")}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3
              className="text-[9px] uppercase tracking-widest font-semibold"
              style={{ color: "#555", letterSpacing: "0.16em" }}
            >
              {t("navigation")}
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: t("home") },
                { href: "/about", label: t("about") },
                { href: "/contact", label: t("contact") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs transition-colors"
                  style={{ color: "#666" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e8e8e8")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#666")}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3
              className="text-[9px] uppercase tracking-widest font-semibold"
              style={{ color: "#555", letterSpacing: "0.16em" }}
            >
              {t("information")}
            </h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/privacy", label: t("privacyPolicy") },
                { href: "/mentions-legales", label: t("legalNotice") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs transition-colors"
                  style={{ color: "#666" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e8e8e8")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#666")}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div id="newsletter" className="space-y-4 scroll-mt-20 sm:col-span-2 lg:col-span-1">
            <h3
              className="text-[9px] uppercase tracking-widest font-semibold"
              style={{ color: "#555", letterSpacing: "0.16em" }}
            >
              {t("newsletterFooter")}
            </h3>
            <p className="text-xs" style={{ color: "#666" }}>
              {t("newsletterDescription")}
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-4"
        style={{
          maxWidth: "1280px",
          borderTop: "1px solid #1e1e1e",
        }}
      >
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] uppercase tracking-widest"
          style={{ color: "#444", letterSpacing: "0.1em" }}
        >
          <p>© {new Date().getFullYear()} AI &amp; Capital. {t("allRightsReserved")}</p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-zinc-400"
            >
              {t("privacy")}
            </Link>
            <span style={{ color: "#2a2a2a" }}>|</span>
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-zinc-400"
            >
              {t("legalNotice")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
