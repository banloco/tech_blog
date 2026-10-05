/** The blog's identity, in one place: change the name, tagline or address here only. */
export const SITE = {
  name: "Le Plan B",
  tagline: "Gagner plus, dépenser mieux, travailler malin",
  description:
    "Astuces concrètes pour gagner un revenu en plus, mieux gérer son argent, être plus productif et profiter des meilleurs outils gratuits.",
  author: "Christ Banidje",
  authorUrl: "https://www.christbanidje.me",        // portfolio
  contactUrl: "https://www.christbanidje.me/#contact",
  // Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is connected
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://tech-blog-gamma-bice.vercel.app").replace(/\/$/, ""),
};
