import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          Page introuvable
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-all"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
