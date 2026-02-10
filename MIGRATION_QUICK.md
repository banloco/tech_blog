# ⚡ Migration rapide

## 🎯 Commande rapide

```bash
npm run migrate:manual
```

Cette commande affichera les instructions complètes pour la migration.

## 🚀 Méthode simple (3 minutes)

1. **Ouvrez** https://supabase.com/dashboard
2. **Sélectionnez** votre projet `ltkcemgbqxicuefcktnx`
3. **Cliquez** sur "SQL Editor" (menu gauche)
4. **Créez** une nouvelle requête ("New Query")
5. **Copiez** tout le contenu du fichier `supabase-migration.sql`
6. **Collez** dans l'éditeur et cliquez "Run"
7. **Attendez** "Success ✅"
8. **Lancez** `npm run dev`

## ✅ C'est fait!

Votre base de données est maintenant à jour avec:
- Table `comments` avec les colonnes manquantes
- Table `posts` avec les nouveaux champs
- Toutes les fonctions et politiques nécessaires

## 📚 Documentation complète

Voir [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) pour plus de détails.

## 🔧 Pourquoi la migration manuelle?

La connexion automatique PostgreSQL ne fonctionne pas depuis cette machine en raison de restrictions réseau IPv6. La migration via le Dashboard Supabase est la méthode la plus simple et fiable.
