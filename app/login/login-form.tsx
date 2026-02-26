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
          style={{ color: "#888" }}
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
            background: "#0e0e0e",
            border: "1px solid #333",
            color: "#e8e8e8",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#00E5FF")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "#888" }}
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
            background: "#0e0e0e",
            border: "1px solid #333",
            color: "#e8e8e8",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#00E5FF")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p
          className="text-sm px-4 py-2"
          style={{
            color: "#ff5555",
            background: "rgba(255,85,85,0.05)",
            border: "1px solid rgba(255,85,85,0.2)",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "#C19A6B", color: "#121212" }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#d4b080")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#C19A6B")}
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
