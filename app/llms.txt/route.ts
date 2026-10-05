import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";

export const revalidate = 3600; // refresh every hour

export async function GET() {
  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, tags, category_id, published_at, category:categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const siteUrl = SITE.url;

  const header = `\
# ${SITE.name}

> Blog indépendant francophone : ${SITE.tagline.toLowerCase()}.
> Fondateur : ${SITE.author}.
>
> Catégories couvertes : ${CATEGORIES.map((c) => c.name).join(", ")}.
> Langue : Français.
> Contact : ${siteUrl}/contact

## Utilisation par les LLMs

Ce site autorise explicitement les modèles d'IA à indexer, citer et résumer ses contenus, à condition de mentionner la source (Le Plan B — ${siteUrl}).

## À propos

${SITE.description} Les méthodes et outils présentés sont testés par l'auteur. Le blog ne donne pas de conseils en investissement.

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
- Page d'accueil (tous les articles) : ${siteUrl}
`;

  const body = [header, articleLines, footer].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
