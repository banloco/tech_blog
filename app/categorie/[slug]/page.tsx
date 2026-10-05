import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import supabase from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";
import type { Post } from "@/lib/types";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 60;

const POSTS_PER_PAGE = 12;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export function generateStaticParams() {
  return CATEGORIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Thème introuvable" };
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/categorie/${slug}` },
    openGraph: { title: `${cat.name} | Le Plan B`, description: cat.description },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const Icon = cat.icon;

  const currentPage = Math.max(1, Number((await searchParams)?.page) || 1);
  const from = (currentPage - 1) * POSTS_PER_PAGE;

  let posts: Post[] = [];
  let total = 0;
  const { data: row } = await supabase.from("categories").select("id").eq("slug", slug).maybeSingle();
  if (row) {
    const { data, count } = await supabase.from("posts").select("*, category:categories(*)", { count: "exact" })
      .eq("status", "published").eq("category_id", row.id)
      .order("published_at", { ascending: false, nullsFirst: false })
      .range(from, from + POSTS_PER_PAGE - 1);
    posts = data || [];
    total = count || 0;
  }

  return (
    <div>
      <section className="border-b" style={{ borderColor: "var(--line)", background: `color-mix(in srgb, ${cat.color} 6%, var(--bg))` }}>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Fil d'Ariane" className="text-sm" style={{ color: "var(--text-dim)" }}>
            <Link href="/" className="hover:underline">Accueil</Link> <span aria-hidden="true">/</span> Thèmes
          </nav>
          <div className="mt-5 flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: `color-mix(in srgb, ${cat.color} 14%, transparent)` }}>
              <Icon className="h-7 w-7" style={{ color: cat.color }} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl" style={{ color: "var(--ink)" }}>{cat.name}</h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>{cat.description}</p>
            </div>
          </div>
          {/* The other themes, one tap away */}
          <ul className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
              <li key={c.slug}>
                <Link href={`/categorie/${c.slug}`} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--ink)]"
                  style={{ borderColor: "var(--line-strong)", color: "var(--text-muted)", background: "var(--surface)" }}>
                  <c.icon className="h-4 w-4" style={{ color: c.color }} aria-hidden="true" /> {c.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div id="articles" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6">
        {posts.length > 0 ? (
          <>
            <p className="mb-6 text-sm" style={{ color: "var(--text-dim)" }}>{total} article{total > 1 ? "s" : ""}</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
            <Suspense><Pagination totalPages={Math.ceil(total / POSTS_PER_PAGE)} /></Suspense>
          </>
        ) : (
          <div className="card mx-auto max-w-2xl p-8 text-center sm:p-10">
            <h2 className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>Les premiers articles arrivent</h2>
            <p className="mt-2" style={{ color: "var(--text-muted)" }}>
              Aucun article dans ce thème pour l&apos;instant. Laissez votre email pour être prévenu dès la sortie du premier.
            </p>
            <div className="mx-auto mt-6 max-w-md text-left"><NewsletterForm /></div>
          </div>
        )}
      </div>
    </div>
  );
}
