#!/usr/bin/env node
/**
 * Migration granulaire avec diagnostic détaillé
 * Applique chaque modification une par une pour identifier les blocages
 */

import pkg from 'pg';
const { Client } = pkg;
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
  gray: '\x1b[90m',
  bold: '\x1b[1m',
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

async function executeStep(client, sql, description) {
  try {
    log('🔄', `${description}...`, colors.blue);
    await client.query(sql);
    log('✅', description, colors.green);
    return true;
  } catch (error) {
    if (error.message.includes('already exists') || 
        error.message.includes('duplicate') ||
        error.code === '42701' || // duplicate_column
        error.code === '42710') { // duplicate_object
      log('ℹ️', `${description} (déjà existe)`, colors.yellow);
      return true;
    }
    log('❌', `${description} - ÉCHEC`, colors.red);
    log('   ', error.message, colors.gray);
    if (error.detail) log('   ', error.detail, colors.gray);
    return false;
  }
}

async function checkCurrentState(client) {
  log('🔍', 'Vérification de l\'état actuel...', colors.blue);
  console.log('');
  
  try {
    // Vérifier les colonnes de comments
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'comments'
      ORDER BY ordinal_position;
    `);
    
    log('📊', 'Colonnes actuelles de la table comments:', colors.blue);
    result.rows.forEach(row => {
      log('   ', `${row.column_name} (${row.data_type})`, colors.gray);
    });
    console.log('');
    
    const columns = result.rows.map(r => r.column_name);
    const missing = [];
    
    if (!columns.includes('parent_id')) missing.push('parent_id');
    if (!columns.includes('likes_count')) missing.push('likes_count');
    if (!columns.includes('is_reported')) missing.push('is_reported');
    
    if (missing.length > 0) {
      log('⚠️', `Colonnes manquantes: ${missing.join(', ')}`, colors.yellow);
      return false;
    } else {
      log('✅', 'Toutes les colonnes nécessaires sont présentes', colors.green);
      return true;
    }
  } catch (error) {
    log('❌', `Erreur lors de la vérification: ${error.message}`, colors.red);
    return false;
  }
}

async function main() {
  console.log('');
  console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
  console.log(colors.bold + '  🔧 Migration granulaire de la base de données' + colors.reset);
  console.log(colors.bold + colors.blue + '═'.repeat(70) + colors.reset);
  console.log('');

  const env = loadEnv();
  const connectionString = env.DATABASE_URL;

  if (!connectionString) {
    log('❌', 'DATABASE_URL manquant dans .env', colors.red);
    process.exit(1);
  }

  const url = new URL(connectionString);
  const client = new Client({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1) || 'postgres',
    user: url.username || 'postgres',
    password: decodeURIComponent(url.password),
    family: 4,
    connectionTimeoutMillis: 10000,
  });

  try {
    log('🔌', 'Connexion à PostgreSQL...', colors.blue);
    await client.connect();
    log('✅', 'Connecté!', colors.green);
    console.log('');

    // Vérifier l'état actuel
    const isComplete = await checkCurrentState(client);
    
    if (isComplete) {
      console.log('');
      log('🎉', 'La migration est déjà complète!', colors.green);
      log('', '', colors.reset);
      log('🔄', 'Si vous voyez encore l\'erreur "schema cache":', colors.yellow);
      log('   ', '1. Allez sur: https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/settings/api', colors.gray);
      log('   ', '2. Cliquez sur "Restart API"', colors.gray);
      log('   ', '3. Attendez 30 secondes', colors.gray);
      await client.end();
      process.exit(0);
    }

    console.log('');
    log('🚀', 'Application de la migration...', colors.blue);
    console.log('');

    // Étape 1: Ajouter les colonnes manquantes à comments
    log('📋', 'Section 1: Colonnes de la table comments', colors.bold);
    await executeStep(client, 
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE',
      'Ajout colonne parent_id'
    );
    
    await executeStep(client,
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0',
      'Ajout colonne likes_count'
    );
    
    await executeStep(client,
      'ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_reported BOOLEAN DEFAULT FALSE',
      'Ajout colonne is_reported'
    );

    console.log('');
    log('📋', 'Section 2: Index sur comments', colors.bold);
    await executeStep(client,
      'CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id)',
      'Index sur post_id'
    );
    
    await executeStep(client,
      'CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved)',
      'Index sur is_approved'
    );

    console.log('');
    log('📋', 'Section 3: Fonctions pour comments', colors.bold);
    await executeStep(client,
      `CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id UUID)
       RETURNS VOID AS $$
       BEGIN
         UPDATE comments SET likes_count = likes_count + 1 WHERE id = comment_id;
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER`,
      'Fonction increment_comment_likes'
    );

    console.log('');
    log('📋', 'Section 4: Colonnes de la table posts', colors.bold);
    await executeStep(client, 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE', 'Ajout slug');
    await executeStep(client, 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt TEXT', 'Ajout excerpt');
    await executeStep(client, 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT', 'Ajout cover_image');
    await executeStep(client, 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT \'{}\'', 'Ajout tags');
    await executeStep(client, 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT \'draft\'', 'Ajout status');
    await executeStep(client, 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0', 'Ajout views_count');
    await executeStep(client, 'ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0', 'Ajout likes_count');

    console.log('');
    log('🔍', 'Vérification finale...', colors.blue);
    const finalCheck = await checkCurrentState(client);

    console.log('');
    if (finalCheck) {
      log('🎉', 'Migration réussie!', colors.green);
      log('', '', colors.reset);
      log('⚠️', 'IMPORTANT: Rafraîchir le cache Supabase:', colors.yellow);
      log('   ', '1. Ouvrez: https://supabase.com/dashboard/project/ltkcemgbqxicuefcktnx/settings/api', colors.gray);
      log('   ', '2. Cliquez sur "Restart API"', colors.gray);
      log('   ', '3. Attendez 30 secondes', colors.gray);
      log('   ', '4. Puis: npm run dev', colors.gray);
      process.exit(0);
    } else {
      log('❌', 'La migration n\'est pas complète', colors.red);
      process.exit(1);
    }

  } catch (error) {
    console.log('');
    log('❌', `Erreur fatale: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
