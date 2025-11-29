import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        // Verify API Key from SePay
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Apikey ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Invalid API key format' },
                { status: 401 }
            );
        }

        const apiKey = authHeader.substring(7); // Remove 'Apikey ' prefix

        if (apiKey !== process.env.SEPAY_API_KEY) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Invalid API key' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content, transferAmount } = body;

        // Sepay sends 'content' which is the transaction description.
        // We expect it to contain our payment code (e.g., DH1005).

        // Basic validation
        if (!content || !transferAmount) {
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }

        // Extract payment code from content
        // Expected format: DH + OrderCode (e.g., DH1005)
        // We use a regex to find "DH" followed by digits
        const match = content.match(/DH(\d+)/i);

        if (match) {
            const orderCode = parseInt(match[1]);

            // Call the secure RPC function to confirm payment by order code
            const { data: success, error } = await supabase.rpc('confirm_payment_by_order_code', {
                p_order_code: orderCode,
                p_amount: transferAmount
            });

            if (error) {
                console.error('Error confirming payment:', error);
                return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
            }

            if (success) {
                return NextResponse.json({ success: true, message: 'Payment confirmed' });
            } else {
                return NextResponse.json({ success: false, message: 'Order not found or amount mismatch' }, { status: 404 });
            }
        } else {
            // Fallback: Try to use the old logic if it's not a short code (optional)
            // For now, we return an error if it doesn't match the format
            return NextResponse.json({ success: false, message: 'Invalid payment content format' }, { status: 400 });
        }

    } catch (error: unknown) {
        console.error('Webhook error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
