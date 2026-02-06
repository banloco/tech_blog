import Link from "next/link";
import { Cpu, Wallet, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-8">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-blue-500 to-emerald-400 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            IA<span className="text-emerald-400">&</span>Capital
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <a href="#newsletter" className="hidden sm:flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-all">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Newsletter</span>
          </a>
          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}