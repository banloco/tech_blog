# 📚 Documentation du projet Tech Blog

Ce dossier contient toute la documentation technique du projet.

## 🎯 Commencer ici

### Pour une vue d'ensemble rapide
1. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** 📊 - Vue d'ensemble visuelle du projet
2. **[REVIEW_SUMMARY.md](./REVIEW_SUMMARY.md)** ✅ - Récapitulatif de la review complète

### Pour une analyse détaillée
3. **[PROJECT_REVIEW.md](./PROJECT_REVIEW.md)** 🔍 - Review complète et exhaustive

## 📂 Documentation par Catégorie

### 📝 Guides de développement
- **[MOBILE_IMPROVEMENTS.md](./MOBILE_IMPROVEMENTS.md)** - Détails des améliorations mobile et responsive
- **[TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md)** - Guide d'utilisation du système de traduction FR/EN
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Liste de vérification pour les tests

### 🔧 Corrections et modifications
- **[COMMENTS_FIX.md](./COMMENTS_FIX.md)** - Correction du système de commentaires avec ISR
- **[FILES_MODIFIED.md](./FILES_MODIFIED.md)** - Liste des fichiers modifiés dans le projet
- **[RECAP.md](./RECAP.md)** - Récapitulatif général des fonctionnalités

## Structure du projet

```
tech_blog/
├── app/                    # Pages Next.js (App Router)
├── components/             # Composants React réutilisables
├── lib/                    # Utilitaires et configuration
│   ├── i18n/              # Système de traduction
│   ├── supabase*.ts       # Configuration Supabase
│   └── utils.ts           # Fonctions utilitaires
├── public/                # Assets statiques
├── docs/                  # Documentation (vous êtes ici)
└── .env                   # Variables d'environnement
```

## Variables d'environnement

Le projet utilise les variables suivantes (voir `.env`) :
- `NEXT_PUBLIC_SUPABASE_URL` - URL du projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Clé API publique Supabase
- `NEXT_PUBLIC_SITE_URL` - URL du site en production
- `NEXT_PUBLIC_ADSENSE_ID` - ID Google AdSense

## Fonctionnalités principales

- ✅ Blog Next.js 14+ avec App Router
- ✅ Système de traduction FR/EN
- ✅ Design responsive et mobile-first
- ✅ Gestion des commentaires avec modération
- ✅ Dashboard admin complet
- ✅ SEO optimisé avec metadata dynamiques
- ✅ Google AdSense intégré
- ✅ Analytics et Speed Insights (Vercel)
- ✅ ISR (Incremental Static Regeneration)

## Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm start

# Linter
npm run lint
```

## Support

Pour toute question, consulter les fichiers de documentation spécifiques listés ci-dessus.
