# Guide de rédaction — Le Plan B

Ce guide s'applique à tous les articles, qu'ils soient écrits par Christ ou préparés par les agents
de rédaction. Un agent ne publie jamais : il dépose un **brouillon** que Christ relit, complète
et publie depuis `/admin/articles`.

## Le blog en une phrase

**Le Plan B** : des astuces concrètes et testées pour gagner un revenu en plus, mieux gérer son
argent, être plus productif et profiter des meilleurs outils gratuits. Pour tous les francophones
(France, Belgique, Suisse, Canada, Afrique).

Les quatre thèmes (champ `category` de l'article) :

| `category` | Thème | Exemples de sujets |
|---|---|---|
| `gagner-de-l-argent` | Gagner de l'argent | freelance, vente en ligne, petits business, revenus complémentaires |
| `finances-perso` | Finances perso | budget, épargne, banques et frais, arnaques, économies |
| `productivite` | Productivité | organisation, méthodes, concentration, habitudes |
| `outils-ia` | Outils & IA gratuits | IA, applis, automatisations, tutoriels d'outils |

## Le lecteur

Une personne active (salariée, étudiante, indépendante) qui veut plus de marge : plus d'argent,
plus de temps. Elle lit souvent sur son téléphone, elle est méfiante envers les promesses faciles,
et elle veut savoir **quoi faire concrètement**, dès aujourd'hui.

## Le ton

- On vouvoie le lecteur. L'auteur parle à la première personne (« je »).
- Clair, direct, chaleureux. Des phrases courtes. Pas de jargon sans explication.
- Concret avant tout : étapes numérotées, exemples chiffrés, outils nommés, captures d'idées.
- Honnête : on dit aussi les limites, le temps que ça prend, ce qui peut rater.

## Les règles d'honnêteté (non négociables)

1. **Aucune expérience personnelle inventée.** Un agent n'écrit jamais « j'ai testé », « j'ai gagné »,
   « mon client ». À l'endroit où un vécu rendrait l'article plus fort, il laisse un repère :
   `<p><strong>[À COMPLÉTER PAR CHRIST : ton expérience avec … — 2 ou 3 phrases]</strong></p>`.
   Entre 1 et 3 repères par article. Christ les remplace (ou les supprime) avant de publier.
2. **Chaque chiffre a une source** : tarifs, frais, salaires, statistiques, limites d'une offre
   gratuite. La source est datée et listée dans la section « Sources ». Pas de source, pas de chiffre.
3. **Vérifier que l'information est à jour** (année en cours) : les offres gratuites, prix et
   conditions changent souvent. Préciser « en [mois année] » pour les prix.
4. **Pas de promesse de gain** (« gagnez 3 000 € par mois ») ni de résultat garanti.
5. **Pas de conseil en investissement** : ni bourse, ni crypto, ni trading, ni placements
   spéculatifs. Les finances perso restent pratiques (budget, épargne de précaution, frais,
   arnaques, banques). Pour les sujets fiscaux ou juridiques, rester général et renvoyer vers la
   source officielle du pays.
6. **Affiliation : seulement si elle est utile et déclarée.** Un agent met des liens normaux vers
   les sites officiels. Christ peut remplacer un lien par son lien affilié s'il recommande vraiment
   l'outil ; le lien prend alors `rel="sponsored nofollow"` et l'article signale, près du lien :
   `<em>(lien affilié : il ne vous coûte rien de plus et soutient le blog)</em>`. On ne choisit
   jamais un outil parce qu'il paie une commission.
7. **Pays** : quand une règle, un prix ou un service dépend du pays, le dire (« en France », « au
   Canada »…) et, quand c'est utile, donner l'équivalent pour d'autres pays francophones
   (ex. Mobile Money en Afrique de l'Ouest). Montants en euros par défaut.

## La structure d'un article

- **Mot-clé principal** (`focus_keyword`) : l'expression que les lecteurs tapent dans Google (ex. « faire un budget »). Il doit apparaître dans le titre, la description, le slug, le premier paragraphe et au moins un H2 — le panneau SEO de l'admin le vérifie.
- **Titre** (`title`) : la promesse concrète, avec le mot-clé principal, 50 à 70 caractères.
  Ex. « Faire un budget qui tient vraiment : la méthode simple en 4 étapes ».
- **Extrait** (`excerpt`) : 1 ou 2 phrases (max 220 caractères) qui donnent envie de lire.
- **Introduction** : 2 ou 3 paragraphes courts. Le problème du lecteur, puis ce qu'il saura faire
  à la fin. Le mot-clé principal apparaît dans le premier paragraphe.
- **Corps** : 4 à 7 sections `<h2>`, sous-sections `<h3>` si besoin. Étapes en listes numérotées.
  Un tableau comparatif quand on compare des options. Une astuce mise en avant dans un
  `<blockquote>` qui commence par `<strong>Astuce :</strong>`.
- **Les erreurs à éviter** : une section courte, très appréciée des lecteurs.
- **FAQ** : un `<h2>Questions fréquentes</h2>` avec 3 ou 4 questions en `<h3>` et réponses
  courtes (ce sont les questions que les gens tapent dans Google).
- **Conclusion** : une action simple à faire aujourd'hui.
- **Sources** : `<h2>Sources</h2>` puis une liste de liens (`<a href="…">Nom de la page — site, date</a>`).
- Longueur : **1 200 à 2 000 mots**.

## Le format technique (fichier JSON)

```json
{
  "title": "…",
  "slug": "mots-cles-courts-sans-accents",
  "category": "finances-perso",
  "focus_keyword": "faire un budget",
  "excerpt": "…",
  "tags": ["budget", "épargne"],
  "meta_title": "… (max 65 caractères)",
  "meta_description": "… (max 160 caractères, avec le mot-clé)",
  "content": "<p>…</p><h2>…</h2>…"
}
```

- `content` en HTML simple. Balises autorisées : `h2 h3 p ul ol li strong em a blockquote code
  pre hr br table thead tbody tr th td`. Pas de `h1` (le titre de la page en est déjà un), pas
  d'image, pas de style, pas de classe.
- Au moins **un lien interne** vers un article déjà publié du blog quand c'est pertinent (`/posts/slug`), pour aider Google et garder le lecteur.
- Liens externes vers des sources fiables : sites officiels, documentation des outils, médias
  reconnus, organismes publics.

Vérifier puis envoyer :

```bash
node scripts/post-draft.mjs --check article.json   # vérifie sans rien envoyer
node scripts/post-draft.mjs article.json           # crée le brouillon
node scripts/post-draft.mjs --list                 # titres déjà écrits (brouillons compris)
```

## Avant de publier (Christ)

- [ ] Remplacer ou supprimer chaque `[À COMPLÉTER PAR CHRIST : …]`.
- [ ] Relire les chiffres et ouvrir 2 ou 3 sources au hasard.
- [ ] Ajouter une image de couverture (facultatif, mais les articles en ont plus de clics).
- [ ] Choisir la date de publication, puis Publier.
