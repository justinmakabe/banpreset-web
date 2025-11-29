import { createClient } from '@/utils/supabase/server';
import AdminSettingsClient from './AdminSettingsClient';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { data } = await supabase
        .from('settings')
        .select('*')
        .in('key', ['bank_account_number', 'bank_name', 'bank_account_name']);

    const bankInfo = {
        accountNumber: '',
        bankName: '',
        accountName: ''
    };

    if (data) {
        data.forEach(item => {
            if (item.key === 'bank_account_number') bankInfo.accountNumber = item.value;
            if (item.key === 'bank_name') bankInfo.bankName = item.value;
            if (item.key === 'bank_account_name') bankInfo.accountName = item.value;
        });
    }

    return <AdminSettingsClient initialBankInfo={bankInfo} />;
}
