"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, Home, Info, Mail, Rss } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import logo from "../public/ia_&_capital.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/about", label: t("about"), icon: Info },
    { href: "/contact", label: t("contact"), icon: Mail },
  ];

  // Close on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Esc key + focus trap
  useEffect(() => {
    if (!mobileOpen) {
      triggerRef.current?.focus();
      return;
    }
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); return; }
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-black/95 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="Accueil IA & Capital"
        >
          <Image
            src={logo}
            alt="IA & Capital"
            className="w-8 h-8 object-contain"
          />
          <span className="text-base font-bold leading-none">
            <span className="text-white">IA</span>
            <span className="text-emerald-400">&</span>
            <span className="text-white">Capital</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1 text-sm font-medium"
          aria-label="Navigation principale"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-3 py-1.5 rounded-lg transition-colors ${
                pathname === href
                  ? "text-white bg-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              {label}
              {pathname === href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="#newsletter"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm shadow-emerald-500/20"
          >
            <Bell className="w-3.5 h-3.5" />
            Newsletter
          </a>
        </div>

        {/* Mobile: newsletter icon + burger */}
        <div className="flex md:hidden items-center gap-1">
          <a
            href="#newsletter"
            aria-label="S'inscrire à la newsletter"
            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
          >
            <Rss className="w-5 h-5" />
          </a>
          <button
            ref={triggerRef}
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-lg text-white hover:bg-zinc-800 transition-colors"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{mobileOpen ? t("closeMenu") : t("openMenu")}</span>
            {mobileOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-14 bg-black/70 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={`fixed left-0 right-0 top-14 md:hidden z-50 transition-all duration-200 ease-out origin-top ${
          mobileOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        }`}
      >
        <nav
          className="bg-zinc-950 border-b border-zinc-800 shadow-2xl pb-4"
          aria-label="Navigation mobile"
        >
          <ul className="px-4 pt-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800/60 border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {label}
                  {pathname === href && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Newsletter CTA */}
          <div className="px-4 pt-3">
            <a
              href="#newsletter"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-500/20"
            >
              <Bell className="w-4 h-4" />
              {t("subscribeNewsletter")}
            </a>
          </div>

          {/* Language switcher */}
          <div className="px-4 pt-4">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 px-1">
              Langue
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["fr", "en"] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => { setLanguage(lng); setMobileOpen(false); }}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    language === lng
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {lng === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}