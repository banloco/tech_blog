import { stripHtml } from "./utils";
import { SITE } from "./site";

/** Marker left by the writing agents where the author must add his own experience. */
export const TODO_MARKER = /\[À COMPLÉTER[^\]]*\]/gi;

export interface SeoInput {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  slug: string;
  content: string;      // HTML from the editor
  keyword: string;      // focus keyword
  categoryId: string;
  coverImage: string;
}

export type CheckLevel = "ok" | "warn" | "error";
export interface SeoCheck { level: CheckLevel; label: string; }

// Accents and case don't matter when looking for the keyword ("Épargne" = "epargne")
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’-]/g, " ");
const includesKw = (text: string, kw: string) => !!kw && norm(text).includes(norm(kw));

export const SEO_LIMITS = { titleMin: 30, titleMax: 65, descMin: 110, descMax: 160, minWords: 900 };

export function analyzeSeo(i: SeoInput): SeoCheck[] {
  const checks: SeoCheck[] = [];
  const add = (ok: boolean, label: string, level: CheckLevel = "warn") => checks.push({ level: ok ? "ok" : level, label });

  const seoTitle = i.metaTitle || i.title;
  const description = i.metaDescription || i.excerpt;
  const text = stripHtml(i.content);
  const words = text.split(/\s+/).filter(Boolean).length;
  const firstParagraph = stripHtml((i.content.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [, ""])[1] || "");
  const h2s = [...i.content.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripHtml(m[1]));
  const images = [...i.content.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const links = [...i.content.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  const markers = i.content.match(TODO_MARKER) || [];

  // Blocking: an agent's draft that hasn't been completed
  add(markers.length === 0, markers.length
    ? `${markers.length} repère(s) « [À COMPLÉTER] » à remplacer avant de publier`
    : "Aucun repère « [À COMPLÉTER] » restant", "error");

  // Focus keyword
  if (!i.keyword.trim()) {
    checks.push({ level: "warn", label: "Choisissez un mot-clé principal (ce que les gens tapent dans Google)" });
  } else {
    add(includesKw(seoTitle, i.keyword), "Mot-clé dans le titre SEO");
    add(includesKw(description, i.keyword), "Mot-clé dans la description SEO");
    add(includesKw(i.slug.replace(/-/g, " "), i.keyword), "Mot-clé dans l'adresse (slug)");
    add(includesKw(firstParagraph, i.keyword), "Mot-clé dans le premier paragraphe");
    add(h2s.some((h) => includesKw(h, i.keyword)), "Mot-clé dans au moins un intertitre (H2)");
  }

  // Lengths
  add(seoTitle.length >= SEO_LIMITS.titleMin && seoTitle.length <= SEO_LIMITS.titleMax,
    `Titre SEO de ${SEO_LIMITS.titleMin} à ${SEO_LIMITS.titleMax} caractères (actuellement ${seoTitle.length})`);
  add(description.length >= SEO_LIMITS.descMin && description.length <= SEO_LIMITS.descMax,
    `Description de ${SEO_LIMITS.descMin} à ${SEO_LIMITS.descMax} caractères (actuellement ${description.length})`);
  add(words >= SEO_LIMITS.minWords, `Au moins ${SEO_LIMITS.minWords} mots (actuellement ${words})`);

  // Structure
  add(h2s.length >= 2, `Au moins 2 intertitres H2 (actuellement ${h2s.length})`);
  add(!/<h1[\s>]/i.test(i.content), "Pas de H1 dans le texte (le titre de la page en est déjà un)", "error");
  add(images.every((img) => /\balt="[^"]+"/i.test(img)), "Toutes les images du texte ont une description (alt)");
  add(links.some((l) => l.startsWith("/") || l.startsWith(SITE.url)), "Au moins un lien vers un autre article du blog");
  add(links.some((l) => /^https?:\/\//.test(l) && !l.startsWith(SITE.url)), "Au moins une source externe (lien)");
  add(!!i.categoryId, "Une catégorie est choisie");
  add(!!i.coverImage, "Une image de couverture (plus de clics, meilleur partage)");
  add(!!i.excerpt.trim(), "Un extrait est rédigé (affiché sur les cartes d'articles)");
  add(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(i.slug) && i.slug.split("-").length <= 8, "Adresse courte et propre (8 mots maximum)");

  return checks;
}

/** 0–100, for the summary badge. Errors count double. */
export function seoScore(checks: SeoCheck[]): number {
  const weight = (c: SeoCheck) => (c.level === "error" ? 2 : 1);
  const total = checks.reduce((n, c) => n + weight(c), 0);
  const ok = checks.filter((c) => c.level === "ok").reduce((n, c) => n + weight(c), 0);
  return total ? Math.round((ok / total) * 100) : 0;
}
