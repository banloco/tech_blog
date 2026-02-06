import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du blog IA & Capital. Découvrez comment nous protégeons vos données personnelles.",
};

export default function PrivacyPage() {
  const siteName = "IA & Capital";
  const contactEmail = "contact@ia-capital.blog";

  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 max-w-3xl">
      <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl mb-4">
        Politique de confidentialité
      </h1>
      <p className="text-sm text-zinc-500 mb-12">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-emerald-400 prose-strong:text-white space-y-8">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Le site <strong>{siteName}</strong> s'engage à protéger la vie
            privée de ses utilisateurs. Cette politique de confidentialité
            explique quelles informations nous collectons, comment nous les
            utilisons et quels sont vos droits.
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>Nous pouvons collecter les données suivantes :</p>
          <ul>
            <li>
              <strong>Newsletter :</strong> adresse email pour l'envoi de nos
              analyses
            </li>
            <li>
              <strong>Formulaire de contact :</strong> nom, email, sujet et
              message
            </li>
            <li>
              <strong>Commentaires :</strong> nom, email et contenu du
              commentaire
            </li>
            <li>
              <strong>Données de navigation :</strong> cookies techniques,
              données analytiques anonymisées
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Vous envoyer la newsletter si vous vous êtes inscrit(e)</li>
            <li>Répondre à vos messages de contact</li>
            <li>Afficher vos commentaires sous les articles (après modération)</li>
            <li>Améliorer l'expérience utilisateur du site</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies et publicités</h2>
          <p>
            Ce site utilise des cookies techniques nécessaires à son
            fonctionnement. Nous utilisons également Google AdSense pour
            afficher des publicités pertinentes. Google peut utiliser des
            cookies pour personnaliser les annonces en fonction de vos visites
            sur ce site et d'autres sites internet.
          </p>
          <p>
            Vous pouvez gérer vos préférences de publicité sur{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              les paramètres d'annonces Google
            </a>
            .
          </p>
        </section>

        <section>
          <h2>5. Partage des données</h2>
          <p>
            Vos données personnelles ne sont jamais vendues à des tiers. Elles
            peuvent être partagées avec des services tiers uniquement dans le
            cadre du fonctionnement du site (hébergement, analytics, publicité).
          </p>
        </section>

        <section>
          <h2>6. Conservation des données</h2>
          <p>
            Vos données sont conservées aussi longtemps que nécessaire pour les
            finalités décrites ci-dessus, ou jusqu'à votre demande de
            suppression.
          </p>
        </section>

        <section>
          <h2>7. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de
            rectification, de suppression et de portabilité de vos données. Pour
            exercer ces droits, contactez-nous à{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            Pour toute question relative à cette politique de confidentialité,
            contactez-nous via notre{" "}
            <a href="/contact">formulaire de contact</a> ou à l'adresse{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
