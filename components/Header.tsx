"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mail } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { useLanguage } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/categories";

export default function Header() {
  const pathname = usePathname();
  // The menu remembers on which page it was opened: navigating elsewhere closes it by itself
  const [openOn, setOpenOn] = useState<string | null>(null);
  const mobileOpen = openOn === pathname;
  const setMobileOpen = (open: boolean) => setOpenOn(open ? pathname : null);
  const { t, language, setLanguage } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const pages = [
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Lock the page scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Keyboard: Escape closes the menu, Tab stays inside it
  useEffect(() => {
    if (!mobileOpen) return;
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenOn(null); triggerRef.current?.focus(); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)", backdropFilter: "blur(10px)" }}>
      <div className="flag-stripe" aria-hidden="true" />
      <div className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />

          {/* Desktop: the four themes, then the pages */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {CATEGORIES.map(({ slug, short, icon: Icon, color }) => {
              const href = `/categorie/${slug}`;
              return (
                <Link
                  key={slug}
                  href={href}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
                  style={{ color: isActive(href) ? color : "var(--text-muted)", background: isActive(href) ? "var(--surface-2)" : undefined }}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" style={{ color }} aria-hidden="true" />
                  {short}
                </Link>
              );
            })}
            <span className="mx-2 h-5 w-px" style={{ background: "var(--line)" }} aria-hidden="true" />
            {pages.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--ink)]"
                style={{ color: isActive(href) ? "var(--ink)" : "var(--text-muted)" }}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <a href="#newsletter" className="btn btn-primary hidden sm:inline-flex !py-2 !px-4 text-sm">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {t("subscribeShort")}
            </a>
            <button
              ref={triggerRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden rounded-full p-2 transition-colors hover:bg-[var(--surface-2)]"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              style={{ color: "var(--ink)" }}
            >
              {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-[68px] lg:hidden z-40 transition-opacity duration-200 ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ background: "rgb(28 25 23 / 0.35)" }}
      />
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!mobileOpen}
        className="fixed left-0 right-0 top-[68px] z-50 max-h-[calc(100vh-68px)] overflow-y-auto border-b lg:hidden"
        style={{ background: "var(--bg)", borderColor: "var(--line)" }}
      >
        <nav className="mx-auto max-w-6xl px-4 py-5 space-y-6" aria-label="Navigation mobile">
          <div>
            <p className="eyebrow mb-3" style={{ color: "var(--text-dim)" }}>{t("themes")}</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CATEGORIES.map(({ slug, name, icon: Icon, color, tagline }) => (
                <li key={slug}>
                  <Link href={`/categorie/${slug}`} className="card card-link flex items-start gap-3 p-3">
                    <span className="rounded-xl p-2" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                      <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold" style={{ color: "var(--ink)" }}>{name}</span>
                      <span className="block text-sm" style={{ color: "var(--text-muted)" }}>{tagline}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className="space-y-1">
            {[{ href: "/", label: t("home") }, ...pages].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="block rounded-lg px-3 py-3 text-base font-medium" style={{ color: "var(--ink)" }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <a href="#newsletter" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {t("subscribeNewsletter")}
          </a>
          <div className="grid grid-cols-2 gap-2">
            {(["fr", "en"] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => { setLanguage(lng); setMobileOpen(false); }}
                className="rounded-full border py-2.5 text-sm font-medium"
                style={{
                  color: language === lng ? "var(--brand)" : "var(--text-muted)",
                  borderColor: language === lng ? "var(--brand)" : "var(--line)",
                }}
                aria-pressed={language === lng}
              >
                {lng === "fr" ? "Français" : "English"}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
