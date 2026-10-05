import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description: `Pourquoi ${SITE.name} existe, qui l'écrit et comment chaque astuce est testée. ${SITE.description}`,
  openGraph: { title: `À propos du ${SITE.name}`, description: SITE.description },
  alternates: { canonical: "/about" },
};

const RULES = [
  { icon: FlaskConical, title: "Testé avant d'être conseillé", text: "Je ne recommande que ce que j'ai essayé, avec les vrais chiffres, et je dis aussi ce qui n'a pas marché." },
  { icon: ShieldCheck, title: "Zéro promesse miracle", text: "Pas de « deviens riche en dormant ». Des méthodes réalistes, avec le temps et l'effort qu'elles demandent." },
  { icon: Sparkles, title: "Indépendant et transparent", text: "Aucun article n'est payé par un outil dont il parle. Si un lien me rapporte une commission, c'est écrit noir sur blanc." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow" style={{ color: "var(--brand)" }}>À propos</p>
      <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl" style={{ color: "var(--ink)" }}>
        Un plan B, c&apos;est ce qui vous laisse <span className="marker">le choix</span>.
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <p>
          Un revenu en plus si le salaire ne suffit pas. Une épargne si un imprévu arrive. Du temps
          gagné pour avancer sur ce qui compte. <strong style={{ color: "var(--ink)" }}>{SITE.name}</strong> partage
          des astuces concrètes pour construire tout ça, petit à petit.
        </p>
        <p>
          Ici, pas de théorie déconnectée ni de promesses de richesse rapide : des méthodes testées,
          des outils gratuits ou abordables, et des chiffres honnêtes.
        </p>
      </div>

      <section className="mt-12" aria-labelledby="themes-title">
        <h2 id="themes-title" className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>Ce que vous trouverez ici</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map(({ slug, name, tagline, icon: Icon, color }) => (
            <li key={slug}>
              <Link href={`/categorie/${slug}`} className="card card-link flex h-full items-start gap-3 p-4">
                <span className="rounded-xl p-2" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                  <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-bold" style={{ color: "var(--ink)" }}>{name}</span>
                  <span className="mt-0.5 block text-sm" style={{ color: "var(--text-muted)" }}>{tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="rules-title">
        <h2 id="rules-title" className="text-2xl font-extrabold" style={{ color: "var(--ink)" }}>Mes trois règles</h2>
        <ul className="mt-5 space-y-4">
          {RULES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "var(--brand-soft)" }}>
                <Icon className="h-5 w-5" style={{ color: "var(--brand)" }} aria-hidden="true" />
              </span>
              <p style={{ color: "var(--text-muted)" }}>
                <strong className="block" style={{ color: "var(--ink)" }}>{title}</strong>
                {text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-12 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8" aria-labelledby="author-title">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-display text-2xl font-extrabold text-white" style={{ background: "var(--brand)" }} aria-hidden="true">C</span>
        <div>
          <h2 id="author-title" className="text-xl font-extrabold" style={{ color: "var(--ink)" }}>Qui écrit ?</h2>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Moi,{" "}
            <a href={SITE.authorUrl} target="_blank" rel="noopener" className="font-semibold underline" style={{ color: "var(--brand)" }}>{SITE.author}</a>,
            développeur. Je construis des sites, des applications et des outils d&apos;IA, et je
            cherche en permanence comment gagner plus et travailler mieux. Ce blog, c&apos;est mon carnet de bord :
            ce que je teste, ce qui marche, ce que j&apos;en retiens.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-[var(--radius)] p-6 sm:p-8" style={{ background: "var(--brand-soft)" }}>
        <h2 className="text-xl font-extrabold" style={{ color: "var(--ink)" }}>Une question, une idée d&apos;article ?</h2>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Les meilleurs sujets viennent des lecteurs. Écrivez-moi, je réponds à tout le monde.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={SITE.contactUrl} target="_blank" rel="noopener" className="btn btn-primary">Me contacter <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          <a href="#newsletter" className="btn btn-ghost">Recevoir les nouveaux articles</a>
        </div>
      </section>
    </div>
  );
}
