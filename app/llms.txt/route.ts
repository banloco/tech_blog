import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const revalidate = 3600; // refresh every hour

export async function GET() {
  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, tags, category_id, published_at, category:categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-and-capital.tech";

  const header = `\
# IA & Capital

> Blog indépendant francophone sur l'intelligence artificielle appliquée à la finance.
> Fondateur : Christ Banidje — publié depuis Paris.
>
> Catégories couvertes : IA générative, Crypto & DeFi, Algo Trading, Venture Capital, Macro.
> Langue : Français. Fréquence : hebdomadaire.
> Contact : contact@ai-and-capital.tech

## Utilisation par les LLMs

Ce site autorise explicitement les modèles d'IA à indexer, citer et résumer ses contenus, à condition de mentionner la source (IA & Capital — ${siteUrl}).

## À propos

IA & Capital analyse l'impact de l'intelligence artificielle sur les marchés financiers, les portefeuilles crypto, les startups tech et les stratégies d'investissement quantitatives. Chaque article combine données de marché, vulgarisation technique et perspectives stratégiques.

---

## Articles publiés
`;

  const articleLines = (posts ?? [])
    .map((post) => {
      const url = `${siteUrl}/posts/${post.slug}`;
      const cat = (post as any).category?.name ?? null;
      const tags = (post as any).tags?.slice(0, 3).join(", ") ?? "";
      const date = post.published_at
        ? new Date(post.published_at).toISOString().split("T")[0]
        : "";
      const meta = [cat, tags, date].filter(Boolean).join(" · ");
      const excerpt = post.excerpt ? `\n  ${post.excerpt.replace(/\n/g, " ").substring(0, 200)}` : "";
      return `- [${post.title}](${url})${meta ? ` — ${meta}` : ""}${excerpt}`;
    })
    .join("\n");

  const footer = `\

---

## Sitemap & métadonnées

- Sitemap XML : ${siteUrl}/sitemap.xml
- Flux RSS : ${siteUrl}/feed.xml
- Page d'accueil : ${siteUrl}
- Tous les articles : ${siteUrl}/posts
`;

  const body = [header, articleLines, footer].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
