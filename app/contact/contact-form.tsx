"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error);
        return;
      }

      setStatus("success");
      setFeedback(data.message);
    } catch {
      setStatus("error");
      setFeedback("Erreur de connexion.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-16 space-y-4">
        <CheckCircle className="w-12 h-12 mx-auto" style={{ color: "#00E5FF" }} />
        <p className="text-lg font-semibold" style={{ color: "#e8e8e8" }}>{feedback}</p>
        <p className="text-sm" style={{ color: "#888" }}>
          Nous vous répondrons dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 sm:p-8"
      style={{ border: "1px solid #333", background: "#1a1a1a" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="contact_name"
            className="block text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: "#888" }}
          >
            Nom
          </label>
          <input
            id="contact_name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none"
            style={{ background: "#0e0e0e", border: "1px solid #333", color: "#e8e8e8" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#00E5FF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label
            htmlFor="contact_email"
            className="block text-xs font-medium uppercase tracking-widest mb-2"
            style={{ color: "#888" }}
          >
            Email
          </label>
          <input
            id="contact_email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none"
            style={{ background: "#0e0e0e", border: "1px solid #333", color: "#e8e8e8" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#00E5FF")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact_subject"
          className="block text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "#888" }}
        >
          Sujet
        </label>
        <input
          id="contact_subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none"
          style={{ background: "#0e0e0e", border: "1px solid #333", color: "#e8e8e8" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#00E5FF")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
          placeholder="Objet de votre message"
        />
      </div>

      <div>
        <label
          htmlFor="contact_message"
          className="block text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "#888" }}
        >
          Message
        </label>
        <textarea
          id="contact_message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none resize-none"
          style={{ background: "#0e0e0e", border: "1px solid #333", color: "#e8e8e8" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#00E5FF")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
          placeholder="Votre message..."
          minLength={10}
        />
      </div>

      {status === "error" && (
        <p
          className="text-sm px-4 py-2"
          style={{ color: "#ff5555", background: "rgba(255,85,85,0.05)", border: "1px solid rgba(255,85,85,0.2)" }}
        >
          {feedback}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={{ background: "#C19A6B", color: "#121212" }}
        onMouseEnter={(e) => status !== "loading" && (e.currentTarget.style.background = "#d4b080")}
        onMouseLeave={(e) => status !== "loading" && (e.currentTarget.style.background = "#C19A6B")}
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
