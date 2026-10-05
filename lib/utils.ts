/**
 * Generate a URL-friendly slug from a string.
 * Used for SEO-friendly article URLs.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

/**
 * Plain text from the editor's HTML (for excerpts, descriptions and word counts).
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Estimate reading time from content.
 */
export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = stripHtml(content).split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

/**
 * Format a date string to French locale.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Truncate text to a max length, respecting word boundaries.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, text.lastIndexOf(" ", maxLength)) + "…";
}

// ─── Tag Category Classification ─────────────────────────────────────────────

export type TagCategory = {
  label: string;
  color: string;
  bg: string;
  border: string;
};

const DEFAULT_CATEGORY: TagCategory = {
  label: "GUIDE",
  color: "#C19A6B",
  bg: "rgba(193,154,107,0.06)",
  border: "rgba(193,154,107,0.25)",
};

const EARN_CAT: TagCategory = {
  label: "REVENUS",
  color: "#0E7A4B",
  bg: "rgba(14,122,75,0.08)",
  border: "rgba(14,122,75,0.25)",
};
const FINANCE_CAT: TagCategory = {
  label: "FINANCES",
  color: "#B45309",
  bg: "rgba(180,83,9,0.08)",
  border: "rgba(180,83,9,0.25)",
};
const PROD_CAT: TagCategory = {
  label: "PRODUCTIVITÉ",
  color: "#1D4ED8",
  bg: "rgba(29,78,216,0.08)",
  border: "rgba(29,78,216,0.25)",
};
const TOOLS_CAT: TagCategory = {
  label: "OUTILS & IA",
  color: "#7C3AED",
  bg: "rgba(124,58,237,0.08)",
  border: "rgba(124,58,237,0.25)",
};

// Checked in this order; keywords are written without accents (tags are normalized the same way).
const TAG_KEYWORDS: Array<{ keywords: string[]; category: TagCategory }> = [
  { keywords: ["budget", "epargne", "epargner", "banque", "banques", "neobanque", "frais", "credit", "dette", "dettes", "arnaque", "arnaques", "impots", "economies", "mobile money", "argent"], category: FINANCE_CAT },
  { keywords: ["freelance", "revenu", "revenus", "side hustle", "vendre", "vente", "business", "clients", "client", "prix", "tarif", "tarifs", "gagner", "affiliation", "e-commerce"], category: EARN_CAT },
  { keywords: ["productivite", "organisation", "routine", "habitudes", "concentration", "focus", "temps", "objectifs", "methode", "to-do", "agenda"], category: PROD_CAT },
  { keywords: ["ia", "ai", "chatgpt", "gpt", "llm", "outil", "outils", "appli", "application", "app", "logiciel", "automatisation", "notion", "canva", "gratuit"], category: TOOLS_CAT },
];

const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Whole words only: a plain "includes" matched "ai" inside "paiement" and "ia" inside "social"
const hasWord = (text: string, keyword: string) =>
  new RegExp(`(^|[^a-z0-9])${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9])`).test(text);

export function getTagCategory(tag: string): TagCategory {
  const normalized = normalize(tag);
  for (const { keywords, category } of TAG_KEYWORDS) {
    if (keywords.some((kw) => hasWord(normalized, kw))) return category;
  }
  return DEFAULT_CATEGORY;
}
