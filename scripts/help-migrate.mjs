#!/usr/bin/env node
/**
 * Script helper pour la migration manuelle
 * Affiche les instructions et le SQL à copier
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
  bold: '\x1b[1m',
};

console.log('\n' + colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
console.log(colors.bold + '  🔧 Migration de la base de données - Instructions' + colors.reset);
console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset + '\n');

console.log(colors.cyan + '📋 Étapes à suivre:' + colors.reset + '\n');

console.log(colors.bold + '1. Ouvrir le Dashboard Supabase' + colors.reset);
console.log('   → https://supabase.com/dashboard\n');

console.log(colors.bold + '2. Sélectionner votre projet' + colors.reset);
console.log('   → ltkcemgbqxicuefcktnx\n');

console.log(colors.bold + '3. Ouvrir SQL Editor' + colors.reset);
console.log('   → Menu de gauche > SQL Editor > New Query\n');

console.log(colors.bold + '4. Copier la migration SQL' + colors.reset);
console.log('   → Fichier: ' + colors.yellow + 'supabase-migration.sql' + colors.reset);
console.log('   → Le contenu complet du fichier doit être copié\n');

console.log(colors.bold + '5. Coller et exécuter' + colors.reset);
console.log('   → Coller dans l\'éditeur SQL\n');
console.log('   → Cliquer sur "Run" ou Ctrl+Enter\n');
console.log('   → Attendre "Success ✅"\n');

console.log(colors.bold + '6. Redémarrer l\'application' + colors.reset);
console.log('   → ' + colors.green + 'npm run dev' + colors.reset + '\n');

console.log(colors.blue + '─'.repeat(70) + colors.reset + '\n');

// Afficher un aperçu du SQL
try {
  const migrationSQL = readFileSync(join(rootDir, 'supabase-migration.sql'), 'utf8');
  const lines = migrationSQL.split('\n');
  const preview = lines.slice(0, 15).join('\n');
  
  console.log(colors.cyan + '📄 Aperçu du fichier SQL:' + colors.reset);
  console.log(colors.yellow + preview + colors.reset);
  console.log(colors.yellow + '\n... (' + lines.length + ' lignes au total)\n' + colors.reset);
  
  console.log(colors.cyan + '💡 Astuce:' + colors.reset);
  console.log('   Pour voir le fichier complet: ' + colors.green + 'cat supabase-migration.sql' + colors.reset);
  console.log('   Pour le copier: ' + colors.green + 'cat supabase-migration.sql | xclip -selection clipboard' + colors.reset);
  console.log('   (nécessite xclip: sudo apt install xclip)\n');
} catch (error) {
  console.log(colors.yellow + '⚠️  Fichier supabase-migration.sql introuvable' + colors.reset + '\n');
}

console.log(colors.blue + '═'.repeat(70) + colors.reset + '\n');
