import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase credentials missing. Backend will fail until configured.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Enhanced Supabase Wrapper with Debug Logging
 */
export const supabaseQuery = {
  async from(table: string) {
    const start = Date.now();
    return {
      select: async (columns: string = '*') => {
        const { data, error } = await supabase.from(table).select(columns);
        const duration = Date.now() - start;
        await logToSupabase("DB", error ? "ERROR" : "INFO", `SELECT from ${table}`, { duration: `${duration}ms`, error });
        return { data, error };
      },
      insert: async (values: any) => {
        const { data, error } = await supabase.from(table).insert(values).select();
        const duration = Date.now() - start;
        await logToSupabase("DB", error ? "ERROR" : "INFO", `INSERT into ${table}`, { duration: `${duration}ms`, error });
        return { data, error };
      },
      update: async (values: any, match: any) => {
        const { data, error } = await supabase.from(table).update(values).match(match).select();
        const duration = Date.now() - start;
        await logToSupabase("DB", error ? "ERROR" : "INFO", `UPDATE ${table}`, { duration: `${duration}ms`, error, match });
        return { data, error };
      }
    };
  }
};

export async function logToSupabase(source: string, level: string, message: string, details?: any) {
  try {
    // We use the raw client to avoid infinite loops in logging
    await supabase.from('logs').insert({
      source,
      level,
      message,
      details: details ? JSON.stringify(details) : null
    });
  } catch (err) {
    console.error("Critical: Failed to log to Supabase:", err);
  }
}
