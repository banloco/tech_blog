#!/usr/bin/env node
/**
 * Script de vérification et migration automatique
 * Vérifie si les colonnes nécessaires existent et exécute la migration si nécessaire
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

// Charger les variables d'environnement
async function loadEnv() {
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

// Vérifier si les colonnes nécessaires existent
async function checkMigrationNeeded(supabase) {
  try {
    log('🔍', 'Vérification de l\'état de la base de données...', colors.blue);
    
    // Tester si les colonnes existent en interrogeant la table comments
    const { data, error } = await supabase
      .from('comments')
      .select('id, parent_id, likes_count, is_reported')
      .limit(1);

    if (error) {
      // Si l'erreur indique que la colonne n'existe pas, migration nécessaire
      if (error.message.includes('column') || error.code === '42703') {
        return true;
      }
      
      // Si la table n'existe pas du tout, migration nécessaire
      if (error.code === '42P01') {
        log('⚠️', 'Table comments inexistante', colors.yellow);
        return true;
      }
      
      throw error;
    }

    log('✅', 'Base de données à jour, migration non nécessaire', colors.green);
    return false;
  } catch (error) {
    log('⚠️', `Erreur de vérification: ${error.message}`, colors.yellow);
    return true; // En cas de doute, on tente la migration
  }
}

// Exécuter la migration SQL
async function runMigration(supabase) {
  try {
    log('📄', 'Lecture du fichier de migration...', colors.blue);
    const migrationSQL = readFileSync(join(rootDir, 'supabase-migration.sql'), 'utf8');
    
    log('🚀', 'Exécution de la migration...', colors.blue);
    
    // Séparer les commandes SQL et les exécuter une par une
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--'));

    // Utiliser l'API REST PostgreSQL via la fonction rpc si disponible
    // Sinon, essayer d'exécuter via des requêtes SQL brutes
    const { error } = await supabase.rpc('exec', { sql: migrationSQL });
    
    if (error) {
      // Si la fonction rpc n'existe pas, on informe l'utilisateur
      log('⚠️', 'Impossible d\'exécuter la migration automatiquement via l\'API', colors.yellow);
      log('ℹ️', 'Veuillez exécuter la migration manuellement:', colors.blue);
      log('   ', '1. Ouvrez le Dashboard Supabase > SQL Editor', colors.blue);
      log('   ', '2. Copiez le contenu de supabase-migration.sql', colors.blue);
      log('   ', '3. Exécutez-le dans l\'éditeur SQL', colors.blue);
      return false;
    }

    log('✅', 'Migration exécutée avec succès!', colors.green);
    return true;
  } catch (error) {
    log('❌', `Erreur lors de la migration: ${error.message}`, colors.red);
    return false;
  }
}

// Fonction principale
async function main() {
  try {
    log('🎯', 'Démarrage de la vérification de migration...', colors.blue);
    
    const env = await loadEnv();
    const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      log('❌', 'Variables d\'environnement manquantes:', colors.red);
      log('   ', `NEXT_PUBLIC_SUPABASE_URL: ${!!SUPABASE_URL ? '✓' : '✗'}`, colors.red);
      log('   ', `SUPABASE_KEY: ${!!SUPABASE_KEY ? '✓' : '✗'}`, colors.red);
      process.exit(1);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const needsMigration = await checkMigrationNeeded(supabase);

    if (!needsMigration) {
      log('🎉', 'Tout est à jour!', colors.green);
      process.exit(0);
    }

    log('⚡', 'Migration nécessaire détectée', colors.yellow);
    
    // Afficher les instructions pour la migration manuelle
    log('📋', 'Pour appliquer la migration:', colors.blue);
    log('   ', '1. Ouvrez votre Dashboard Supabase', colors.blue);
    log('   ', '2. Allez dans SQL Editor', colors.blue);
    log('   ', '3. Copiez et exécutez le contenu de supabase-migration.sql', colors.blue);
    log('   ', '4. Ou exécutez: node run-migration.mjs', colors.blue);
    
    // Proposer d'exécuter la migration automatiquement
    log('', '', colors.reset);
    log('💡', 'Astuce: Pour éviter cette vérification, assurez-vous que la migration est appliquée', colors.yellow);
    
    process.exit(0);
  } catch (error) {
    log('❌', `Erreur fatale: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  }
}

main();
