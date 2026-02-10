import supabase from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { formatDate, estimateReadTime } from "@/lib/utils";
import { Calendar, Clock, ArrowLeft, Tag, ChevronRight, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";
import ShareButtons from "@/components/ShareButtons";
import ViewCounter from "@/components/ViewCounter";
import ArticleLikeButton from "@/components/ArticleLikeButton";
import type { Comment } from "@/lib/types";

// ISR: revalidate article pages every 30 seconds for faster comment updates
export const revalidate = 30;


type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, content, meta_title, meta_description, cover_image, slug")
    .eq("id", id)
    .single();

  if (!post) return { title: "Article introuvable" };

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.content?.substring(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: post.cover_image ? [post.cover_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const [postResult, commentsResult] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).single(),
    supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .eq("is_approved", true)
      .order("created_at", { ascending: true }),
  ]);

  const post = postResult.data;
  const allComments = commentsResult.data || [];

  if (!post) {
    notFound();
  }

  const readTime = estimateReadTime(post.content || "");

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content?.substring(0, 160),
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    image: post.cover_image || undefined,
    author: {
      "@type": "Organization",
      name: "IA & Capital",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500 flex-wrap">
            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li><Link href="/#articles" className="hover:text-white transition-colors">Articles</Link></li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li className="text-zinc-300 truncate max-w-[200px] sm:max-w-none">{post.title}</li>
          </ol>
        </nav>

        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux articles
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.created_at)}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime} de lecture
            </span>
            {post.views_count !== undefined && (
              <>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views_count} {post.views_count > 1 ? "vues" : "vue"}
                </span>
              </>
            )}
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {allComments.length} {allComments.length > 1 ? "commentaires" : "commentaire"}
            </span>
          </div>

          <ViewCounter postId={post.id} />

          <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Buttons */}
          <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between gap-4 flex-wrap">
            <ShareButtons
              title={post.title}
              url={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/posts/${post.id}`}
            />
            <ArticleLikeButton postId={post.id} initialLikes={post.likes_count || 0} />
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-10 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 relative aspect-video">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Article Content */}
        <article 
          className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-emerald-400 prose-strong:text-white text-lg leading-relaxed ProseMirror"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <hr className="my-12 border-zinc-800" />

        {/* Comments Section */}
        <CommentSection postId={post.id} initialComments={allComments} />
      </main>
    </>
  );
}