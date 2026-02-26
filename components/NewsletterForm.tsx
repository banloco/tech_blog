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
      <div className="flex items-center gap-2 text-xs" role="status" aria-live="polite" style={{ color: "#00E5FF" }}>
        <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse email pour la newsletter
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        aria-required="true"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="votre@email.com"
        className="flex-1 min-w-0 px-3 py-2 text-xs border focus:outline-none transition-colors"
        style={{
          background: "#121212",
          borderColor: "#333",
          color: "#e8e8e8",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all shrink-0 disabled:opacity-50"
        style={{ background: "#C19A6B", color: "#121212", letterSpacing: "0.1em" }}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span className="hidden sm:inline">Envoi...</span>
            <span className="sr-only">Envoi en cours</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">S'abonner</span>
            <span className="sr-only sm:hidden">S'abonner à la newsletter</span>
          </>
        )}
      </button>
      {status === "error" && (
        <div role="alert" aria-live="assertive" className="text-[10px] mt-1 px-2 py-1" style={{ color: "#ff5555", background: "rgba(255,85,85,0.08)", border: "1px solid rgba(255,85,85,0.2)" }}>
          {message}
        </div>
      )}
    </form>
  );
}
