"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
      setMessage("Erreur de connexion.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="votre@email.com"
        className="flex-1 min-w-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none transition-colors"
        aria-label="Adresse email pour la newsletter"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-50 transition-all shrink-0"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Envoi...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">S'abonner</span>
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1">{message}</p>
      )}
    </form>
  );
}
