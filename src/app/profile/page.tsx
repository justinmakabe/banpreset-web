import { createClient } from '@/utils/supabase/server';
import ProfileClient from './ProfileClient';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const initialProfile = {
        full_name: profile?.full_name || '',
        avatar_url: profile?.avatar_url || '',
    };

    return <ProfileClient user={user} initialProfile={initialProfile} />;
}
