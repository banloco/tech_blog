#!/usr/bin/env node
/**
 * Vérifier directement via l'API les colonnes réelles de la table
 * et générer les commandes SQL nécessaires
 */

import { createClient } from '@supabase/supabase-js';
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
  gray: '\x1b[90m',
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function loadEnv() {
  const envFile = readFileSync(join(rootDir, '.env'), 'utf8');
  return Object.fromEntries(
    envFile.split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const index = line.indexOf('=');
        if (index === -1) return null;
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
      })
      .filter(Boolean)
  );
}

async function main() {
  console.log('');
  console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
  console.log(colors.bold + '  🔍 Diagnostic approfondi de la base de données' + colors.reset);
  console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
  console.log('');

  const env = loadEnv();
  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SUPABASE_PUBLISHABLE_KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  log('🔑', 'Configuration détectée:', colors.blue);
  log('   ', `URL: ${SUPABASE_URL}`, colors.gray);
  log('   ', `ANON KEY: ${SUPABASE_ANON_KEY ? '✓ Présent' : '✗ Manquant'}`, colors.gray);
  log('   ', `PUBLISHABLE KEY: ${SUPABASE_PUBLISHABLE_KEY ? '✓ Présent' : '✗ Manquant'}`, colors.gray);
  console.log('');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    log('❌', 'Configuration Supabase manquante', colors.red);
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test 1: Vérifier si on peut accéder à la table comments
  log('1️⃣', 'Test d\'accès à la table comments...', colors.blue);
  try {
    const { data, error, count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        log('❌', 'Table comments n\'existe pas!', colors.red);
      } else {
        log('⚠️', `Erreur: ${error.message}`, colors.yellow);
        log('   ', `Code: ${error.code}`, colors.gray);
        if (error.hint) log('   ', `Hint: ${error.hint}`, colors.gray);
      }
    } else {
      log('✅', `Table comments existe (${count || 0} ligne(s))`, colors.green);
    }
  } catch (e) {
    log('❌', `Erreur: ${e.message}`, colors.red);
  }
  
  console.log('');

  // Test 2: Essayer d'accéder aux colonnes spécifiques
  log('2️⃣', 'Test des colonnes individuelles...', colors.blue);
  
  const columnsToTest = [
    'id',
    'post_id',
    'author_name',
    'author_email',
    'content',
    'is_approved',
    'created_at',
    'parent_id',      // Nouvelle colonne
    'likes_count',    // Nouvelle colonne
    'is_reported'     // Nouvelle colonne
  ];

  for (const column of columnsToTest) {
    try {
      const { error } = await supabase
        .from('comments')
        .select(column)
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          log('❌', `Colonne ${column} manquante`, colors.red);
        } else {
          log('⚠️', `${column}: ${error.message}`, colors.yellow);
        }
      } else {
        log('✅', `Colonne ${column} existe`, colors.green);
      }
    } catch (e) {
      log('❌', `${column}: ${e.message}`, colors.red);
    }
  }

  console.log('');
  console.log(colors.bold + colors.cyan + '📋 SQL à exécuter dans Supabase Dashboard:' + colors.reset);
  console.log('');
  console.log(colors.yellow + '-- Ajouter les colonnes manquantes à comments');
  console.log('ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;');
  console.log('ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;');
  console.log('ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_reported BOOLEAN DEFAULT FALSE;');
  console.log('');
  console.log('-- Ajouter les index');
  console.log('CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);');
  console.log('CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved);');
  console.log('');
  console.log('-- Ajouter la fonction');
  console.log('CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)');
  console.log('RETURNS VOID AS $$');
  console.log('BEGIN');
  console.log('  UPDATE comments SET likes_count = likes_count + 1 WHERE id = comment_id;');
  console.log('END;');
  console.log('$$ LANGUAGE plpgsql SECURITY DEFINER;' + colors.reset);
  console.log('');

  console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
  console.log('');
  console.log(colors.bold + colors.cyan + '🔗 Liens rapides:' + colors.reset);
  console.log('');
  console.log(colors.green + '1. SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/sql/new' + colors.reset);
  console.log('');
  console.log(colors.green + '2. API Settings (pour restart):');
  console.log('   https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/settings/api' + colors.reset);
  console.log('');
  console.log(colors.blue + '═'.repeat(70) + colors.reset);
  console.log('');
}

main();
