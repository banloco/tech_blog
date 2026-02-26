import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Connexion Admin | IA & Capital",
  description: "Espace de connexion administrateur du blog IA & Capital",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12"
      style={{ background: "#121212" }}
    >
      <div className="w-full max-w-sm space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1"
            style={{ color: "#00E5FF", border: "1px solid rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.04)" }}
          >
            Accès sécurisé
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
          >
            Espace Admin
          </h1>
          <p className="text-sm" style={{ color: "#888" }}>
            Connectez-vous pour gérer le blog
          </p>
        </div>

        {/* Form container */}
        <div
          className="p-8"
          style={{ background: "#1a1a1a", border: "1px solid #333" }}
        >
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
