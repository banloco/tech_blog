"use client";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p
          className="text-7xl font-bold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--brand)" }}
        >
          404
        </p>
        <h1
          className="mt-4 text-2xl font-bold sm:text-3xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}
        >
          Page introuvable
        </h1>
        <p className="mt-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Désolé, la page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest transition-all"
            style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-dim)"; e.currentTarget.style.color = "var(--ink)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <ArrowLeft className="w-4 h-4" />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
