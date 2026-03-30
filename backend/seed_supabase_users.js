const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);

    console.log('Inserting admin...');
    const { data: admin, error: e1 } = await supabase.from('users').upsert([
      {
        name: 'Super Admin',
        email: 'admin@test.com',
        password: password,
        role: 'admin',
        status: 'approved',
        requestedRole: 'admin'
      }
    ], { onConflict: 'email' }).select();

    if (e1) console.error(e1);
    else console.log('Admin inserted/updated:', admin[0].email);

    console.log('Inserting instructor...');
    const { data: instr, error: e2 } = await supabase.from('users').upsert([
      {
        name: 'Master Instructor',
        email: 'instructor@test.com',
        password: password,
        role: 'instructor',
        status: 'approved',
        requestedRole: 'instructor'
      }
    ], { onConflict: 'email' }).select();

    if (e2) console.error(e2);
    else console.log('Instructor inserted/updated:', instr[0].email);

    console.log('Inserting student...');
    const { data: stu, error: e3 } = await supabase.from('users').upsert([
      {
        name: 'Test Student',
        email: 'student@test.com',
        password: password,
        role: 'student',
        status: 'approved',
        requestedRole: 'student'
      }
    ], { onConflict: 'email' }).select();
    
    if (e3) console.error(e3);
    else console.log('Student inserted/updated:', stu[0].email);

  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
seed();
