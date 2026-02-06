import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du blog IA & Capital. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
};

export default function LegalPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 max-w-3xl">
      <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl mb-4">
        Mentions légales
      </h1>
      <p className="text-sm text-zinc-500 mb-12">
        Dernière mise à jour :{" "}
        {new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-emerald-400 prose-strong:text-white space-y-8">
        <section>
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>IA & Capital</strong> est un blog personnel dédié à
            l'analyse de l'intelligence artificielle appliquée à la finance.
          </p>
          <ul>
            <li>
              <strong>Responsable de publication :</strong> Christ Banidje
            </li>
            <li>
              <strong>Contact :</strong>{" "}
              <a href="/contact">Formulaire de contact</a>
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Hébergement</h2>
          <p>Ce site est hébergé par :</p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong>
            </li>
            <li>440 N Barranca Avenue #4133, Covina, CA 91723, USA</li>
            <li>
              Site :{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, graphismes, logo,
            icônes) est protégé par les lois en vigueur sur la propriété
            intellectuelle. Toute reproduction, même partielle, est soumise à
            autorisation préalable.
          </p>
        </section>

        <section>
          <h2>4. Limitation de responsabilité</h2>
          <p>
            Les informations publiées sur ce blog sont fournies à titre
            informatif uniquement. Elles ne constituent en aucun cas des
            conseils en investissement. L'éditeur ne saurait être tenu
            responsable des décisions financières prises sur la base des
            contenus publiés.
          </p>
        </section>

        <section>
          <h2>5. Données personnelles</h2>
          <p>
            Consultez notre{" "}
            <a href="/privacy">politique de confidentialité</a> pour en savoir
            plus sur la collecte et le traitement de vos données personnelles.
          </p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Ce site utilise des cookies techniques et des cookies tiers (Google
            AdSense) pour le fonctionnement du site et l'affichage de
            publicités. Vous pouvez configurer votre navigateur pour refuser les
            cookies.
          </p>
        </section>
      </div>
    </main>
  );
}
