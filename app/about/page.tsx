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
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 max-w-3xl">
      <header className="text-center mb-10 sm:mb-16">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6"
          style={{
            color: "#00E5FF",
            border: "1px solid rgba(0,229,255,0.3)",
            background: "rgba(0,229,255,0.04)",
          }}
        >
          <Cpu className="w-4 h-4" />
          À Propos d&apos;IA &amp; Capital
        </div>
        <h1
          className="text-3xl font-bold tracking-tight sm:text-5xl leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
        >
          Décrypter la convergence entre{" "}
          <span style={{ color: "#00E5FF" }}>l&apos;IA et la finance</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#888" }}>
          Bienvenue sur <strong style={{ color: "#e8e8e8" }}>IA &amp; Capital</strong>, la
          plateforme de référence dédiée à l&apos;analyse de l&apos;impact des
          technologies de pointe sur l&apos;écosystème financier. À une époque où
          les algorithmes redéfinissent les règles du jeu, notre mission est de
          fournir aux investisseurs — particuliers ou professionnels — les clés
          pour comprendre et naviguer dans ce nouveau paradigme.
        </p>
      </header>

      <div className="space-y-8">
        {/* Notre Vision */}
        <section
          className="p-6 sm:p-8"
          style={{ border: "1px solid #333", background: "#1a1a1a" }}
        >
          <h2
            className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
          >
            <Eye className="w-5 h-5" style={{ color: "#00E5FF" }} />
            Notre Vision
          </h2>
          <p className="leading-relaxed" style={{ color: "#888" }}>
            Le monde de la finance vit sa plus grande mutation depuis
            l&apos;invention de la bourse électronique. L&apos;intelligence artificielle
            n&apos;est plus un simple outil d&apos;aide à la décision ; elle est devenue
            le moteur central des flux de capitaux mondiaux.
          </p>
          <p className="mt-4 leading-relaxed" style={{ color: "#888" }}>
            Chez <strong style={{ color: "#e8e8e8" }}>IA &amp; Capital</strong>, nous
            croyons que la transparence et l&apos;éducation sont les meilleurs
            remparts contre la volatilité des marchés. Nous explorons les
            frontières de la{" "}
            <strong style={{ color: "#00E5FF" }}>Tech Finance</strong> pour
            transformer des données complexes en opportunités actionnables.
          </p>
        </section>

        {/* Ce que nous couvrons */}
        <section
          className="p-6 sm:p-8"
          style={{ border: "1px solid #333", background: "#1a1a1a" }}
        >
          <h2
            className="text-xl font-bold mb-6 flex items-center gap-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
          >
            <LayoutGrid className="w-5 h-5" style={{ color: "#00E5FF" }} />
            Ce que nous couvrons
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: "#888" }}>
            Notre ligne éditoriale s&apos;articule autour de trois piliers fondamentaux :
          </p>
          <div className="space-y-4">
            {[
              {
                icon: Link2,
                title: "L'On-Chain Intelligence",
                desc: "Utiliser la puissance de l'IA pour analyser la blockchain, traquer la \"Smart Money\" et anticiper les cycles des actifs numériques.",
              },
              {
                icon: TrendingUp,
                title: "La TradFi Augmentée",
                desc: "Analyser comment l'IA transforme la bourse traditionnelle, des ETFs pilotés par algorithmes aux puces de calcul haute fréquence (HFT).",
              },
              {
                icon: Globe,
                title: "L'Écosystème FinTech",
                desc: "Suivre les innovations des leaders du marché (NVIDIA, Apple, Mistral AI) et l'évolution des régulations (IA Act) qui façonnent notre avenir financier.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-4"
                style={{ border: "1px solid #2a2a2a", background: "#161616" }}
              >
                <div
                  className="shrink-0 p-2"
                  style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.15)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#00E5FF" }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "#e8e8e8" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#888" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pourquoi nous lire */}
        <section
          className="p-6 sm:p-8"
          style={{ border: "1px solid #333", background: "#1a1a1a" }}
        >
          <h2
            className="text-xl font-bold mb-6 flex items-center gap-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
          >
            <BookOpen className="w-5 h-5" style={{ color: "#C19A6B" }} />
            Pourquoi nous lire ?
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: "#888" }}>
            Dans un océan de &ldquo;bruit&rdquo; numérique et de rumeurs de marché,{" "}
            <strong style={{ color: "#e8e8e8" }}>IA &amp; Capital</strong> se distingue par :
          </p>
          <ul className="space-y-4">
            {[
              { icon: Microscope, title: "Une expertise technique :", desc: "Nous ne nous contentons pas de rapporter l'actualité, nous analysons les infrastructures derrière les chiffres." },
              { icon: Shield, title: "Une indépendance totale :", desc: "Nos analyses sont guidées par la donnée et l'objectivité." },
              { icon: BookOpen, title: "Une approche pédagogique :", desc: "Nous rendons les concepts de pointe accessibles sans en sacrifier la profondeur." },
            ].map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div
                  className="shrink-0 p-2 mt-0.5"
                  style={{ background: "rgba(193,154,107,0.06)", border: "1px solid rgba(193,154,107,0.15)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#C19A6B" }} />
                </div>
                <span className="leading-relaxed" style={{ color: "#888" }}>
                  <strong style={{ color: "#e8e8e8" }}>{title}</strong>{" "}{desc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Rejoignez la communauté */}
        <section
          className="p-6 sm:p-8"
          style={{ border: "1px solid rgba(193,154,107,0.3)", background: "rgba(193,154,107,0.03)" }}
        >
          <h2
            className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
          >
            <Users className="w-5 h-5" style={{ color: "#C19A6B" }} />
            Rejoignez la communauté
          </h2>
          <p className="leading-relaxed" style={{ color: "#888" }}>
            La finance de demain s&apos;écrit aujourd&apos;hui en lignes de code. Que
            vous soyez un investisseur cherchant à optimiser son portefeuille ou
            un passionné de technologie curieux des prochaines révolutions
            bancaires,{" "}
            <strong style={{ color: "#C19A6B" }}>IA &amp; Capital</strong> est votre boussole.
          </p>
        </section>

        {/* Contact */}
        <section
          className="p-6 sm:p-8"
          style={{ border: "1px solid #333", background: "#1a1a1a" }}
        >
          <h2
            className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
          >
            <Mail className="w-5 h-5" style={{ color: "#00E5FF" }} />
            Contact &amp; Informations
          </h2>
          <ul className="space-y-3" style={{ color: "#888" }}>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 shrink-0" style={{ background: "#00E5FF" }} />
              <span>
                <strong style={{ color: "#e8e8e8" }}>Édition :</strong> Équipe
                éditoriale IA &amp; Capital
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 shrink-0" style={{ background: "#00E5FF" }} />
              <span>
                <strong style={{ color: "#e8e8e8" }}>Contact :</strong>{" "}
                <a
                  href="/contact"
                  className="transition-colors hover:opacity-80"
                  style={{ color: "#00E5FF" }}
                >
                  Formulaire de contact
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 shrink-0" style={{ background: "#C19A6B" }} />
              <span>
                <strong style={{ color: "#e8e8e8" }}>Newsletter :</strong>{" "}
                <a
                  href="#newsletter"
                  className="transition-colors hover:opacity-80"
                  style={{ color: "#C19A6B" }}
                >
                  S&apos;inscrire à la newsletter
                </a>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
