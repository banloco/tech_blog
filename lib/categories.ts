import { Banknote, PiggyBank, Timer, Wrench, BookOpen, type LucideIcon } from "lucide-react";
import type { Category } from "./types";

/** How each theme looks and is introduced on the site. The database only gives us name and
 *  slug: its color columns are ignored (they were picked for the old dark theme). */
export interface CategoryInfo {
  slug: string;
  name: string;
  short: string;        // short label for badges and the menu
  color: string;        // readable on the light background (AA contrast)
  icon: LucideIcon;
  tagline: string;      // one line, on cards
  description: string;  // a paragraph, on the theme page
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "gagner-de-l-argent",
    name: "Gagner de l'argent",
    short: "Revenus",
    color: "var(--cat-earn)",
    icon: Banknote,
    tagline: "Freelance, vente en ligne, revenus complémentaires qui marchent.",
    description:
      "Des idées testées pour gagner un revenu en plus, en ligne ou près de chez soi : freelance, vente de services, petits business, avec ce que ça rapporte vraiment et ce que ça demande.",
  },
  {
    slug: "finances-perso",
    name: "Finances perso",
    short: "Finances",
    color: "var(--cat-finance)",
    icon: PiggyBank,
    tagline: "Budget, épargne, banques et arnaques à éviter.",
    description:
      "Mieux gérer son argent au quotidien : faire un budget qui tient, épargner sans se priver, choisir sa banque, payer moins de frais et repérer les arnaques. Des conseils pratiques, pas des conseils en investissement.",
  },
  {
    slug: "productivite",
    name: "Productivité",
    short: "Productivité",
    color: "var(--cat-prod)",
    icon: Timer,
    tagline: "S'organiser, aller plus vite, tenir ses objectifs.",
    description:
      "Méthodes, routines et habitudes pour faire plus en moins de temps, sans s'épuiser : organiser sa semaine, se concentrer, avancer enfin sur ses projets.",
  },
  {
    slug: "outils-ia",
    name: "Outils & IA gratuits",
    short: "Outils & IA",
    color: "var(--cat-tools)",
    icon: Wrench,
    tagline: "Les applis et IA gratuites qui font gagner du temps.",
    description:
      "Les meilleurs outils gratuits, et comment s'en servir : IA, applications, sites et automatisations qui font gagner du temps ou de l'argent, avec des tutoriels pas à pas.",
  },
];

const FALLBACK: Omit<CategoryInfo, "slug" | "name" | "short"> = {
  color: "var(--accent)",
  icon: BookOpen,
  tagline: "",
  description: "",
};

export function categoryInfo(category?: Pick<Category, "slug" | "name"> | null): CategoryInfo | null {
  if (!category) return null;
  const known = CATEGORIES.find((c) => c.slug === category.slug);
  return known ?? { ...FALLBACK, slug: category.slug, name: category.name, short: category.name };
}
