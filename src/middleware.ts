import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Tạo response khởi tạo
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Khởi tạo Supabase Client ngay tại đây
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        // ÉP BUỘC COOKIE PHẢI BẢO MẬT (Sửa lỗi F5 mất session)
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                            secure: true, // <--- Quan trọng nhất
                            sameSite: 'lax',
                            httpOnly: true,
                        })
                    })
                },
            },
        }
    )

    // 3. Refresh Token (Giữ đăng nhập khi F5)
    // Quan trọng: Phải gọi getUser() để Supabase làm mới cookie
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 4. Bảo vệ trang Admin (Nếu chưa đăng nhập thì đá về Login)
    // Bạn có thể sửa '/admin' thành '/dashboard' tùy vào đường dẫn thật của bạn
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 5. Trả về response đã được gắn cookie mới
    return response
}

// Cấu hình Matcher để Middleware chạy trên mọi trang (trừ file tĩnh)
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}