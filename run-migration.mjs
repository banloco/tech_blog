/**
 * Script pour exécuter la migration via l'API Supabase
 * Usage: node run-migration.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charger les variables d'environnement
const envFile = readFileSync(join(__dirname, '.env'), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
    .map(([key, ...values]) => [key.trim(), values.join('=').trim()])
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_KEY);
  process.exit(1);
}

console.log('🚀 Exécution de la migration Supabase...\n');

// Lire le fichier SQL
const migrationSQL = readFileSync(join(__dirname, 'supabase-migration.sql'), 'utf8');

console.log('📄 Fichier: supabase-migration.sql');
console.log('📊 Taille:', migrationSQL.length, 'caractères\n');

// Exécuter la migration via l'API REST de Supabase
const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  },
  body: JSON.stringify({ sql: migrationSQL })
});

if (!response.ok) {
  console.error('❌ Erreur lors de l\'exécution de la migration');
  console.error('Status:', response.status, response.statusText);
  const error = await response.text();
  console.error('Détails:', error);
  process.exit(1);
}

console.log('✅ Migration exécutée avec succès!\n');
console.log('ℹ️  Notes importantes:');
console.log('   1. Allez sur votre dashboard Supabase');
console.log('   2. Settings > API > "Restart API" pour rafraîchir le cache');
console.log('   3. Attendez 10-20 secondes avant de tester\n');
