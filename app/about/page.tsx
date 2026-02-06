import type { Metadata } from "next";
import { Cpu, Target, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez IA & Capital, le blog qui décrypte l'impact de l'intelligence artificielle sur vos finances et vos investissements.",
  openGraph: {
    title: "À propos | IA & Capital",
    description:
      "Découvrez IA & Capital, le blog qui décrypte l'impact de l'intelligence artificielle sur vos finances.",
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 max-w-3xl">
      <header className="text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-6">
          <Cpu className="w-4 h-4" />
          Notre mission
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight sm:text-5xl leading-tight">
          L'IA au service de vos{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            décisions financières
          </span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          IA & Capital est un blog indépendant dédié à l'analyse de l'impact de
          l'intelligence artificielle sur la finance, l'investissement et les
          technologies émergentes.
        </p>
      </header>

      <div className="space-y-12">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Notre objectif
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Rendre accessibles les concepts complexes à l'intersection de l'IA
            et de la finance. Nous analysons les outils, les tendances et les
            stratégies qui façonnent l'avenir de l'investissement, pour que
            chacun puisse prendre des décisions éclairées.
          </p>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            À qui s'adresse ce blog ?
          </h2>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Investisseurs</strong> souhaitant
                comprendre comment l'IA transforme les marchés financiers
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>
                <strong className="text-white">Passionnés de tech</strong>{" "}
                curieux des applications concrètes de l'IA dans la finance
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span>
                <strong className="text-white">Professionnels</strong> cherchant
                à intégrer les outils IA dans leur stratégie financière
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Nos thématiques
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Trading algorithmique",
              "Machine Learning en finance",
              "Crypto & DeFi",
              "Analyse de sentiments",
              "FinTech & innovation",
              "Gestion de patrimoine IA",
            ].map((topic) => (
              <div
                key={topic}
                className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-300"
              >
                {topic}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 text-center">
        <p className="text-zinc-500 text-sm">
          Des questions ? N'hésitez pas à{" "}
          <a
            href="/contact"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            nous contacter
          </a>
          .
        </p>
      </div>
    </main>
  );
}
