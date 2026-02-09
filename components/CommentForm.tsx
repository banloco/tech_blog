"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function CommentForm({ postId }: { postId: string }) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          author_name: authorName,
          author_email: authorEmail,
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error);
        return;
      }

      setStatus("success");
      setMessage(data.message);
      setAuthorName("");
      setAuthorEmail("");
      setContent("");
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
      >
        <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-zinc-500">
        Les commentaires sont modérés avant publication.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium text-zinc-300 mb-1">
            Nom <span className="text-red-400" aria-label="requis">*</span>
          </label>
          <input
            id="author_name"
            type="text"
            required
            aria-required="true"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="author_email" className="block text-sm font-medium text-zinc-300 mb-1">
            Email <span className="text-red-400" aria-label="requis">*</span>
          </label>
          <input
            id="author_email"
            type="email"
            required
            aria-required="true"
            aria-describedby="email-hint"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
            placeholder="votre@email.com"
          />
          <p id="email-hint" className="sr-only">Format attendu: nom@exemple.com</p>
        </div>
      </div>

      <div>
        <label htmlFor="comment_content" className="block text-sm font-medium text-zinc-300 mb-1">
          Commentaire <span className="text-red-400" aria-label="requis">*</span>
        </label>
        <textarea
          id="comment_content"
          rows={4}
          required
          aria-required="true"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
          placeholder="Écrivez votre commentaire..."
        />
      </div>

      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2"
        >
          <strong>Erreur:</strong> {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50 transition-all"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Envoi...</span>
            <span className="sr-only" role="status" aria-live="polite">
              Envoi en cours, veuillez patienter
            </span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Envoyer</span>
          </>
        )}
      </button>
    </form>
  );
}
