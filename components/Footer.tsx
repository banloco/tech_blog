import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import Image from "next/image";
import logo from "../public/ia_&_capital.png";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950/80">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src={logo} alt="IA & Capital" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold text-white">
                IA<span className="text-emerald-400">&</span>Capital
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Décryptez l'impact de l'intelligence artificielle sur vos finances et vos investissements.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <nav className="flex flex-col gap-2 text-sm text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <Link href="/about" className="hover:text-white transition-colors">À propos</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Informations</h3>
            <nav className="flex flex-col gap-2 text-sm text-zinc-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link>
              <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div id="newsletter" className="space-y-4 scroll-mt-20 sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-white">Newsletter</h3>
            <p className="text-sm text-zinc-400">
              Recevez nos analyses directement dans votre boîte mail.
            </p>
            <div className="relative max-w-sm">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} IA & Capital. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Confidentialité</Link>
            <Link href="/mentions-legales" className="hover:text-zinc-300 transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
