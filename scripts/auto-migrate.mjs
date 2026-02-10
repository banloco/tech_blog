#!/usr/bin/env node
/**
 * Script de migration automatique avec PostgreSQL direct
 * Exécute automatiquement la migration si nécessaire
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
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

// Extraire la connexion PostgreSQL de l'URL Supabase ou DATABASE_URL
function getPostgresConnection(env) {
  // Priorité 1: Utiliser DATABASE_URL si disponible
  if (env.DATABASE_URL) {
    try {
      const url = new URL(env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1) || 'postgres',
        user: url.username || 'postgres',
        password: decodeURIComponent(url.password),
      };
    } catch (error) {
      log('⚠️', `DATABASE_URL invalide: ${error.message}`, colors.yellow);
    }
  }

  // Priorité 2: Construire depuis les variables individuelles
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = env.SUPABASE_PROJECT_REF;
  const dbPassword = env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL manquant');
  }

  // Extraire le project_ref de l'URL si non fourni
  const ref = projectRef || supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  if (!ref) {
    throw new Error('Impossible d\'extraire le project reference');
  }

  return {
    host: `db.${ref}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword || env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

// Vérifier si psql est installé
async function checkPsqlInstalled() {
  try {
    await execAsync('which psql');
    return true;
  } catch {
    return false;
  }
}

// Exécuter la migration via psql
async function runMigrationWithPsql(connection, migrationFile) {
  const { host, port, database, user, password } = connection;
  
  // Créer la commande psql
  const command = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${user} -d ${database} -f "${migrationFile}"`;
  
  try {
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('NOTICE')) {
      log('⚠️', 'Avertissements:', colors.yellow);
      console.log(colors.gray + stderr + colors.reset);
    }
    
    if (stdout) {
      log('📋', 'Résultat:', colors.blue);
      console.log(colors.gray + stdout + colors.reset);
    }
    
    return true;
  } catch (error) {
    log('❌', `Erreur psql: ${error.message}`, colors.red);
    if (error.stderr) {
      console.error(colors.red + error.stderr + colors.reset);
    }
    return false;
  }
}

// Exécuter la migration via l'API Supabase Management
async function runMigrationWithAPI(env, migrationSQL) {
  const projectRef = env.SUPABASE_PROJECT_REF || 
    env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  const accessToken = env.SUPABASE_ACCESS_TOKEN;

  if (!projectRef || !accessToken) {
    log('⚠️', 'Variables manquantes pour l\'API Management:', colors.yellow);
    log('   ', 'SUPABASE_PROJECT_REF ou SUPABASE_ACCESS_TOKEN', colors.yellow);
    return false;
  }

  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: migrationSQL }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    log('✅', 'Migration exécutée via API Management', colors.green);
    return true;
  } catch (error) {
    log('⚠️', `Erreur API Management: ${error.message}`, colors.yellow);
    return false;
  }
}

// Exécuter avec la méthode fetch vers le endpoint PostgREST
async function runMigrationWithFetch(env, migrationSQL) {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return false;
  }

  // Diviser le SQL en transactions plus petites
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  try {
    log('📡', 'Tentative via endpoint direct...', colors.blue);
    
    // Essayer d'exécuter via l'endpoint REST
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ sql: migrationSQL }),
    });

    if (response.ok) {
      log('✅', 'Migration réussie via endpoint direct', colors.green);
      return true;
    }
  } catch (error) {
    // Continuer avec d'autres méthodes
  }

  return false;
}

// Fonction principale
async function main() {
  try {
    log('🚀', 'Migration automatique Supabase', colors.blue);
    log('', '─'.repeat(50), colors.gray);

    const env = loadEnv();
    const migrationFile = join(rootDir, 'supabase-migration.sql');
    const migrationSQL = readFileSync(migrationFile, 'utf8');

    log('📄', `Fichier: ${migrationFile}`, colors.blue);
    log('📊', `Taille: ${migrationSQL.length} caractères`, colors.blue);
    log('', '', colors.reset);

    // Méthode 1: psql (recommandé)
    const hasPsql = await checkPsqlInstalled();
    if (hasPsql && env.SUPABASE_DB_PASSWORD) {
      log('🔧', 'Méthode: PostgreSQL direct (psql)', colors.blue);
      try {
        const connection = getPostgresConnection(env);
        const success = await runMigrationWithPsql(connection, migrationFile);
        
        if (success) {
          log('', '', colors.reset);
          log('✨', 'Migration terminée avec succès!', colors.green);
          log('ℹ️', 'Redémarrez l\'application si nécessaire', colors.blue);
          process.exit(0);
        }
      } catch (error) {
        log('⚠️', `Erreur psql: ${error.message}`, colors.yellow);
      }
    }

    // Méthode 2: API Management
    log('🔧', 'Méthode: API Supabase Management', colors.blue);
    const apiSuccess = await runMigrationWithAPI(env, migrationSQL);
    if (apiSuccess) {
      log('', '', colors.reset);
      log('✨', 'Migration terminée avec succès!', colors.green);
      process.exit(0);
    }

    // Méthode 3: Endpoint REST
    log('🔧', 'Méthode: Endpoint REST', colors.blue);
    const fetchSuccess = await runMigrationWithFetch(env, migrationSQL);
    if (fetchSuccess) {
      log('', '', colors.reset);
      log('✨', 'Migration terminée avec succès!', colors.green);
      process.exit(0);
    }

    // Si toutes les méthodes automatiques échouent
    log('', '', colors.reset);
    log('⚠️', 'Migration automatique impossible', colors.yellow);
    log('', '', colors.reset);
    log('📋', 'Veuillez appliquer la migration manuellement:', colors.blue);
    log('', '', colors.reset);
    log('1️⃣', 'Via le Dashboard Supabase (RECOMMANDÉ)', colors.blue);
    log('   ', '• Ouvrez https://supabase.com/dashboard', colors.gray);
    log('   ', '• SQL Editor > New Query', colors.gray);
    log('   ', '• Copiez le contenu de supabase-migration.sql', colors.gray);
    log('   ', '• Exécutez la requête', colors.gray);
    log('', '', colors.reset);
    log('2️⃣', 'Via psql (si installé)', colors.blue);
    log('   ', '• Installez PostgreSQL client', colors.gray);
    log('   ', '• Ajoutez SUPABASE_DB_PASSWORD dans .env', colors.gray);
    log('   ', '• Relancez ce script', colors.gray);
    log('', '', colors.reset);
    log('💡', 'Variables d\'environnement utiles:', colors.yellow);
    log('   ', '• SUPABASE_DB_PASSWORD (pour psql)', colors.gray);
    log('   ', '• SUPABASE_ACCESS_TOKEN (pour API Management)', colors.gray);
    log('   ', '• SUPABASE_PROJECT_REF (pour API)', colors.gray);
    
    process.exit(1);
  } catch (error) {
    log('', '', colors.reset);
    log('❌', `Erreur fatale: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  }
}

main();
