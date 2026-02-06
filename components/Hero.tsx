import Link from "next/link";
import { ArrowRight, TrendingUp, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 px-6 sm:py-32 lg:px-8">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl" aria-hidden="true">
        <div className="aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-[#3b82f6] to-[#10b981] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-zinc-400 ring-1 ring-white/10 hover:ring-white/20">
            Dernière analyse : <Link href="#articles" className="font-semibold text-emerald-400"><span className="absolute inset-0" aria-hidden="true"></span> L'impact de GPT-5 sur la DeFi <span aria-hidden="true">&rarr;</span></Link>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          L'Intelligence Artificielle au service de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Capital</span>
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-zinc-400">
          Décryptez les tendances, maîtrisez les algorithmes de trading et découvrez comment l'IA transforme la finance moderne.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="#articles" className="group rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 flex items-center gap-2 transition-all">
            <TrendingUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            Commencer à lire
          </Link>
          <Link href="/contact" className="text-sm font-semibold leading-6 text-white flex items-center gap-2 hover:text-emerald-400 transition-colors">
            Nous contacter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats / Social Proof */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mx-0 lg:max-w-none">
           <dl className="grid grid-cols-1 gap-x-8 gap-y-6 text-center lg:grid-cols-3">
             <div className="flex flex-col gap-y-2">
                <dt className="text-base leading-7 text-zinc-400">Analyses publiées</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">50+</dd>
             </div>
             <div className="flex flex-col gap-y-2">
                <dt className="text-base leading-7 text-zinc-400">Lecteurs actifs</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">2k</dd>
             </div>
             <div className="flex flex-col gap-y-2">
                <dt className="text-base leading-7 text-zinc-400">Outils testés</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white">100+</dd>
             </div>
           </dl>
        </div>
      </div>
    </section>
  );
}
