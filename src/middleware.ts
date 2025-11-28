import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. Tạo response ban đầu
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Khởi tạo Supabase Client cho Middleware
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
                        // Bước quan trọng: Ghi cookie vào Request để Server Component đọc được ngay
                        request.cookies.set(name, value)

                        // Cập nhật lại response
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })

                        // Bước QUAN TRỌNG NHẤT: Ghi cookie vào Response trả về Client
                        // Ép buộc Secure: true bất chấp môi trường để sửa lỗi mất session
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                            secure: true, // <--- PHẢI CÓ DÒNG NÀY
                            sameSite: 'lax',
                            httpOnly: true,
                        })
                    })
                },
            },
        }
    )

    // 3. Refresh Token (Quan trọng để giữ session sống)
    // Nếu không có dòng này, session sẽ chết sau 1 tiếng
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 4. Logic bảo vệ route (Chặn người chưa đăng nhập vào admin)
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}