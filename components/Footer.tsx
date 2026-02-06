import Link from "next/link";
import { Cpu } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950/80">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-emerald-400 p-1.5 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                IA<span className="text-emerald-400">&</span>Capital
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Décryptez l'impact de l'intelligence artificielle sur vos finances et vos investissements.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <nav className="flex flex-col gap-2 text-sm text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Newsletter</h3>
            <p className="text-sm text-zinc-400">
              Recevez nos analyses directement dans votre boîte mail.
            </p>
            <div className="relative">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} IA & Capital. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
