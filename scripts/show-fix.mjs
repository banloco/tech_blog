#!/usr/bin/env node
/**
 * Afficher le SQL CORRIGÉ pour la migration
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

console.log('\n' + colors.bold + colors.red + '═'.repeat(70) + colors.reset);
console.log(colors.bold + colors.red + '  ⚠️  IMPORTANT: SQL CORRIGÉ (utilisez celui-ci!)' + colors.reset);
console.log(colors.bold + colors.red + '═'.repeat(70) + colors.reset + '\n');

console.log(colors.bold + colors.yellow + '🔍 Problème identifié:' + colors.reset);
console.log('   L\'ancien SQL utilisait CREATE TABLE IF NOT EXISTS');
console.log('   Comme la table existe déjà, les colonnes n\'étaient jamais ajoutées!\n');

console.log(colors.bold + colors.green + '✅ Solution:' + colors.reset);
console.log('   Utiliser ALTER TABLE pour ajouter les colonnes manquantes\n');

console.log(colors.bold + colors.cyan + '📋 Instructions:' + colors.reset + '\n');

console.log(colors.bold + '1.' + colors.reset + ' Ouvrez ce lien:');
console.log('   ' + colors.green + 'https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/sql/new' + colors.reset + '\n');

console.log(colors.bold + '2.' + colors.reset + ' Copiez TOUT le SQL ci-dessous (du début à "FIN DE LA MIGRATION")\n');

console.log(colors.bold + '3.' + colors.reset + ' Collez dans l\'éditeur SQL et cliquez "Run"\n');

console.log(colors.bold + '4.' + colors.reset + ' Après "Success ✅", lancez: ' + colors.green + 'npm run dev' + colors.reset + '\n');

console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log(colors.bold + colors.yellow + '  ⬇️  DÉBUT DU SQL CORRIGÉ  ⬇️' + colors.reset);
console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log('');

try {
  const migrationSQL = readFileSync(join(rootDir, 'supabase-migration-fix.sql'), 'utf8');
  console.log(colors.cyan + migrationSQL + colors.reset);
} catch (error) {
  console.log(colors.red + '❌ Erreur: Impossible de lire supabase-migration-fix.sql' + colors.reset);
  process.exit(1);
}

console.log('');
console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log(colors.bold + colors.yellow + '  ⬆️  FIN DU SQL CORRIGÉ  ⬆️' + colors.reset);
console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log('');

console.log(colors.bold + colors.green + '✅ Après l\'exécution:' + colors.reset);
console.log('   1. Vérifiez: ' + colors.green + 'npm run db:check' + colors.reset);
console.log('   2. Lancez: ' + colors.green + 'npm run dev' + colors.reset);
console.log('   3. Testez l\'ajout d\'un commentaire\n');

console.log(colors.bold + colors.red + '══ Utilisez supabase-migration-fix.sql, PAS supabase-migration.sql! ══' + colors.reset);
console.log('');
