import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du blog Le Plan B. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}>
        Mentions légales
      </h1>
      <p className="text-sm mb-12" style={{ color: "var(--text-dim)" }}>
        Dernière mise à jour :{" "}
        {new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="prose max-w-none prose-headings:text-[var(--ink)] prose-a:text-[var(--brand)] prose-strong:text-[var(--ink)] space-y-8">
        <section>
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>Le Plan B</strong> est un blog personnel d&apos;astuces
            pour gagner un revenu en plus, gérer son argent et être plus productif.
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
            informatif uniquement. Elles ne constituent pas des conseils
            juridiques, fiscaux ou financiers. L'éditeur ne saurait être tenu
            responsable des décisions prises sur la base des contenus publiés.
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

        <section>
          <h2>7. Liens affiliés et partenariats</h2>
          <p>
            Certains articles peuvent contenir des liens affiliés : si vous achetez
            ou vous inscrivez via ce lien, le blog peut toucher une commission, sans
            aucun coût supplémentaire pour vous. Ces liens sont toujours signalés
            dans l&apos;article. Les outils et services sont recommandés parce
            qu&apos;ils sont utiles, jamais en fonction de la commission. Les
            articles ne constituent pas des conseils en investissement.
          </p>
        </section>
      </div>
    </div>
  );
}
