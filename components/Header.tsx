"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../public/ia_&_capital.png";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Accueil IA & Capital">
          <Image src={logo} alt="IA & Capital" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            IA<span className="text-emerald-400">&</span>Capital
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="#newsletter"
            className="hidden sm:flex items-center gap-2 bg-zinc-900 text-white px-3 lg:px-4 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-all text-sm"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden lg:inline">Newsletter</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800 text-white transition-colors"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href="#newsletter"
              className="mt-2 flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-emerald-400 transition-all"
            >
              <Wallet className="w-4 h-4" />
              S'abonner à la newsletter
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}