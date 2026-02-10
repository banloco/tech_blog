# 🚨 ACTION REQUISE: Migration de la base de données

## ⚠️ Problème actuel

```
Erreur: Could not find the 'parent_id' column of 'comments' in the schema cache
```

**Cause:** Les colonnes nécessaires (`parent_id`, `likes_count`, `is_reported`) n'existent pas encore dans la table `comments`.

**Solution:** Exécuter la migration SQL dans Supabase.

---

## 🚀 Solution en 2 minutes (3 étapes)

### Étape 1: Afficher le SQL à copier

```bash
npm run migrate:show
```

Cette commande affichera tout le SQL de migration dans votre terminal.

### Étape 2: Copier et exécuter dans Supabase

1. **Ouvrez ce lien:** https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/sql/new
2. **Sélectionnez tout le SQL** affiché dans votre terminal (Ctrl+A)
3. **Copiez** (Ctrl+C)
4. **Collez** dans l'éditeur SQL Supabase (Ctrl+V)
5. **Cliquez** sur "Run" (ou Ctrl+Enter)
6. **Attendez** "Success ✅"

### Étape 3: Vérifier et redémarrer

```bash
# Vérifier que tout est bon
npm run db:check

# Redémarrer l'application
npm run dev
```

---

## 📋 Commandes utiles

```bash
# Afficher le SQL de migration dans le terminal
npm run migrate:show

# Vérifier l'état de la base de données
npm run db:check

# Afficher le guide de migration
npm run migrate:manual

# Redémarrer l'application
npm run dev
```

---

## ✅ Vérification finale

Après avoir exécuté la migration dans Supabase:

1. Exécutez: `npm run db:check`
2. Vous devriez voir: `✅ Toutes les colonnes sont présentes`
3. Lancez: `npm run dev`
4. Testez l'ajout d'un commentaire

---

## 🆘 En cas de problème

Si après la migration vous voyez encore l'erreur "schema cache":

1. **Ouvrez:** https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/settings/api
2. **Cliquez** sur "Restart API" (ou "Reload schema cache")
3. **Attendez** 30 secondes
4. **Relancez:** `npm run dev`

---

## 📚 Documentation complète

- [MIGRATION_QUICK.md](MIGRATION_QUICK.md) - Guide rapide
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Guide détaillé
- [docs/AUTO_MIGRATION.md](docs/AUTO_MIGRATION.md) - Documentation technique
