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
 * Estimate reading time from content.
 */
export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
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

const MONEY_CAT: TagCategory = {
  label: "MOBILE MONEY",
  color: "#34d399",
  bg: "rgba(52,211,153,0.06)",
  border: "rgba(52,211,153,0.25)",
};
const BUSINESS_CAT: TagCategory = {
  label: "BUSINESS",
  color: "#C19A6B",
  bg: "rgba(193,154,107,0.06)",
  border: "rgba(193,154,107,0.25)",
};
const DEV_CAT: TagCategory = {
  label: "DEV",
  color: "#60a5fa",
  bg: "rgba(96,165,250,0.06)",
  border: "rgba(96,165,250,0.25)",
};
const AI_CAT: TagCategory = {
  label: "IA",
  color: "#00E5FF",
  bg: "rgba(0,229,255,0.06)",
  border: "rgba(0,229,255,0.25)",
};

// Checked in this order; keywords are written without accents (tags are normalized the same way).
const TAG_KEYWORDS: Array<{ keywords: string[]; category: TagCategory }> = [
  { keywords: ["mobile money", "momo", "paiement", "paiements", "payment", "fedapay", "kkiapay", "mtn", "moov", "wave", "orange money", "transfert", "fintech"], category: MONEY_CAT },
  { keywords: ["ia", "ai", "intelligence artificielle", "llm", "gpt", "chatgpt", "ollama", "mistral", "gemini", "claude", "chatbot", "machine learning"], category: AI_CAT },
  { keywords: ["dev", "code", "tuto", "tutoriel", "site", "web", "nextjs", "next.js", "react", "javascript", "python", "api", "app", "application", "automatisation", "wordpress"], category: DEV_CAT },
  { keywords: ["business", "entrepreneur", "entrepreneuriat", "client", "clients", "prix", "tarif", "tarifs", "freelance", "vente", "marketing", "startup", "agence"], category: BUSINESS_CAT },
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
