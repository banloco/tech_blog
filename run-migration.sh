#!/bin/bash

# Script pour exécuter la migration Supabase
# Usage: ./run-migration.sh

set -e

echo "🚀 Exécution de la migration Supabase..."

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Fichier .env introuvable"
    exit 1
fi

# Charger les variables d'environnement
source .env

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL n'est pas défini dans .env"
    exit 1
fi

echo "📄 Fichier de migration: supabase-migration.sql"

# Exécuter la migration
echo "⏳ Connexion à la base de données..."
psql "$DATABASE_URL" -f supabase-migration.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration exécutée avec succès!"
    echo ""
    echo "🔄 Redémarrage du cache Supabase recommandé"
    echo "   Allez sur votre dashboard Supabase et faites: Settings > API > Restart API"
else
    echo "❌ Erreur lors de l'exécution de la migration"
    exit 1
fi
