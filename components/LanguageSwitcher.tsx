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
        className="flex items-center gap-2 px-3 py-2 transition-colors"
        style={{ color: "#888" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
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
            className="overflow-hidden shadow-xl"
            style={{ background: "#1a1a1a", border: "1px solid #333" }}
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
                  ? "text-[#00E5FF] bg-[rgba(0,229,255,0.06)]"
                  : "text-[#888] hover:text-[#e8e8e8] hover:bg-[#222]"
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
                  ? "text-[#00E5FF] bg-[rgba(0,229,255,0.06)]"
                  : "text-[#888] hover:text-[#e8e8e8] hover:bg-[#222]"
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
