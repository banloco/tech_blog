"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { analyzeSeo, seoScore, type SeoInput } from "@/lib/seo";
import { SITE } from "@/lib/site";

/** Live SEO help in the article form: Google preview + checklist. */
export default function SeoPanel(props: SeoInput) {
  const checks = analyzeSeo(props);
  const score = seoScore(checks);
  const color = score >= 80 ? "var(--brand)" : score >= 50 ? "var(--accent)" : "var(--danger)";
  const title = props.metaTitle || props.title || "Titre de l'article";
  const description = props.metaDescription || props.excerpt || "La description apparaîtra ici dans les résultats Google.";
  const host = SITE.url.replace(/^https?:\/\//, "");

  return (
    <div className="space-y-4">
      {/* What the article will look like in Google */}
      <div>
        <p className="mb-1.5 text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Aperçu Google</p>
        <div className="rounded-lg border p-3" style={{ borderColor: "var(--line)", background: "#fff", fontFamily: "Arial, sans-serif" }}>
          <p className="truncate text-xs" style={{ color: "#4d5156" }}>{host} › posts › {props.slug || "adresse"}</p>
          <p className="mt-0.5 line-clamp-1 text-lg leading-snug" style={{ color: "#1a0dab" }}>{title}</p>
          <p className="mt-0.5 line-clamp-2 text-sm" style={{ color: "#4d5156" }}>{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Vérifications</p>
        <span className="rounded-full px-2.5 py-0.5 text-sm font-bold text-white" style={{ background: color }}>{score}/100</span>
      </div>
      <ul className="space-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-2 text-sm" style={{ color: c.level === "ok" ? "var(--text-muted)" : "var(--ink)" }}>
            {c.level === "ok" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--brand)" }} aria-label="OK" />}
            {c.level === "warn" && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} aria-label="À améliorer" />}
            {c.level === "error" && <XCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--danger)" }} aria-label="Bloquant" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
