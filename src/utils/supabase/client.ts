import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase Environment Variables!');
        console.error('Please check your .env.local file or Vercel Project Settings.');
    }

    return createBrowserClient(
        supabaseUrl!,
        supabaseKey!,
        {
            cookieOptions: {
                secure: true, // BẮT BUỘC: Ép cookie phải secure trên production
                sameSite: 'lax',
                path: '/',
            }
        }
    )
}
