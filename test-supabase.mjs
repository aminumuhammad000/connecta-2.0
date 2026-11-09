import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sbpnnhnkctojddgfkyym.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ig3p6xk2WIA9iGwHA-0w3w_GPL_lNAf';

async function testSupabase() {
  console.log('Testing connection to Supabase:', SUPABASE_URL);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Check categories
  const catRes = await supabase.from('service_categories').select('*').limit(5);
  console.log('service_categories query:', catRes.error ? catRes.error.message : catRes.data);

  // Check profiles
  const profRes = await supabase.from('profiles').select('*').limit(5);
  console.log('profiles query:', profRes.error ? profRes.error.message : profRes.data);

  // Check requests
  const reqRes = await supabase.from('service_requests').select('*').limit(5);
  console.log('service_requests query:', reqRes.error ? reqRes.error.message : reqRes.data);
}

testSupabase().catch(console.error);
