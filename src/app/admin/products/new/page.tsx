import { createClient } from '@/utils/supabase/server';
import AdminProductNewClient from './AdminProductNewClient';
import { redirect } from 'next/navigation';

export default async function AddProductPage() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { data: categories } = await supabase.from('categories').select('*').order('name');

    return <AdminProductNewClient initialCategories={categories || []} />;
}
