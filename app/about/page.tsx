import type { Metadata } from "next";
import {
  Cpu,
  Eye,
  LayoutGrid,
  Link2,
  TrendingUp,
  Globe,
  Shield,
  BookOpen,
  Microscope,
  Users,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Décrypter la convergence entre l'intelligence artificielle et la finance de demain. Découvrez la mission et la vision d'IA & Capital.",
  openGraph: {
    title: "À Propos d'IA & Capital",
    description:
      "Décrypter la convergence entre l'intelligence artificielle et la finance de demain.",
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 max-w-3xl">
      <header className="text-center mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-sm text-emerald-400 mb-6">
          <Cpu className="w-4 h-4" />
          À Propos d'IA & Capital
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight sm:text-5xl leading-tight">
          Décrypter la convergence entre{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            l'IA et la finance
          </span>
        </h1>
        <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Bienvenue sur <strong className="text-white">IA & Capital</strong>, la
          plateforme de référence dédiée à l'analyse de l'impact des
          technologies de pointe sur l'écosystème financier. À une époque où
          les algorithmes redéfinissent les règles du jeu, notre mission est de
          fournir aux investisseurs — particuliers ou professionnels — les clés
          pour comprendre et naviguer dans ce nouveau paradigme.
        </p>
      </header>

      <div className="space-y-12">
        {/* Notre Vision */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            Notre Vision
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Le monde de la finance vit sa plus grande mutation depuis
            l'invention de la bourse électronique. L'intelligence artificielle
            n'est plus un simple outil d'aide à la décision ; elle est devenue
            le moteur central des flux de capitaux mondiaux.
          </p>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Chez <strong className="text-white">IA & Capital</strong>, nous
            croyons que la transparence et l'éducation sont les meilleurs
            remparts contre la volatilité des marchés. Nous explorons les
            frontières de la{" "}
            <strong className="text-emerald-400">Tech Finance</strong> pour
            transformer des données complexes en opportunités actionnables.
          </p>
        </section>

        {/* Ce que nous couvrons */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-400" />
            Ce que nous couvrons
          </h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Notre ligne éditoriale s'articule autour de trois piliers
            fondamentaux :
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
              <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2">
                <Link2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  L'On-Chain Intelligence
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Utiliser la puissance de l'IA pour analyser la blockchain,
                  traquer la "Smart Money" et anticiper les cycles des actifs
                  numériques.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
              <div className="shrink-0 rounded-lg bg-blue-500/10 p-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  La TradFi Augmentée
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Analyser comment l'IA transforme la bourse traditionnelle, des
                  ETFs pilotés par algorithmes aux puces de calcul haute
                  fréquence (HFT).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
              <div className="shrink-0 rounded-lg bg-purple-500/10 p-2">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  L'Écosystème FinTech
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Suivre les innovations des leaders du marché (NVIDIA, Apple,
                  Mistral AI) et l'évolution des régulations (IA Act) qui
                  façonnent notre avenir financier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pourquoi nous lire */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Pourquoi nous lire ?
          </h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Dans un océan de "bruit" numérique et de rumeurs de marché,{" "}
            <strong className="text-white">IA & Capital</strong> se distingue
            par :
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-emerald-500/10 p-2 mt-0.5">
                <Microscope className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-zinc-400 leading-relaxed">
                <strong className="text-white">Une expertise technique :</strong>{" "}
                Nous ne nous contentons pas de rapporter l'actualité, nous
                analysons les infrastructures derrière les chiffres.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-blue-500/10 p-2 mt-0.5">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-zinc-400 leading-relaxed">
                <strong className="text-white">Une indépendance totale :</strong>{" "}
                Nos analyses sont guidées par la donnée et l'objectivité.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-purple-500/10 p-2 mt-0.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-zinc-400 leading-relaxed">
                <strong className="text-white">
                  Une approche pédagogique :
                </strong>{" "}
                Nous rendons les concepts de pointe accessibles sans en
                sacrifier la profondeur.
              </span>
            </li>
          </ul>
        </section>

        {/* Rejoignez la communauté */}
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Rejoignez la communauté
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            La finance de demain s'écrit aujourd'hui en lignes de code. Que
            vous soyez un investisseur cherchant à optimiser son portefeuille ou
            un passionné de technologie curieux des prochaines révolutions
            bancaires,{" "}
            <strong className="text-emerald-400">IA & Capital</strong> est votre
            boussole.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Contact & Informations
          </h2>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Édition :</strong> Équipe
                éditoriale IA & Capital
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>
                <strong className="text-white">Contact :</strong>{" "}
                <a
                  href="/contact"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Formulaire de contact
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span>
                <strong className="text-white">Newsletter :</strong>{" "}
                <a
                  href="#newsletter"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  S'inscrire à la newsletter
                </a>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
