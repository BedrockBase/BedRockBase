import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration interface for Supabase client
 */
interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

/**
 * Creates and returns a Supabase client instance using environment variables
 * @param useServiceRole - Whether to use the service role key instead of anon key
 * @returns Initialized Supabase client
 */
export function getSupabaseClient<SchemaName extends string = "public">(useServiceRole = false): SupabaseClient<any, SchemaName, any> {
  // Get credentials from environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = useServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment variables');
  }

  // Determine the schema based on the useServiceRole flag
  const schema = useServiceRole ? 'auth' : 'public';

  // Create and return the Supabase client with the determined schema
  return createClient(supabaseUrl, supabaseKey, {
    db: {
      schema: schema,
    },
  }) as SupabaseClient<any, any, any>;
}

/**
 * Example function to execute a query in Supabase
 * @param tableName - The name of the table to query
 * @param useServiceRole - Whether to use service role permissions
 * @returns Query result
 */
export async function executeQuery(tableName: string, useServiceRole = false) {
  try {
    const supabase = getSupabaseClient(useServiceRole);
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error executing Supabase query:', error);
    throw error;
  }
}

/**
 * Example function to execute a stored procedure in Supabase
 * @param functionName - The name of the PostgreSQL function to call
 * @param params - Parameters to pass to the function
 * @returns Function execution result
 */
export async function executeFunction(functionName: string, params: Record<string, any>) {
  try {
    const supabase = getSupabaseClient(true); // Using service role for RPC calls
    const { data, error } = await supabase
      .rpc(functionName, params);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error executing Supabase function ${functionName}:`, error);
    throw error;
  }
}
