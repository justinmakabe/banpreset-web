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
        .in('key', [
            'bank_account_number', 'bank_name', 'bank_account_name',
            'social_facebook', 'social_instagram', 'social_twitter', 'social_youtube'
        ]);

    const bankInfo = {
        accountNumber: '',
        bankName: '',
        accountName: ''
    };

    const socialLinks = {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    };

    if (data) {
        data.forEach(item => {
            // Bank Info
            if (item.key === 'bank_account_number') bankInfo.accountNumber = item.value;
            if (item.key === 'bank_name') bankInfo.bankName = item.value;
            if (item.key === 'bank_account_name') bankInfo.accountName = item.value;

            // Social Links
            if (item.key === 'social_facebook') socialLinks.facebook = item.value;
            if (item.key === 'social_instagram') socialLinks.instagram = item.value;
            if (item.key === 'social_twitter') socialLinks.twitter = item.value;
            if (item.key === 'social_youtube') socialLinks.youtube = item.value;
        });
    }

    return <AdminSettingsClient initialBankInfo={bankInfo} initialSocialLinks={socialLinks} />;
}
