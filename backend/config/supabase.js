const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ WARNING: SUPABASE_URL ou SUPABASE_KEY est manquant dans le fichier .env !');
  console.warn('Veuillez créer votre projet Supabase et ajouter ces variables.');
} else {
  console.log('🔌 Connecting to Supabase...');
}

// Initialisation du client Supabase
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key');

module.exports = supabase;
