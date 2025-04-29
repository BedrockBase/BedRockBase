/**
 * Centralized Config Management Utility
 * 
 * Loads, validates, and types environment variables for the backend.
 * Throws on missing required variables.
 * 
 * @see [Checklist 8] and snippets.md
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().optional(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  FRONTEND_URL: z.string().url().optional(),
  // Add more as needed
});

const parsed = ConfigSchema.safeParse(process.env);

if (!parsed.success) {
  // Print all validation errors
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
