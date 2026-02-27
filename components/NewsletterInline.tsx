"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterInline() {
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
      if (!res.ok) { setStatus("error"); setMessage(data.error); return; }
      setStatus("success");
      setMessage(data.message || "Vous êtes inscrit !");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion.");
    }
  }

  return (
    <div
      className="my-6 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3"
      style={{
        background: "rgba(193,154,107,0.04)",
        borderLeft: "2px solid #C19A6B",
        borderTop: "1px solid rgba(193,154,107,0.15)",
        borderBottom: "1px solid rgba(193,154,107,0.15)",
        borderRight: "1px solid rgba(193,154,107,0.15)",
      }}
    >
      {/* Label */}
      <div className="shrink-0">
        <span
          className="text-[9px] font-bold font-mono uppercase tracking-widest block"
          style={{ color: "#C19A6B", letterSpacing: "0.15em" }}
        >
          [NEWSLETTER]
        </span>
        <p className="text-xs mt-0.5 whitespace-nowrap" style={{ color: "#888" }}>
          Analyses hebdomadaires — gratuit
        </p>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px self-stretch" style={{ background: "rgba(193,154,107,0.2)" }} />

      {/* Form */}
      {status === "success" ? (
        <div className="flex items-center gap-2 text-xs" style={{ color: "#00E5FF" }}>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2 min-w-0">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
            placeholder="votre@email.com"
            className="flex-1 min-w-0 px-3 py-1.5 text-xs border focus:outline-none transition-colors"
            style={{
              background: "#0e0e0e",
              borderColor: status === "error" ? "#ff5555" : "#333",
              color: "#e8e8e8",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#C19A6B")}
            onBlur={(e) => (e.currentTarget.style.borderColor = status === "error" ? "#ff5555" : "#333")}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shrink-0 disabled:opacity-50 transition-all"
            style={{ background: "#C19A6B", color: "#121212" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4b080")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C19A6B")}
          >
            {status === "loading" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Send className="w-3 h-3" />
                S&apos;inscrire
              </>
            )}
          </button>
          {status === "error" && (
            <span className="text-[10px] shrink-0" style={{ color: "#ff5555" }}>{message}</span>
          )}
        </form>
      )}
    </div>
  );
}
