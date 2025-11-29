import { createClient } from '@/utils/supabase/server';
import AdminCouponsClient from './AdminCouponsClient';
import { redirect } from 'next/navigation';

export default async function CouponsPage() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { data } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

    const coupons = data || [];

    return <AdminCouponsClient initialCoupons={coupons} />;
}
