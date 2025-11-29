import { createClient } from '@/utils/supabase/server';
import AdminCategoriesClient from './AdminCategoriesClient';
import { redirect } from 'next/navigation';

export default async function CategoriesPage() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching categories:', error);
    }

    const categories = data || [];

    return <AdminCategoriesClient initialCategories={categories} />;
}
