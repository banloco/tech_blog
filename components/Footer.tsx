"use client";

import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import Logo from "./Logo";
import { useLanguage } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  const { t } = useLanguage();
  const linkClass = "text-sm transition-colors hover:text-[var(--ink)]";

  return (
    <footer className="mt-auto border-t" style={{ borderColor: "var(--line)", background: "var(--surface-2)" }}>
      {/* Newsletter band: present on every page, target of the "#newsletter" links */}
      <section id="newsletter" className="scroll-mt-24 border-b" style={{ borderColor: "var(--line)" }} aria-labelledby="newsletter-title">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow mb-2" style={{ color: "var(--accent)" }}>Newsletter</p>
            <h2 id="newsletter-title" className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--ink)" }}>
              {t("newsletterFooter")}
            </h2>
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>{t("newsletterDescription")}</p>
          </div>
          <NewsletterForm size="large" />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="col-span-2 space-y-3 md:col-span-1">
          <Logo />
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{t("brandDescription")}</p>
        </div>

        <nav aria-label={t("themes")}>
          <h3 className="eyebrow mb-3" style={{ color: "var(--text-dim)" }}>{t("themes")}</h3>
          <ul className="space-y-2">
            {CATEGORIES.map(({ slug, name }) => (
              <li key={slug}><Link href={`/categorie/${slug}`} className={linkClass} style={{ color: "var(--text-muted)" }}>{name}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("navigation")}>
          <h3 className="eyebrow mb-3" style={{ color: "var(--text-dim)" }}>{t("navigation")}</h3>
          <ul className="space-y-2">
            {[{ href: "/", label: t("home") }, { href: "/about", label: t("about") }, { href: "/contact", label: t("contact") }].map(({ href, label }) => (
              <li key={href}><Link href={href} className={linkClass} style={{ color: "var(--text-muted)" }}>{label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("information")}>
          <h3 className="eyebrow mb-3" style={{ color: "var(--text-dim)" }}>{t("information")}</h3>
          <ul className="space-y-2">
            {[{ href: "/privacy", label: t("privacyPolicy") }, { href: "/mentions-legales", label: t("legalNotice") }].map(({ href, label }) => (
              <li key={href}><Link href={href} className={linkClass} style={{ color: "var(--text-muted)" }}>{label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm sm:px-6" style={{ color: "var(--text-dim)" }}>
          © {new Date().getFullYear()} Le Plan B. {t("allRightsReserved")}
        </p>
      </div>
      <div className="flag-stripe" aria-hidden="true" />
    </footer>
  );
}
