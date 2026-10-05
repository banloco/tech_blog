import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Connexion Admin | Le Plan B",
  description: "Espace de connexion administrateur du blog Le Plan B",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-sm space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1"
            style={{ color: "var(--brand)", border: "1px solid color-mix(in srgb, var(--brand) 30%, transparent)", background: "color-mix(in srgb, var(--brand) 4%, transparent)" }}
          >
            Accès sécurisé
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}
          >
            Espace Admin
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Connectez-vous pour gérer le blog
          </p>
        </div>

        {/* Form container */}
        <div
          className="p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
