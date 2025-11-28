import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response = NextResponse.next({ request: { headers: request.headers } })

                        // Ghi đè cookie với option bảo mật cao nhất
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                            domain: '',
                            path: '/',
                            sameSite: 'lax',
                            secure: true, // BẮT BUỘC
                            httpOnly: true, // BẮT BUỘC
                        })
                    })
                },
            },
        }
    )

    // Refresh token để giữ session
    const { data: { user } } = await supabase.auth.getUser()

    // Bảo vệ route Admin
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
