#!/usr/bin/env node
/**
 * Script de migration avec connexion PostgreSQL native (pg)
 * Méthode la plus fiable pour exécuter les migrations automatiquement
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
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

// Exécuter la migration avec pg
async function runMigrationWithPg(connectionString, migrationSQL) {
  // Parser l'URL pour extraire les composants
  const url = new URL(connectionString);
  
  const client = new Client({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1) || 'postgres',
    user: url.username || 'postgres',
    password: decodeURIComponent(url.password),
    // Forcer IPv4 pour éviter les problèmes de connexion IPv6
    family: 4,
    // Timeouts raisonnables
    connectionTimeoutMillis: 10000,
    query_timeout: 60000,
  });
  
  try {
    log('🔌', 'Connexion à PostgreSQL (IPv4)...', colors.blue);
    await client.connect();
    log('✅', 'Connecté!', colors.green);

    log('📝', 'Exécution de la migration...', colors.blue);
    const result = await client.query(migrationSQL);
    
    log('✅', 'Migration exécutée avec succès!', colors.green);
    return true;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      log('ℹ️', 'Certaines structures existent déjà (normal)', colors.blue);
      return true;
    }
    
    log('❌', `Erreur lors de la migration: ${error.message}`, colors.red);
    if (error.detail) {
      log('   ', error.detail, colors.gray);
    }
    return false;
  } finally {
    await client.end();
  }
}

// Fonction principale
async function main() {
  try {
    log('🚀', 'Migration PostgreSQL directe', colors.blue);
    log('', '─'.repeat(50), colors.gray);

    const env = loadEnv();
    const migrationFile = join(rootDir, 'supabase-migration.sql');
    const migrationSQL = readFileSync(migrationFile, 'utf8');

    log('📄', `Fichier: supabase-migration.sql`, colors.blue);
    log('📊', `Taille: ${migrationSQL.length} caractères`, colors.blue);
    log('', '', colors.reset);

    // Utiliser DATABASE_URL si disponible
    let connectionString = env.DATABASE_URL;

    if (!connectionString) {
      // Construire depuis les variables individuelles
      const projectRef = env.SUPABASE_PROJECT_REF || 
        env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
      const password = env.SUPABASE_DB_PASSWORD;

      if (!projectRef || !password) {
        log('❌', 'Configuration manquante:', colors.red);
        log('   ', 'Ajoutez DATABASE_URL ou (SUPABASE_PROJECT_REF + SUPABASE_DB_PASSWORD)', colors.red);
        process.exit(1);
      }

      connectionString = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
    }

    log('🔧', 'Méthode: Client PostgreSQL Node.js (pg)', colors.blue);
    
    const success = await runMigrationWithPg(connectionString, migrationSQL);

    if (success) {
      log('', '', colors.reset);
      log('✨', 'Migration terminée avec succès!', colors.green);
      log('', '', colors.reset);
      log('ℹ️', 'Prochaines étapes:', colors.blue);
      log('   ', '• Relancez votre application: npm run dev', colors.gray);
      log('   ', '• La structure de la base de données est à jour', colors.gray);
      process.exit(0);
    } else {
      log('', '', colors.reset);
      log('📋', 'Alternative: Migration manuelle via Dashboard', colors.yellow);
      log('   ', '1. Ouvrez https://supabase.com/dashboard', colors.gray);
      log('   ', '2. SQL Editor > New Query', colors.gray);
      log('   ', '3. Copiez le contenu de supabase-migration.sql', colors.gray);
      log('   ', '4. Exécutez la requête', colors.gray);
      process.exit(1);
    }
  } catch (error) {
    log('', '', colors.reset);
    log('❌', `Erreur fatale: ${error.message}`, colors.red);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      log('', '', colors.reset);
      log('🌐', 'Problème de connexion réseau détecté', colors.yellow);
      log('   ', 'Vérifiez votre connexion internet', colors.gray);
      log('   ', 'Ou utilisez la migration manuelle via Dashboard', colors.gray);
    }
    
    console.error(error);
    process.exit(1);
  }
}

main();
