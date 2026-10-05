"use client";

import { useId, useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

/** Newsletter signup. "large" is the big version on the home page and under articles. */
export default function NewsletterForm({ size = "small" }: { size?: "small" | "large" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputId = useId();  // the form can appear twice on a page (home + footer)
  const large = size === "large";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error);
        return;
      }
      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Réessayez dans un instant.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium" role="status" aria-live="polite"
        style={{ color: "var(--brand)", background: "var(--brand-soft)" }}>
        <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex flex-col gap-2 sm:flex-row ${large ? "sm:rounded-full sm:border sm:bg-[var(--surface)] sm:p-1.5 sm:shadow-[var(--shadow)]" : ""}`}
        style={large ? { borderColor: "var(--line)" } : undefined}>
        <label htmlFor={inputId} className="sr-only">Votre adresse email</label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="votre@email.com"
          className={`min-w-0 flex-1 rounded-full border px-4 text-base focus:outline-none focus:border-[var(--brand)] ${large ? "py-3 sm:border-0 sm:bg-transparent" : "py-2.5"}`}
          style={{ background: "var(--surface)", borderColor: "var(--line)", color: "var(--ink)" }}
        />
        <button type="submit" disabled={status === "loading"} aria-busy={status === "loading"}
          className={`btn btn-primary shrink-0 disabled:opacity-60 ${large ? "" : "!py-2.5"}`}>
          {status === "loading" ? (
            <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Envoi…</>
          ) : (
            <><Send className="h-4 w-4" aria-hidden="true" /> Je m&apos;inscris</>
          )}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm" style={{ color: "var(--danger)" }}>{message}</p>
      )}
      <p className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
        Gratuit, sans spam. Désinscription en un clic.
      </p>
    </form>
  );
}
