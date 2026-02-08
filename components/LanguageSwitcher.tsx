"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
        aria-label="Change language"
      >
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-1 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => setLanguage("fr")}
            className={`w-full px-4 py-2 text-left text-sm transition-colors ${
              language === "fr"
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`w-full px-4 py-2 text-left text-sm transition-colors ${
              language === "en"
                ? "bg-emerald-500/10 text-emerald-400"
                : "text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>
    </div>
  );
}
