const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length) {
    env[key.trim()] = value.join('=').trim();
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkComments() {
  console.log('\n🔍 Vérification des derniers commentaires...\n');
  
  const { data, error } = await supabase
    .from('comments')
    .select('id, author_name, author_email, content, is_approved, post_id, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  if (data || data.length === 0) {
    console.log('Aucun commentaire trouvé');
    return;
  }

  console.log(`Total: ${data.length} commentaires\n`);
  data.forEach((comment, i) => {
    const status = comment.is_approved ? '✅ APPROUVÉ' : '❌ EN ATTENTE';
    console.log(`${i + 1}. ${status} - ${comment.author_name} (${comment.author_email})`);
    console.log(`   ID commentaire: ${comment.id}`);
    console.log(`   ID article: ${comment.post_id}`);
    console.log(`   Contenu: "${comment.content.substring(0, 80)}..."`);
    console.log(`   Date: ${new Date(comment.created_at).toLocaleString('fr-FR')}`);
    console.log('');
  });
  
  const approved = data.filter(c => c.is_approved).length;
  const pending = data.filter(c => !c.is_approved).length;
  console.log(`📊 Statistiques: ${approved} approuvés, ${pending} en attente\n`);
}

checkComments().then(() => process.exit(0)).catch(console.error);
