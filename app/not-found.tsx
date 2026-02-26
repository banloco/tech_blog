"use client";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p
          className="text-7xl font-bold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#00E5FF" }}
        >
          404
        </p>
        <h1
          className="mt-4 text-2xl font-bold sm:text-3xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
        >
          Page introuvable
        </h1>
        <p className="mt-4 leading-relaxed" style={{ color: "#888" }}>
          Désolé, la page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all"
            style={{ background: "#C19A6B", color: "#121212" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b080")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C19A6B")}
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all"
            style={{ border: "1px solid #333", background: "#1a1a1a", color: "#888" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#e8e8e8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#888"; }}
          >
            <ArrowLeft className="w-4 h-4" />
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
