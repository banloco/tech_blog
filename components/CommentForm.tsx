"use client";

import { useState, useEffect } from "react";
import { Send, Loader2, CheckCircle, X, AlertCircle } from "lucide-react";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  placeholder = "Écrivez votre commentaire...",
  autoFocus = false,
}: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; content?: string }>({});

  // Charger les données sauvegardées
  useEffect(() => {
    const savedName = localStorage.getItem("comment_author_name");
    const savedEmail = localStorage.getItem("comment_author_email");
    if (savedName) setAuthorName(savedName);
    if (savedEmail) setAuthorEmail(savedEmail);
  }, []);

  // Validation en temps réel
  const validateName = (value: string) => {
    if (!value.trim()) return "Le nom est requis";
    if (value.trim().length < 2) return "Le nom doit contenir au moins 2 caractères";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return "L'email est requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email invalide";
    return "";
  };

  const validateContent = (value: string) => {
    if (!value.trim()) return "Le commentaire est requis";
    if (value.trim().length < 3) return "Le commentaire doit contenir au moins 3 caractères";
    if (value.trim().length > 2000) return "Le commentaire est trop long (max 2000 caractères)";
    return "";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation finale
    const newErrors = {
      name: validateName(authorName),
      email: validateEmail(authorEmail),
      content: validateContent(content),
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.content) {
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId,
          author_name: authorName.trim(),
          author_email: authorEmail.trim(),
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Erreur lors de l'envoi");
        return;
      }

      // Sauvegarder les infos pour la prochaine fois
      localStorage.setItem("comment_author_name", authorName.trim());
      localStorage.setItem("comment_author_email", authorEmail.trim());

      setStatus("success");
      setMessage(data.message || "Commentaire envoyé avec succès!");
      setContent("");
      setErrors({});

      // Notifier le parent après un court délai
      setTimeout(() => {
        onSuccess?.();
        setStatus("idle");
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Erreur:", error);
      setStatus("error");
      setMessage("Erreur de connexion. Veuillez réessayer.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message d'info */}
      <div className="flex items-start gap-2 text-xs text-zinc-400 bg-zinc-800/50 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          {parentId
            ? "Votre réponse sera visible après modération."
            : "Les commentaires sont modérés avant publication. Soyez respectueux."}
        </p>
      </div>

      {/* Champs Nom et Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`author_name_${parentId || 'main'}`} className="block text-sm font-medium text-zinc-300 mb-2">
            Nom <span className="text-red-400" aria-label="requis">*</span>
          </label>
          <input
            id={`author_name_${parentId || 'main'}`}
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `name_error_${parentId || 'main'}` : undefined}
            value={authorName}
            onChange={(e) => {
              setAuthorName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: "" });
            }}
            onBlur={(e) => setErrors({ ...errors, name: validateName(e.target.value) })}
            className={`w-full rounded-lg border ${
              errors.name ? "border-red-500" : "border-zinc-700"
            } bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all`}
            placeholder="Votre nom"
            autoFocus={autoFocus}
          />
          {errors.name && (
            <p id={`name_error_${parentId || 'main'}`} className="mt-1 text-xs text-red-400" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`author_email_${parentId || 'main'}`} className="block text-sm font-medium text-zinc-300 mb-2">
            Email <span className="text-red-400" aria-label="requis">*</span>
          </label>
          <input
            id={`author_email_${parentId || 'main'}`}
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `email_error_${parentId || 'main'}` : `email_hint_${parentId || 'main'}`}
            value={authorEmail}
            onChange={(e) => {
              setAuthorEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            onBlur={(e) => setErrors({ ...errors, email: validateEmail(e.target.value) })}
            className={`w-full rounded-lg border ${
              errors.email ? "border-red-500" : "border-zinc-700"
            } bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all`}
            placeholder="votre@email.com"
          />
          <p id={`email_hint_${parentId || 'main'}`} className="sr-only">Format attendu: nom@exemple.com</p>
          {errors.email && (
            <p id={`email_error_${parentId || 'main'}`} className="mt-1 text-xs text-red-400" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Champ Commentaire */}
      <div>
        <label htmlFor={`comment_content_${parentId || 'main'}`} className="block text-sm font-medium text-zinc-300 mb-2">
          Commentaire <span className="text-red-400" aria-label="requis">*</span>
          <span className="ml-2 text-xs text-zinc-500 font-normal">
            ({content.length}/2000)
          </span>
        </label>
        <textarea
          id={`comment_content_${parentId || 'main'}`}
          rows={parentId ? 3 : 4}
          required
          aria-required="true"
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? `content_error_${parentId || 'main'}` : undefined}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors({ ...errors, content: "" });
          }}
          onBlur={(e) => setErrors({ ...errors, content: validateContent(e.target.value) })}
          className={`w-full rounded-lg border ${
            errors.content ? "border-red-500" : "border-zinc-700"
          } bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all resize-none`}
          placeholder={placeholder}
          maxLength={2000}
        />
        {errors.content && (
          <p id={`content_error_${parentId || 'main'}`} className="mt-1 text-xs text-red-400" role="alert">
            {errors.content}
          </p>
        )}
      </div>

      {/* Message d'erreur global */}
      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
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
              <span>{parentId ? "Répondre" : "Publier"}</span>
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all focus:ring-2 focus:ring-zinc-500/50 focus:outline-none"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Annuler</span>
          </button>
        )}
      </div>
    </form>
  );
}
