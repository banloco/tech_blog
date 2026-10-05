import type { Metadata } from "next";
import {
  Cpu,
  Eye,
  LayoutGrid,
  Smartphone,
  Briefcase,
  Code2,
  Sparkles,
  Shield,
  BookOpen,
  Microscope,
  Users,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Des guides concrets pour entreprendre avec la tech en Afrique : paiements Mobile Money, outils, tutos de dev et IA pratique. Découvrez la mission d'IA & Capital.",
  openGraph: {
    title: "À Propos d'IA & Capital",
    description:
      "Des guides concrets pour entreprendre avec la tech en Afrique.",
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
          La tech au service de{" "}
          <span style={{ color: "#00E5FF" }}>ceux qui entreprennent en Afrique</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "#888" }}>
          Bienvenue sur <strong style={{ color: "#e8e8e8" }}>IA &amp; Capital</strong>. Ici,
          le capital, c&apos;est ce qui fait avancer une activité : des outils qui
          marchent, des paiements qui arrivent, des compétences qu&apos;on peut
          réutiliser. J&apos;y partage des guides concrets, testés sur le terrain,
          pour lancer et faire grandir un projet avec la tech, au Bénin et en
          Afrique de l&apos;Ouest.
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
            Pourquoi ce blog
          </h2>
          <p className="leading-relaxed" style={{ color: "#888" }}>
            La plupart des guides tech sont écrits pour l&apos;Europe ou les
            États-Unis : cartes bancaires partout, connexion rapide, gros
            budgets. Ici, on encaisse par Mobile Money, on code parfois sur un
            PC modeste, et les clients ne paient pas toujours comme prévu.
          </p>
          <p className="mt-4 leading-relaxed" style={{ color: "#888" }}>
            <strong style={{ color: "#e8e8e8" }}>IA &amp; Capital</strong> part de
            cette réalité. Chaque article répond à une question précise, avec des
            solutions{" "}
            <strong style={{ color: "#00E5FF" }}>gratuites ou abordables</strong>{" "}
            que j&apos;ai essayées moi-même.
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
            Ce que vous trouverez ici
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: "#888" }}>
            Quatre thèmes, toujours avec des exemples concrets :
          </p>
          <div className="space-y-4">
            {[
              {
                icon: Smartphone,
                title: "Paiements & Mobile Money",
                desc: "Accepter des paiements en ligne avec MTN MoMo, Moov Money et les agrégateurs de paiement, sans se perdre dans les frais et les intégrations.",
              },
              {
                icon: Briefcase,
                title: "Entrepreneuriat & business",
                desc: "Trouver des clients, fixer ses prix, se faire payer : les bases pour transformer une compétence en activité qui rapporte.",
              },
              {
                icon: Code2,
                title: "Dev & tutos",
                desc: "Créer un site, une application ou une automatisation pas à pas, avec des outils gratuits et du code expliqué.",
              },
              {
                icon: Sparkles,
                title: "IA pratique",
                desc: "Utiliser l'intelligence artificielle pour gagner du temps au quotidien, gratuitement et même sans ordinateur puissant.",
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
            Ma façon de faire
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: "#888" }}>
            Sur <strong style={{ color: "#e8e8e8" }}>IA &amp; Capital</strong>, chaque article suit trois règles :
          </p>
          <ul className="space-y-4">
            {[
              { icon: Microscope, title: "Testé avant d'être conseillé :", desc: "je ne recommande que ce que j'ai essayé, et je dis aussi ce qui n'a pas marché." },
              { icon: Shield, title: "Indépendant :", desc: "aucun article n'est payé par un outil ou un service dont il parle. Si un lien rapporte une commission, c'est indiqué." },
              { icon: BookOpen, title: "Accessible :", desc: "des explications claires, pour les débutants comme pour les développeurs." },
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
            Que vous lanciez votre première activité, que vous soyez
            développeur ou simplement curieux de ce que la tech peut changer
            pour vous, inscrivez-vous à la newsletter : vous recevrez les
            nouveaux guides dès leur publication. Et si un sujet vous manque,
            écrivez-moi : les meilleures idées d&apos;articles viennent des
            lecteurs.
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
                <strong style={{ color: "#e8e8e8" }}>Édition :</strong> Christ
                Banidje, fondateur d&apos;IA &amp; Capital
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
