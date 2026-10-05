"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { slugify, stripHtml, truncate } from "@/lib/utils";
import { TODO_MARKER } from "@/lib/seo";
import SeoPanel from "./SeoPanel";
import { Save, Loader2, ArrowLeft, Eye, Upload, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Post, Category } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";

interface ArticleFormProps {
  article?: Post;
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const isEditing = !!article;
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [content, setContent] = useState(article?.content || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [coverImage, setCoverImage] = useState(article?.cover_image || "");
  const [tagsInput, setTagsInput] = useState(
    (article?.tags || []).join(", ")
  );
  const [categoryId, setCategoryId] = useState<string>(article?.category_id ?? "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"draft" | "published">(
    article?.status || "draft"
  );
  const [metaTitle, setMetaTitle] = useState(article?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    article?.meta_description || ""
  );
  const [focusKeyword, setFocusKeyword] = useState(article?.focus_keyword || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data as Category[]);
      });
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing || slug === slugify(article?.title || "")) {
      setSlug(slugify(value));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError("");
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("articles")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("articles").getPublicUrl(filePath);
      setCoverImage(data.publicUrl);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // An agent's draft must be completed by the author before it goes live
    const markers = content.match(TODO_MARKER);
    if (status === "published" && markers) {
      setError(`Impossible de publier : ${markers.length} repère(s) « [À COMPLÉTER] » sont encore dans le texte. Remplacez-les par votre expérience ou supprimez-les.`);
      return;
    }
    // Changing the address of a live article breaks every link already shared
    if (isEditing && article?.status === "published" && slug !== article.slug &&
        !window.confirm("Cet article est déjà en ligne : changer son adresse cassera les liens déjà partagés (WhatsApp, Google…). Continuer ?")) {
      return;
    }
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Set published_at only the first time an article is published
    const isNowPublished = status === "published";
    const wasAlreadyPublished = article?.status === "published";
    const existingPublishedAt = article?.published_at;
    const publishedAt = isNowPublished
      ? wasAlreadyPublished && existingPublishedAt
        ? existingPublishedAt
        : new Date().toISOString()
      : null;

    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || truncate(stripHtml(content), 160),
      cover_image: coverImage || null,
      tags,
      status,
      category_id: categoryId || null,
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt || truncate(stripHtml(content), 160),
      focus_keyword: focusKeyword.trim() || null,
      updated_at: new Date().toISOString(),
      published_at: publishedAt,
    };

    let result;

    if (isEditing) {
      result = await supabase
        .from("posts")
        .update(postData)
        .eq("id", article.id);
    } else {
      result = await supabase.from("posts").insert({
        ...postData,
        created_at: new Date().toISOString(),
      });
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="p-2 flex items-center justify-center transition-colors"
            style={{ color: "var(--text-muted)", border: "1px solid var(--line)", background: "var(--surface)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ink)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--text-dim)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}
            >
              {isEditing ? "Modifier l'article" : "Nouvel article"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              {isEditing
                ? `Modification de "${article.title}"`
                : "Rédiger un nouvel article"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "draft" | "published")
            }
            className="px-3 py-2 text-sm transition-colors focus:outline-none"
            style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
          <button
            type="submit"
            disabled={saving || !title || !content}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
            onMouseEnter={(e) => !(saving || !title || !content) && (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm px-4 py-3" style={{ color: "var(--danger)", background: "color-mix(in srgb, var(--danger) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 20%, transparent)" }}>
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-medium uppercase tracking-widest mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Titre <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none"
              style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
              placeholder="Titre de l'article"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-xs font-medium uppercase tracking-widest mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: "var(--text-dim)" }}>/posts/</span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="flex-1 px-4 py-2.5 font-mono text-sm transition-colors focus:outline-none"
                style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                placeholder="mon-article"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-xs font-medium uppercase tracking-widest mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Extrait
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none resize-none"
              style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
              placeholder="Résumé court de l'article (SEO)"
              maxLength={300}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              {excerpt.length}/300 caractères — affiché sur les cartes d'articles et sous le titre
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-xs font-medium uppercase tracking-widest mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Contenu <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Commencez à rédiger votre article... Utilisez la barre d'outils pour formater votre texte."
            />
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          <div className="p-5 space-y-5" style={{ border: "1px solid var(--line)", background: "var(--surface)" }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--ink)" }}>
              <Eye className="w-4 h-4" style={{ color: "var(--brand)" }} />
              SEO & Métadonnées
            </h3>

            <div>
              <label
                htmlFor="metaTitle"
                className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Titre SEO
              </label>
              <input
                id="metaTitle"
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm transition-colors focus:outline-none"
                style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                placeholder={title || "Titre pour les moteurs de recherche"}
                maxLength={70}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                {(metaTitle || title).length}/70
              </p>
            </div>

            <div>
              <label
                htmlFor="metaDescription"
                className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Description SEO
              </label>
              <textarea
                id="metaDescription"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm transition-colors focus:outline-none resize-none"
                style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                placeholder="Description pour les moteurs de recherche"
                maxLength={160}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                {(metaDescription || excerpt).length}/160
              </p>
            </div>

            <div>
              <label
                htmlFor="focusKeyword"
                className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Mot-clé principal
              </label>
              <input
                id="focusKeyword"
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                className="w-full px-3 py-2 text-sm transition-colors focus:outline-none"
                style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
                placeholder="ex. faire un budget"
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                Ce que vos lecteurs tapent dans Google pour trouver cet article.
              </p>
            </div>

            <SeoPanel
              title={title}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              excerpt={excerpt}
              slug={slug}
              content={content}
              keyword={focusKeyword}
              categoryId={categoryId}
              coverImage={coverImage}
            />
          </div>

          <div className="p-5 space-y-5" style={{ border: "1px solid var(--line)", background: "var(--surface)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>Paramètres</h3>

            <div>
              <label
                htmlFor="coverImage"
                className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Image de couverture
              </label>
              
              <div className="space-y-3">
                <input
                  id="coverImage"
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 text-sm transition-colors focus:outline-none"
                  style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                  placeholder="URL directe (https://...)"
                />

                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="mobile-image-upload"
                    disabled={uploading}
                  />
                  
                  <label
                    htmlFor="mobile-image-upload"
                    className={`flex items-center justify-center gap-2 w-full px-3 py-2 border-dashed text-sm cursor-pointer transition-colors ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  style={{ border: "1px dashed var(--line-strong)", background: "var(--surface-2)", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => !uploading && ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{uploading ? "Upload en cours..." : "Uploader depuis l'ordinateur"}</span>
                  </label>
                </div>

                {coverImage && (
                  <div className="relative aspect-video w-full overflow-hidden" style={{ background: "var(--bg)", border: "1px solid var(--line-soft)" }}>
                    <Image
                      src={coverImage}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-2 right-2 p-1.5 transition-colors"
                      style={{ background: "rgba(0,0,0,0.7)", color: "var(--ink)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--danger)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
                      title="Supprimer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Catégorie
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm transition-colors focus:outline-none"
                style={{ border: "1px solid var(--line)", background: "var(--bg)", color: categoryId ? "var(--ink)" : "var(--text-dim)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
              >
                <option value="">— Sans catégorie —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "var(--text-muted)" }}
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 text-sm transition-colors focus:outline-none"
                style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--ink)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
                placeholder="Freelance, Budget, IA gratuite"
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                Séparez les tags par des virgules
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
