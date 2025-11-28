import { createClient } from '@/utils/supabase/client';
import { createClient as createJsClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = typeof window !== 'undefined'
    ? createClient()
    : createJsClient(supabaseUrl, supabaseAnonKey);

