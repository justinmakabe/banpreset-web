import { createClient } from '@/utils/supabase/server';
import AdminProductEditClient from './AdminProductEditClient';
import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // Fetch Categories
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    // Fetch Product
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        redirect('/admin/products');
    }

    return <AdminProductEditClient product={product} initialCategories={categories || []} />;
}
