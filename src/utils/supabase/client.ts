import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookieOptions: {
                secure: true, // BẮT BUỘC: Ép cookie phải secure trên production
                sameSite: 'lax',
                path: '/',
            }
        }
    )
}
