import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Connexion Admin | IA & Capital",
  description: "Espace de connexion administrateur du blog IA & Capital",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Espace Admin
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Connectez-vous pour gérer le blog
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
