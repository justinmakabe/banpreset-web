import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Insert into newsletter_subscribers
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email });

        if (error) {
            // Check if email already exists
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'Email already subscribed' },
                    { status: 400 }
                );
            }
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}
