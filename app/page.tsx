import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import supabase from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import NewsletterForm from "@/components/NewsletterForm";
import { SITE } from "@/lib/site";

// Revalidate every 60s so new articles appear without a full rebuild (ISR)
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const POSTS_PER_PAGE = 9;

// Shown while the blog has fewer than 3 articles. Edit freely (or empty the list).
const COMING_SOON = [
  { category: "gagner-de-l-argent", title: "Gagner ses 100 premiers euros en freelance : le plan étape par étape" },
  { category: "finances-perso", title: "La méthode simple pour faire un budget qui tient vraiment" },
  { category: "outils-ia", title: "Les meilleures IA gratuites pour gagner une heure par jour" },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page) || 1);
  const from = (currentPage - 1) * POSTS_PER_PAGE;

  // In parallel; each part degrades to "nothing" if the database doesn't answer
  const [latestRes, popularRes, catRes] = await Promise.allSettled([
    supabase.from("posts").select("*, category:categories(*)", { count: "exact" })
      .eq("status", "published").order("published_at", { ascending: false, nullsFirst: false })
      .range(from, from + POSTS_PER_PAGE - 1),
    supabase.from("posts").select("*, category:categories(*)")
      .eq("status", "published").gt("views_count", 0).order("views_count", { ascending: false }).limit(4),
    supabase.from("posts").select("category:categories(slug)").eq("status", "published"),
  ]);

  const posts: Post[] = (latestRes.status === "fulfilled" && latestRes.value.data) || [];
  const total = (latestRes.status === "fulfilled" && latestRes.value.count) || 0;
  const popular: Post[] = (popularRes.status === "fulfilled" && popularRes.value.data) || [];
  const counts: Record<string, number> = {};
  if (catRes.status === "fulfilled") {
    for (const row of (catRes.value.data || []) as unknown as { category: { slug: string } | null }[]) {
      if (row.category) counts[row.category.slug] = (counts[row.category.slug] || 0) + 1;
    }
  }

  const firstPage = currentPage === 1;
  const [lead, ...rest] = posts;
  const comingSoon = total < 3 ? COMING_SOON : [];

  return (
    <div>
      {/* ── Hero: what the blog is about, and the newsletter right away ── */}
      {firstPage && (
        <section className="relative overflow-hidden border-b" style={{ borderColor: "var(--line)" }}>
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: "var(--sun)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full opacity-20 blur-3xl" style={{ background: "var(--brand)" }} />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow" style={{ color: "var(--brand)" }}>Revenus en plus · Argent · Productivité · Outils gratuits</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl" style={{ color: "var(--ink)" }}>
                Gagnez plus, dépensez mieux, travaillez <span className="marker">malin</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Des astuces concrètes et testées pour vous créer un revenu en plus, mieux gérer votre argent, gagner du temps et profiter des meilleurs outils gratuits.
              </p>
              <div className="mt-7 max-w-xl"><NewsletterForm size="large" /></div>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                {["Astuces testées, chiffres à l'appui", "Outils gratuits ou abordables", "Zéro promesse miracle"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" style={{ color: "var(--brand)" }} aria-hidden="true" />{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* The four themes, as entry points */}
            <ul className="grid grid-cols-2 gap-3" aria-label="Thèmes du blog">
              {CATEGORIES.map(({ slug, name, tagline, icon: Icon, color }) => (
                <li key={slug}>
                  <Link href={`/categorie/${slug}`} className="card card-link flex h-full flex-col p-4 sm:p-5">
                    <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                      <Icon className="h-6 w-6" style={{ color }} aria-hidden="true" />
                    </span>
                    <span className="mt-3 font-bold leading-tight" style={{ color: "var(--ink)" }}>{name}</span>
                    <span className="mt-1 hidden text-sm leading-snug sm:block" style={{ color: "var(--text-muted)" }}>{tagline}</span>
                    <span className="mt-auto pt-3 text-xs font-semibold" style={{ color }}>
                      {counts[slug] ? `${counts[slug]} article${counts[slug] > 1 ? "s" : ""}` : "Bientôt"} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div id="articles" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6">
        {posts.length > 0 ? (
          <>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold" style={{ color: "var(--ink)" }}>
                {firstPage ? "Derniers articles" : `Articles, page ${currentPage}`}
              </h2>
            </div>
            {firstPage && lead && <div className="mb-8"><PostCard post={lead} variant="featured" /></div>}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(firstPage ? rest : posts).map((post) => <PostCard key={post.id} post={post} />)}
            </div>
            <Suspense><Pagination totalPages={Math.ceil(total / POSTS_PER_PAGE)} /></Suspense>
          </>
        ) : (
          <div className="card p-8 text-center sm:p-12">
            <h2 className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>Les premiers guides arrivent</h2>
            <p className="mx-auto mt-2 max-w-lg" style={{ color: "var(--text-muted)" }}>
              Inscrivez-vous à la newsletter pour les recevoir dès leur publication.
            </p>
          </div>
        )}

        {/* What's coming, while the blog is young */}
        {firstPage && comingSoon.length > 0 && (
          <section className="mt-12" aria-labelledby="coming-title">
            <h2 id="coming-title" className="text-xl font-extrabold" style={{ color: "var(--ink)" }}>Au programme</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {comingSoon.map(({ category, title }) => {
                const cat = CATEGORIES.find((c) => c.slug === category)!;
                const Icon = cat.icon;
                return (
                  <li key={title} className="flex items-start gap-3 rounded-[var(--radius)] border border-dashed p-4" style={{ borderColor: "var(--line-strong)" }}>
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: cat.color }} aria-hidden="true" />
                    <span className="font-semibold leading-snug" style={{ color: "var(--ink)" }}>{title}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Most read (only once there are real views to rank) */}
        {firstPage && popular.length >= 2 && (
          <section className="mt-14" aria-labelledby="popular-title">
            <h2 id="popular-title" className="text-xl font-extrabold" style={{ color: "var(--ink)" }}>Les plus lus</h2>
            <ol className="mt-2 grid gap-x-8 divide-y sm:grid-cols-2 sm:divide-y-0" style={{ borderColor: "var(--line)" }}>
              {popular.map((post, i) => (
                <li key={post.id} className="flex items-start gap-4">
                  <span className="pt-4 font-display text-3xl font-extrabold" style={{ color: "var(--line-strong)" }}>{i + 1}</span>
                  <PostCard post={post} variant="compact" />
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Who writes */}
        {firstPage && (
          <section className="card mt-14 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8" aria-labelledby="author-title">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-display text-2xl font-extrabold text-white" style={{ background: "var(--brand)" }} aria-hidden="true">C</span>
            <div className="flex-1">
              <h2 id="author-title" className="text-lg font-extrabold" style={{ color: "var(--ink)" }}>Qui écrit ici ?</h2>
              <p className="mt-1" style={{ color: "var(--text-muted)" }}>
                Moi,{" "}
                <a href={SITE.authorUrl} target="_blank" rel="noopener" className="font-semibold underline" style={{ color: "var(--brand)" }}>{SITE.author}</a>,
                développeur. Je teste des façons de gagner plus et de travailler mieux, et je partage ici ce qui marche vraiment, erreurs comprises.
              </p>
            </div>
            <Link href="/about" className="btn btn-ghost shrink-0">En savoir plus <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </section>
        )}
      </div>
    </div>
  );
}
