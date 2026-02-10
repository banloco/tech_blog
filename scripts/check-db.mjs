#!/usr/bin/env node
/**
 * Vérifier l'état de la base de données et diagnostiquer les problèmes
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

// Charger les variables d'environnement
function loadEnv() {
  try {
    const envFile = readFileSync(join(rootDir, '.env'), 'utf8');
    const env = Object.fromEntries(
      envFile.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
          const index = line.indexOf('=');
          if (index === -1) return null;
          return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
        })
        .filter(Boolean)
    );
    return env;
  } catch (error) {
    log('❌', 'Erreur lors de la lecture du fichier .env', colors.red);
    throw error;
  }
}

async function checkDatabase() {
  try {
    log('🔍', 'Vérification de l\'état de la base de données...', colors.blue);
    console.log('');

    const env = loadEnv();
    const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      log('❌', 'Variables d\'environnement manquantes', colors.red);
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Test 1: Vérifier si la table comments existe
    log('1️⃣', 'Test: Table comments existe ?', colors.blue);
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id')
      .limit(1);

    if (commentsError && commentsError.code === '42P01') {
      log('❌', 'Table comments n\'existe pas!', colors.red);
      log('   ', '→ La migration n\'a pas été exécutée', colors.yellow);
      log('   ', '→ Exécutez: npm run migrate:manual', colors.yellow);
      return false;
    } else if (commentsError) {
      log('⚠️', `Erreur inattendue: ${commentsError.message}`, colors.yellow);
    } else {
      log('✅', 'Table comments existe', colors.green);
    }

    // Test 2: Vérifier les colonnes de la table comments
    log('', '', colors.reset);
    log('2️⃣', 'Test: Colonnes de la table comments', colors.blue);
    
    const { data: testData, error: testError } = await supabase
      .from('comments')
      .select('id, post_id, parent_id, author_name, content, likes_count, is_reported')
      .limit(1);

    if (testError) {
      if (testError.message.includes('parent_id') || 
          testError.message.includes('likes_count') || 
          testError.message.includes('is_reported')) {
        log('❌', 'Colonnes manquantes détectées!', colors.red);
        log('   ', `→ Erreur: ${testError.message}`, colors.yellow);
        log('', '', colors.reset);
        log('📋', 'La migration doit être exécutée:', colors.blue);
        log('   ', '1. Exécutez: npm run migrate:manual', colors.yellow);
        log('   ', '2. Suivez les instructions pour copier le SQL', colors.yellow);
        log('   ', '3. Collez dans le Dashboard Supabase', colors.yellow);
        return false;
      } else {
        log('❌', `Erreur: ${testError.message}`, colors.red);
        if (testError.hint) {
          log('   ', `Indice: ${testError.hint}`, colors.yellow);
        }
        
        // Vérifier si c'est un problème de cache
        if (testError.message.includes('schema cache') || testError.message.includes('not find')) {
          log('', '', colors.reset);
          log('🔄', 'Problème de cache Supabase détecté!', colors.yellow);
          log('', '', colors.reset);
          log('📋', 'Solution: Rafraîchir le cache API:', colors.blue);
          log('   ', '1. Ouvrez https://supabase.com/dashboard', colors.yellow);
          log('   ', '2. Sélectionnez votre projet', colors.yellow);
          log('   ', '3. Settings > API', colors.yellow);
          log('   ', '4. Cliquez sur "Restart API" (ou "Reload schema cache")', colors.yellow);
          log('   ', '5. Attendez 20-30 secondes', colors.yellow);
          log('   ', '6. Relancez votre application', colors.yellow);
          log('', '', colors.reset);
          log('💡', 'Alternative rapide:', colors.blue);
          log('   ', 'Cliquez sur ce lien direct:', colors.yellow);
          log('   ', `${SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/settings/api`, colors.green);
        }
        return false;
      }
    }

    log('✅', 'Toutes les colonnes sont présentes', colors.green);
    log('   ', '→ parent_id: OK', colors.green);
    log('   ', '→ likes_count: OK', colors.green);
    log('   ', '→ is_reported: OK', colors.green);

    // Test 3: Vérifier la table posts
    log('', '', colors.reset);
    log('3️⃣', 'Test: Table posts', colors.blue);
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, slug, excerpt, tags, status, views_count, likes_count')
      .limit(1);

    if (postsError) {
      log('⚠️', `Problème avec la table posts: ${postsError.message}`, colors.yellow);
    } else {
      log('✅', 'Table posts à jour', colors.green);
    }

    log('', '', colors.reset);
    log('🎉', 'Base de données configurée correctement!', colors.green);
    return true;

  } catch (error) {
    log('❌', `Erreur: ${error.message}`, colors.red);
    console.error(error);
    return false;
  }
}

async function main() {
  console.log('');
  console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
  console.log(colors.bold + '  🔍 Diagnostic de la base de données' + colors.reset);
  console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
  console.log('');

  const success = await checkDatabase();

  console.log('');
  console.log(colors.blue + '═'.repeat(70) + colors.reset);
  console.log('');

  process.exit(success ? 0 : 1);
}

main();
