import { createClient } from '@/utils/supabase/server';
import OrdersClient from './OrdersClient';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // Fetch Bank Info
    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['bank_account_number', 'bank_name', 'bank_account_name']);

    const bankInfo: { accountNumber?: string; bankName?: string; accountName?: string } = {};
    if (settings) {
        settings.forEach(item => {
            if (item.key === 'bank_account_number') bankInfo.accountNumber = item.value;
            if (item.key === 'bank_name') bankInfo.bankName = item.value;
            if (item.key === 'bank_account_name') bankInfo.accountName = item.value;
        });
    }

    // Fetch Orders
    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                price,
                products (
                    id,
                    name,
                    image_url,
                    download_url
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return <OrdersClient initialOrders={orders || []} bankInfo={bankInfo} />;
}
