# Guide de rédaction — Le Plan B

Ce guide s'applique à tous les articles, qu'ils soient écrits par Christ ou préparés par les agents
de rédaction. Un agent ne publie jamais : il dépose un **brouillon** complet, prêt à publier, que Christ relit
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

## Le piment : donner envie de lire (sans mentir)

Un article utile mais fade ne sera pas lu. Chaque article doit éveiller la curiosité :

- **Un titre qui intrigue** : un chiffre frappant (« Gazole +44 % en un an »), une question que le
  lecteur se pose (« L'IA va-t-elle prendre votre travail ? »), ou une idée contre-intuitive
  (« Votre Livret A vous fait perdre de l'argent »). Le titre tient toujours sa promesse : pas de
  piège à clics.
- **Une accroche qui démarre fort** : la première phrase est un fait d'actualité, un chiffre
  surprenant ou une scène concrète du quotidien (« Vous faites le plein et le ticket affiche 15 €
  de plus qu'il y a un an. »). Jamais « Dans cet article, nous allons voir… » en ouverture.
- **Des intertitres qui donnent envie** de continuer à lire, pas de simples étiquettes
  (« Le piège que personne ne voit » plutôt que « Inconvénients »).
- **Relier au monde réel** : ce qui se passe en ce moment (conflits, prix de l'énergie, budget de
  l'État, IA, fuites de données…) et ce que ça change concrètement pour le portefeuille, le travail
  ou le temps du lecteur. Une section « Ce que ça change pour vous » quand c'est pertinent.
- **Garder le concret** : le piment sert à attirer ; le lecteur doit repartir avec des actions.

### Les articles d'actualité

Rythme : **deux articles le lundi et deux le jeudi**. Dans chaque paire, **un article** part de
l'actualité récente (moins d'un mois) : un événement
mondial ou national et ses répercussions sur l'argent, le travail, la productivité ou les outils
du lecteur. Règles en plus :

- Sources de presse ou officielles **datées de moins d'un mois** pour les faits d'actualité.
- Écrire « au [jour mois année] » pour tout chiffre qui bouge (prix, inflation, taux).
- Rester factuel sur les causes (conflit, décision politique) : on explique les conséquences pour
  le lecteur, on ne prend pas parti.
- Distinguer clairement ce qui est **décidé** de ce qui est **annoncé ou en débat** (ex. un projet
  de loi de finances n'est pas encore voté).

## Les règles d'honnêteté (non négociables)

1. **Aucune expérience personnelle inventée, et aucun repère à compléter.** L'article doit être
   publiable tel quel : jamais de « [À COMPLÉTER] » ni de passage laissé en blanc. Un agent n'écrit
   jamais « j'ai testé », « j'ai gagné », « mon client ». À la place du vécu, il donne un exemple
   présenté comme tel (« Exemple : une personne qui… »), un calcul chiffré à partir de sources, ou
   un conseil concret. Le « je » sert à guider le lecteur (« je vous conseille de… »), pas à
   raconter une histoire qui n'a pas eu lieu.
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
  "cover_image": "https://cdn.stocksnap.io/img-thumbs/960w/….jpg",
  "content": "<p>…</p><h2>…</h2>…"
}
```

- `content` en HTML simple. Balises autorisées : `h2 h3 p ul ol li strong em a blockquote code
  pre hr br table thead tbody tr th td`. Pas de `h1` (le titre de la page en est déjà un), pas
  d'image, pas de style, pas de classe.
- **Vidéo YouTube** (seule intégration permise, utile pour l'actualité : démonstration, annonce
  officielle) : de préférence la chaîne officielle de la marque ou de l'organisme, dans ce format
  exact, suivi d'une légende en `<p><em>` qui cite la chaîne :
  `<div data-youtube-video=""><iframe width="640" height="360" allowfullscreen="true" src="https://www.youtube-nocookie.com/embed/ID_DE_LA_VIDEO?modestbranding=1"></iframe></div>`
- `cover_image` **obligatoire** : une photo libre de droits (licence CC0) qui illustre le sujet.
  `node scripts/find-cover.mjs "budget calculator"` (mots en anglais) en propose ; choisir une
  photo concrète (bureau, argent, téléphone…), sans texte incrusté ni logo de marque.
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

- [ ] Ajouter, si l'envie vient, une expérience personnelle vraie (facultatif).
- [ ] Relire les chiffres et ouvrir 2 ou 3 sources au hasard.
- [ ] Vérifier l'image de couverture (obligatoire pour publier) ; la changer si elle colle mal au sujet.
- [ ] Choisir la date de publication, puis Publier.
