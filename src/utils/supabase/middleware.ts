import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Debug logging
    console.log('[Middleware] updateSession called:', request.nextUrl.pathname)

    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    console.log('[Middleware] Setting cookies:', cookiesToSet.map(c => c.name))
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response = NextResponse.next({ request: { headers: request.headers } })

                        // Ghi đè cookie với option bảo mật cao nhất
                        // Removed domain: '' to fix Vercel/Production cookie rejection (Host-only cookie)
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                            path: '/',
                            sameSite: 'lax',
                            secure: true, // BẮT BUỘC
                        })
                    })
                },
            },
        }
    )

    // Refresh token để giữ session
    const { data: { user } } = await supabase.auth.getUser()
    console.log('[Middleware] User session:', user?.id ? 'Found' : 'Not Found')

    // Protected Routes
    const protectedPaths = ['/admin', '/profile', '/orders', '/checkout', '/wishlist'];
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isProtected && !user) {
        console.log('[Middleware] Redirecting to login (No Session)')
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
