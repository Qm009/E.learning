const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('--- DIAGNOSTIC SUPABASE ---');
console.log('URL:', supabaseUrl ? 'OK' : 'MISSING');
console.log('Key:', supabaseKey ? 'OK (length: ' + supabaseKey.length + ')' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('⏳ Test de connexion en cours...');
  
  // Test simple : lister les tables ou compter les utilisateurs
  const { data, error, status } = await supabase.from('users').select('*').limit(1);
  
  if (error) {
    console.error('❌ ERREUR SUPABASE:', error.message);
    if (error.hint) console.log('Indice:', error.hint);
    console.log('Status HTTP:', status);
  } else {
    console.log('✅ CONNEXION RÉUSSIE !');
    console.log('Données reçues (1er utilisateur) :', data ? JSON.stringify(data[0], null, 2) : 'Aucun utilisateur trouvé');
  }
}

test().catch(err => console.error('FATAL:', err));
