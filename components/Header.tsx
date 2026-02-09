"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Menu, X } from "lucide-react";
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
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element when menu opens
      firstElement?.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
        if (e.key === 'Escape') {
          setMobileOpen(false);
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    } else if (!mobileOpen && triggerRef.current) {
      // Restore focus to trigger button when menu closes
      triggerRef.current.focus();
    }
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Accueil IA & Capital">
          <Image src={logo} alt="IA & Capital" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <span className="text-base sm:text-lg lg:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            IA<span className="text-emerald-400">&</span>Capital
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href
                  ? "text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher - Desktop */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <a
            href="#newsletter"
            className="hidden sm:flex items-center gap-2 bg-zinc-900 text-white px-3 lg:px-4 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-all text-xs lg:text-sm"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden lg:inline">{t("newsletter")}</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            ref={triggerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800 text-white transition-colors"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          
          {/* Sidebar */}
          <div
            ref={menuRef}
            id="mobile-menu"
            className="fixed right-0 top-0 bottom-0 w-72 bg-zinc-950 border-l border-zinc-800 md:hidden z-50 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <span className="text-lg font-bold text-white">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  aria-label={t("closeMenu")}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === href
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                
                {/* Newsletter Button */}
                <a
                  href="#newsletter"
                  className="block mt-4 px-4 py-3 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-all text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Wallet className="w-4 h-4" />
                    {t("subscribeNewsletter")}
                  </div>
                </a>
              </nav>

              {/* Language Switcher - Mobile */}
              <div className="p-4 border-t border-zinc-800">
                <div className="mb-2 text-xs text-zinc-500 uppercase tracking-wider">
                  Language
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage("fr")}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      language === "fr"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-300 hover:text-white"
                    }`}
                  >
                    🇫🇷 FR
                  </button>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      language === "en"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-300 hover:text-white"
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}