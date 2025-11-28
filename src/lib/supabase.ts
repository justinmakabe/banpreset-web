import { createClient as createJsClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = typeof window !== 'undefined'
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createJsClient(supabaseUrl, supabaseAnonKey);

