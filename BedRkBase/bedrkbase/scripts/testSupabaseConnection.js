const { supabase } = require('../lib/supabaseClient');

async function testConnection() {
  console.log('Testing Supabase connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase auth session retrieval failed:', {
        message: error.message
      });
      return false;
    }
    console.log('Supabase auth session:', data.session);
    console.log('Supabase connection successful.');
    return true;
  } catch (err) {
    console.error('Unexpected error during Supabase auth session retrieval:', {
      message: err.message,
      stack: err.stack,
    });
    return false;
  }
}

testConnection();
