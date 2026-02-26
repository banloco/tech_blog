"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, X, Home, Info, Mail, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import logo from "../public/ia_&_capital.png";
import LanguageSwitcher from "./LanguageSwitcher";
import StockTicker from "./StockTicker";
import { useLanguage } from "@/lib/i18n";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const navLinks = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/about", label: t("about"), icon: Info },
    { href: "/contact", label: t("contact"), icon: Mail },
  ];

  useEffect(() => {
    document.body.classList.toggle("focus-mode", focusMode);
    return () => { document.body.classList.remove("focus-mode"); };
  }, [focusMode]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) { triggerRef.current?.focus(); return; }
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
    <header className="sticky top-0 z-50 w-full">
      {/* ── Stock Ticker Banner ── */}
      <StockTicker />

      {/* ── Main Nav Bar ── */}
      <div
        className="w-full border-b"
        style={{ background: "rgba(18,18,18,0.97)", borderColor: "#333", backdropFilter: "blur(12px)" }}
      >
        <div
          className="mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8"
          style={{ maxWidth: "1280px" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Accueil AI & Capital">
            <Image src={logo} alt="AI & Capital" className="w-7 h-7 object-contain" />
            <span className="font-bold leading-none tracking-tight hidden sm:block" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "15px" }}>
              <span style={{ color: "#e8e8e8" }}>AI</span>
              <span style={{ color: "#C19A6B", margin: "0 3px", fontSize: "13px", fontWeight: 400 }}>&amp;</span>
              <span style={{ color: "#e8e8e8" }}>CAPITAL</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center" aria-label="Navigation principale">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-3 transition-colors"
                style={{
                  color: pathname === href ? "#e8e8e8" : "#888",
                  borderBottom: pathname === href ? "2px solid #00E5FF" : "2px solid transparent",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setFocusMode(!focusMode)}
              title={focusMode ? "Désactiver mode lecture" : "Mode lecture seule"}
              className="flex items-center gap-1.5 px-3 py-1.5 border transition-all"
              style={{
                color: focusMode ? "#00E5FF" : "#666",
                borderColor: focusMode ? "#00E5FF" : "#333",
                background: focusMode ? "rgba(0,229,255,0.05)" : "transparent",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <BookOpen className="w-3 h-3" />
              Focus
            </button>

            <LanguageSwitcher />

            <a
              href="#newsletter"
              className="flex items-center gap-1.5 px-4 py-1.5 border font-semibold transition-all"
              style={{
                color: "#121212",
                background: "#C19A6B",
                borderColor: "#C19A6B",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <Bell className="w-3 h-3" />
              Newsletter
            </a>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-1">
            <a href="#newsletter" aria-label="Newsletter" className="p-2" style={{ color: "#C19A6B" }}>
              <Bell className="w-4 h-4" />
            </a>
            <button
              ref={triggerRef}
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              style={{ color: "#e8e8e8" }}
            >
              <span className="sr-only">{mobileOpen ? t("closeMenu") : t("openMenu")}</span>
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Backdrop ── */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 top-[68px] md:hidden z-40 transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      />

      {/* ── Mobile Panel ── */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        className={`fixed left-0 right-0 top-[68px] md:hidden z-50 transition-all duration-200 ease-out origin-top ${mobileOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
      >
        <nav
          className="border-b shadow-2xl pb-4"
          style={{ background: "#1a1a1a", borderColor: "#333" }}
          aria-label="Navigation mobile"
        >
          <ul className="px-4 pt-3 space-y-0.5">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-4 py-3 border-l-2 transition-colors"
                  style={{
                    color: pathname === href ? "#e8e8e8" : "#888",
                    borderLeftColor: pathname === href ? "#00E5FF" : "transparent",
                    background: pathname === href ? "rgba(0,229,255,0.04)" : "transparent",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 pt-3">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-2 w-full px-4 py-3 text-xs border transition-all"
              style={{
                color: focusMode ? "#00E5FF" : "#888",
                borderColor: focusMode ? "#00E5FF" : "#333",
                background: focusMode ? "rgba(0,229,255,0.05)" : "transparent",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {focusMode ? "Désactiver mode lecture" : "Mode lecture seule"}
            </button>
          </div>
          <div className="px-4 pt-2">
            <a
              href="#newsletter"
              className="flex items-center justify-center gap-2 w-full py-3 font-semibold transition-all"
              style={{ color: "#121212", background: "#C19A6B", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              <Bell className="w-3.5 h-3.5" />
              {t("subscribeNewsletter")}
            </a>
          </div>
          <div className="px-4 pt-3">
            <p className="mb-2 px-1" style={{ color: "#555", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase" }}>Langue</p>
            <div className="grid grid-cols-2 gap-2">
              {(["fr", "en"] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => { setLanguage(lng); setMobileOpen(false); }}
                  className="py-2.5 text-xs font-medium border transition-colors"
                  style={{
                    color: language === lng ? "#00E5FF" : "#888",
                    borderColor: language === lng ? "#00E5FF" : "#333",
                    background: language === lng ? "rgba(0,229,255,0.05)" : "transparent",
                    letterSpacing: "0.06em",
                  }}
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
