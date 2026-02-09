"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { slugify } from "@/lib/utils";
import { Save, Loader2, ArrowLeft, Eye, Upload, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
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
  const [status, setStatus] = useState<"draft" | "published">(
    article?.status || "draft"
  );
  const [metaTitle, setMetaTitle] = useState(article?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    article?.meta_description || ""
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 160),
      cover_image: coverImage || null,
      tags,
      status,
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt || content.substring(0, 160),
      updated_at: new Date().toISOString(),
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
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? "Modifier l'article" : "Nouvel article"}
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
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
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
          <button
            type="submit"
            disabled={saving || !title || !content}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
        <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
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
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="Titre de l'article"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">/posts/</span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors font-mono text-sm"
                placeholder="mon-article"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Extrait
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
              placeholder="Résumé court de l'article (SEO)"
              maxLength={300}
            />
            <p className="text-xs text-zinc-500 mt-1">
              {excerpt.length}/300 caractères — utilisé pour les aperçus et le SEO
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
              Contenu <span className="text-red-400">*</span>
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
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              SEO & Métadonnées
            </h3>

            <div>
              <label
                htmlFor="metaTitle"
                className="block text-sm font-medium text-zinc-400 mb-1.5"
              >
                Titre SEO
              </label>
              <input
                id="metaTitle"
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                placeholder={title || "Titre pour les moteurs de recherche"}
                maxLength={70}
              />
              <p className="text-xs text-zinc-500 mt-1">
                {(metaTitle || title).length}/70
              </p>
            </div>

            <div>
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-zinc-400 mb-1.5"
              >
                Description SEO
              </label>
              <textarea
                id="metaDescription"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none resize-none"
                placeholder="Description pour les moteurs de recherche"
                maxLength={160}
              />
              <p className="text-xs text-zinc-500 mt-1">
                {(metaDescription || excerpt).length}/160
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-white">Paramètres</h3>

            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-zinc-400 mb-1.5"
              >
                Image de couverture
              </label>
              
              <div className="space-y-3">
                <input
                  id="coverImage"
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
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
                    className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-white text-zinc-400 cursor-pointer transition-colors text-sm ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{uploading ? "Upload en cours..." : "Uploader depuis l'ordinateur"}</span>
                  </label>
                </div>

                {coverImage && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
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
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
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
                htmlFor="tags"
                className="block text-sm font-medium text-zinc-400 mb-1.5"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                placeholder="IA, Finance, Crypto"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Séparez les tags par des virgules
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
