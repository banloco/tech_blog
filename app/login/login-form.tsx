"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 text-sm transition-colors focus:outline-none"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p
          className="text-sm px-4 py-2"
          style={{
            color: "var(--danger)",
            background: "color-mix(in srgb, var(--danger) 5%, transparent)",
            border: "1px solid color-mix(in srgb, var(--danger) 20%, transparent)",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--brand)", color: "#fff" }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "var(--accent-hover)")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "var(--accent)")}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
