/** The blog's identity, in one place: change the name, tagline or address here only. */
export const SITE = {
  name: "Le Plan B",
  tagline: "Gagner plus, dépenser mieux, travailler malin",
  description:
    "Astuces concrètes pour gagner un revenu en plus, mieux gérer son argent, être plus productif et profiter des meilleurs outils gratuits.",
  author: "Christ Banidje",
  authorUrl: "https://www.christbanidje.me",        // portfolio
  contactUrl: "https://www.christbanidje.me/#contact",
  // NEXT_PUBLIC_SITE_URL can override it (e.g. http://localhost:3000)
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://planb.danxolabs.com").replace(/\/$/, ""),
};

/** Full address of a page or image of the site ('/images/x.jpg' → 'https://…/images/x.jpg'). */
export function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Columns of a comment that visitors may see: never the author's email. */
export const PUBLIC_COMMENT_COLUMNS = "id, post_id, parent_id, author_name, content, likes_count, is_approved, created_at";
