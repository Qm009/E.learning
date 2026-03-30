const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function resetPass() {
  try {
    const email = 'yelemoujosias5@gmail.com';
    const newPassword = 'password123';
    
    // Check if user exists
    const { data: user, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error) {
      console.error(error);
      return;
    }
    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const { data, error: updateError } = await supabase.from('users').upsert([
        {
          email: email,
          password: hashedPassword,
          name: 'Josias',
          role: 'student',
          status: 'approved',
          requestedRole: 'student'
        }
      ], { onConflict: 'email' }).select();
      
      if (updateError) {
        console.error(updateError);
      } else {
        console.log(`Password reset/set successfully for ${email}. New password is: ${newPassword}`);
      }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

resetPass();
