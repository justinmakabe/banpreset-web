import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    // Fetch Bank Info
    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['bank_account_number', 'bank_name', 'bank_account_name']);

    const bankInfo: any = {};
    if (settings) {
        settings.forEach(item => {
            if (item.key === 'bank_account_number') bankInfo.accountNumber = item.value;
            if (item.key === 'bank_name') bankInfo.bankName = item.value;
            if (item.key === 'bank_account_name') bankInfo.accountName = item.value;
        });
    }

    return <CheckoutClient user={user} bankInfo={bankInfo} />;
}
