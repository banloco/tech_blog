"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageSelect = (lang: "fr" | "en") => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
        aria-label="Changer la langue"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Languages className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 z-50">
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden"
            role="menu"
            aria-label="Sélectionner la langue"
          >
            <button
              role="menuitem"
              onClick={() => handleLanguageSelect("fr")}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsOpen(false);
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
                }
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                language === "fr"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
              aria-current={language === "fr" ? "true" : undefined}
            >
              🇫🇷 Français
            </button>
            <button
              role="menuitem"
              onClick={() => handleLanguageSelect("en")}
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsOpen(false);
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
                }
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                language === "en"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-zinc-300 hover:bg-zinc-800"
              }`}
              aria-current={language === "en" ? "true" : undefined}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
