import { createClient } from '@/utils/supabase/server';
import AdminProductsClient from './AdminProductsClient';
import { redirect } from 'next/navigation';

export default async function AdminProductsPage() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            categories (
                name
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
    }

    const products = data || [];

    return <AdminProductsClient initialProducts={products} />;
}
