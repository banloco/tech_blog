# 🔧 Migration de la base de données

## ⚠️ Important: Migration manuelle requise

En raison de restrictions réseau (IPv6), la migration automatique ne fonctionne pas sur cette machine.
Vous devez appliquer la migration **manuellement via le Dashboard Supabase**.

## 🚀 Migration via Dashboard (RECOMMANDÉ)

### Étapes simples:

1. **Ouvrir le Dashboard Supabase**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Ouvrir SQL Editor**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New Query"

3. **Copier la migration**
   - Ouvrez le fichier `supabase-migration.sql` dans ce projet
   - Sélectionnez tout (Ctrl+A) et copiez (Ctrl+C)

4. **Exécuter**
   - Collez le SQL dans l'éditeur Supabase
   - Cliquez sur "Run" (ou Ctrl+Enter)
   - Attendez la confirmation "Success ✅"

5. **C'est fait!**
   - Lancez votre application: `npm run dev`

## 📋 Aide-mémoire

```bash
# Voir les instructions de migration manuelle
npm run migrate:manual

# Vérifier si la migration est nécessaire
npm run migrate:check

# Démarrer l'application
npm run dev
```

## ✅ Vérification

Après la migration, vérifiez dans le SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'comments' 
ORDER BY ordinal_position;
```

Colonnes attendues:
- ✅ id, post_id, **parent_id**, author_name, author_email
- ✅ content, **likes_count**, is_approved, **is_reported**, created_at

1. Ouvrez https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Copiez le contenu de `supabase-migration.sql`
5. Collez et exécutez
6. Attendez la confirmation "Success"

### Via ligne de commande

Si vous avez ajouté `SUPABASE_DB_PASSWORD` dans `.env`:

```bash
npm run migrate
```

## ✅ Vérification

Après migration, vérifiez dans le SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'comments' 
ORDER BY ordinal_position;
```

Vous devriez voir toutes les colonnes:
- ✅ id (uuid)
- ✅ post_id (uuid)
- ✅ parent_id (uuid) ← Nouveau
- ✅ author_name (text)
- ✅ author_email (text)
- ✅ content (text)
- ✅ likes_count (integer) ← Nouveau
- ✅ is_approved (boolean)
- ✅ is_reported (boolean) ← Nouveau
- ✅ created_at (timestamp)

## 🎉 C'est tout!

Le système de migration est maintenant complètement automatique. Plus besoin de vous soucier de la structure de la base de données!
