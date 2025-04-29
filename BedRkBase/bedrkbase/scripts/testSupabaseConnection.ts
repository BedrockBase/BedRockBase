import dotenv from 'dotenv';
import path from 'path';
import { testConnection } from '../lib/supabaseClient';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('Testing Supabase connection...');
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const result = await testConnection();
  console.log('Connection test result:', result);
}

main().catch(console.error);
