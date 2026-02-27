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
  label: "ANALYSE",
  color: "#C19A6B",
  bg: "rgba(193,154,107,0.06)",
  border: "rgba(193,154,107,0.25)",
};

const AI_CAT: TagCategory = {
  label: "AI",
  color: "#00E5FF",
  bg: "rgba(0,229,255,0.06)",
  border: "rgba(0,229,255,0.25)",
};
const CRYPTO_CAT: TagCategory = {
  label: "CRYPTO",
  color: "#a78bfa",
  bg: "rgba(167,139,250,0.06)",
  border: "rgba(167,139,250,0.25)",
};
const ALGO_CAT: TagCategory = {
  label: "ALGO",
  color: "#C19A6B",
  bg: "rgba(193,154,107,0.06)",
  border: "rgba(193,154,107,0.25)",
};
const VC_CAT: TagCategory = {
  label: "VC",
  color: "#60a5fa",
  bg: "rgba(96,165,250,0.06)",
  border: "rgba(96,165,250,0.25)",
};
const MACRO_CAT: TagCategory = {
  label: "MACRO",
  color: "#9ca3af",
  bg: "rgba(156,163,175,0.06)",
  border: "rgba(156,163,175,0.2)",
};
const DEFI_CAT: TagCategory = {
  label: "DeFi",
  color: "#a78bfa",
  bg: "rgba(167,139,250,0.06)",
  border: "rgba(167,139,250,0.25)",
};

const TAG_KEYWORDS: Array<{ keywords: string[]; category: TagCategory }> = [
  { keywords: ["ai", "ia", "intelligence artificielle", "llm", "gpt", "machine learning", "ml", "deep learning", "neural", "openai", "mistral", "gemini", "claude"], category: AI_CAT },
  { keywords: ["defi", "décentralisé", "decentralized", "uniswap", "aave", "compound"], category: DEFI_CAT },
  { keywords: ["crypto", "bitcoin", "btc", "ethereum", "eth", "blockchain", "nft", "altcoin", "solana", "xrp"], category: CRYPTO_CAT },
  { keywords: ["algo", "algorithme", "algorithmic", "trading", "quant", "quantitatif", "backtest", "stratégie", "hft"], category: ALGO_CAT },
  { keywords: ["vc", "startup", "levée", "financement", "seed", "series", "venture", "investisseur", "licorne", "unicorn"], category: VC_CAT },
  { keywords: ["bourse", "finance", "macro", "économie", "economie", "indices", "marché", "marche", "cac", "nasdaq", "s&p", "fed", "bce", "inflation", "taux"], category: MACRO_CAT },
];

export function getTagCategory(tag: string): TagCategory {
  const normalized = tag.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const { keywords, category } of TAG_KEYWORDS) {
    if (keywords.some((kw) => normalized.includes(kw))) return category;
  }
  return DEFAULT_CATEGORY;
}
