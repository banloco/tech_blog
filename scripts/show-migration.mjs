#!/usr/bin/env node
/**
 * Afficher le SQL de migration pour copie manuelle facile
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

console.log('\n' + colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
console.log(colors.bold + '  📋 SQL de migration - Prêt à copier!' + colors.reset);
console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset + '\n');

console.log(colors.bold + colors.cyan + '🎯 Instructions rapides:' + colors.reset);
console.log('');
console.log(colors.bold + '1.' + colors.reset + ' Ouvrez ce lien dans votre navigateur:');
console.log('   ' + colors.green + 'https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/sql/new' + colors.reset);
console.log('');
console.log(colors.bold + '2.' + colors.reset + ' Sélectionnez TOUT le SQL ci-dessous (cliquez et faites Ctrl+A)');
console.log('');
console.log(colors.bold + '3.' + colors.reset + ' Copiez-le (Ctrl+C)');
console.log('');
console.log(colors.bold + '4.' + colors.reset + ' Collez dans l\'éditeur SQL Supabase (Ctrl+V)');
console.log('');
console.log(colors.bold + '5.' + colors.reset + ' Cliquez sur ' + colors.green + '"Run"' + colors.reset + ' ou appuyez sur Ctrl+Enter');
console.log('');
console.log(colors.bold + '6.' + colors.reset + ' Attendez ' + colors.green + '"Success ✅"' + colors.reset);
console.log('');

console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log(colors.bold + colors.yellow + '  ⬇️  DÉBUT DU SQL À COPIER  ⬇️' + colors.reset);
console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log('');

// Lire et afficher le SQL
try {
  const migrationSQL = readFileSync(join(rootDir, 'supabase-migration.sql'), 'utf8');
  console.log(migrationSQL);
} catch (error) {
  console.log(colors.red + '❌ Erreur: Impossible de lire supabase-migration.sql' + colors.reset);
  process.exit(1);
}

console.log('');
console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log(colors.bold + colors.yellow + '  ⬆️  FIN DU SQL À COPIER  ⬆️' + colors.reset);
console.log(colors.blue + '─'.repeat(70) + colors.reset);
console.log('');

console.log(colors.bold + colors.green + '✅ Après l\'exécution réussie:' + colors.reset);
console.log('   → Lancez: ' + colors.green + 'npm run dev' + colors.reset);
console.log('   → Vérifiez: ' + colors.green + 'npm run db:check' + colors.reset);
console.log('');

console.log(colors.blue + '═'.repeat(70) + colors.reset + '\n');
