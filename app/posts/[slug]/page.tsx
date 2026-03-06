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
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Try to find by slug first, then by id
  let { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, content, meta_title, meta_description, cover_image, slug")
    .eq("slug", slug)
    .single();

  if (!post) {
    const { data: postById } = await supabase
      .from("posts")
      .select("title, excerpt, content, meta_title, meta_description, cover_image, slug")
      .eq("id", slug)
      .single();
    post = postById;
  }

  if (!post) return { title: "Article introuvable" };

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.content?.substring(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
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
  const { slug } = await params;

  // Try to get the post by slug first, then by id if slug doesn't work
  let { data: post } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  // If not found by slug and the param looks like a number (uuid), try by id
  if (!post && slug) {
    const { data: postById } = await supabase
      .from("posts")
      .select("*, category:categories(*)")
      .eq("id", slug)
      .single();
    post = postById;
  }

  if (!post) {
    notFound();
  }

  // Then get comments using the post id
  const { data: commentsData } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: true });

  const allComments = commentsData || [];
  const readTime = estimateReadTime(post.content || "");

  // JSON-LD structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-and-capital.tech";
  const postUrl = `${siteUrl}/posts/${post.slug || post.id}`;
  const publishDate = post.published_at || post.created_at;
  const wordCount = post.content
    ? post.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length
    : undefined;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": postUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      url: postUrl,
      headline: post.title,
      description: post.excerpt || post.meta_description || post.content?.replace(/<[^>]+>/g, "").substring(0, 160),
      datePublished: publishDate,
      dateModified: post.updated_at || publishDate,
      inLanguage: "fr-FR",
      ...(post.cover_image && {
        image: {
          "@type": "ImageObject",
          url: post.cover_image,
          contentUrl: post.cover_image,
        },
      }),
      author: {
        "@type": "Person",
        name: "Christ Banidje",
        url: `${siteUrl}/about`,
      },
      publisher: {
        "@type": "Organization",
        name: "IA & Capital",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/icon.png`,
        },
      },
      ...(post.tags?.length && { keywords: post.tags.join(", ") }),
      ...((post as any).category?.name && { articleSection: (post as any).category.name }),
      ...(wordCount && { wordCount }),
      ...(allComments.length > 0 && { commentCount: allComments.length }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Articles", item: `${siteUrl}/#articles` },
        { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm flex-wrap" style={{ color: "#555" }}>
              <li><Link href="/" className="transition-colors hover:text-[#e8e8e8]" style={{ color: "#888" }}>Accueil</Link></li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li><Link href="/#articles" className="transition-colors hover:text-[#e8e8e8]" style={{ color: "#888" }}>Articles</Link></li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li className="truncate max-w-[200px] sm:max-w-none" style={{ color: "#aaa" }}>{post.title}</li>
          </ol>
        </nav>

        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors mb-8 hover:text-[#e8e8e8]"
          style={{ color: "#888" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux articles
        </Link>

        {/* Article Header */}
        <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-4" style={{ color: "#555" }}>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="w-1 h-1" style={{ background: "#444" }} />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readTime} de lecture
              </span>
              {post.views_count !== undefined && (
                <>
                  <span className="w-1 h-1" style={{ background: "#444" }} />
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {post.views_count} {post.views_count > 1 ? "vues" : "vue"}
                  </span>
                </>
              )}
              <span className="w-1 h-1" style={{ background: "#444" }} />
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {allComments.length} {allComments.length > 1 ? "commentaires" : "commentaire"}
              </span>
            </div>

            <ViewCounter postId={post.id} />

            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed" style={{ color: "#888" }}>
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider px-2.5 py-1"
                    style={{ background: "#1a1a1a", color: "#888", border: "1px solid #333" }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div
              className="mt-6 pt-4 flex items-center justify-between gap-4 flex-wrap"
              style={{ borderTop: "1px solid #2a2a2a" }}
            >
              <ShareButtons
                url={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/posts/${post.slug || post.id}`}
                title={post.title}
              />
              <ArticleLikeButton postId={post.id} initialLikes={post.likes_count || 0} />
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image && (
            <div
              className="mb-10 overflow-hidden relative aspect-video"
              style={{ border: "1px solid #2a2a2a" }}
            >
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
            className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-white text-lg leading-relaxed ProseMirror"
            style={{ color: "#aaa" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Divider */}
          <hr className="my-12" style={{ borderColor: "#2a2a2a" }} />
        {/* Comments Section */}
        <CommentSection postId={post.id} initialComments={allComments} />
      </main>
    </>
  );
}
