import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, transferAmount } = body;

        // Sepay sends 'content' which is the transaction description.
        // We expect it to contain our payment code (e.g., DH123456).
        // The payment code is what we stored in the 'orders' table.

        // Basic validation
        if (!content || !transferAmount) {
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }

        // Extract payment code from content (assuming content IS the code or contains it)
        // For simplicity, we'll assume the content sent by Sepay (which comes from the QR code) IS the payment code.
        // Or we can try to match it.
        const paymentCode = content;

        // Call the secure RPC function to confirm payment
        const { data: success, error } = await supabase.rpc('confirm_payment', {
            p_payment_code: paymentCode,
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

    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
