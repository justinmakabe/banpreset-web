import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import WishlistClient from './WishlistClient';

export default async function WishlistPage() {
    const supabase = createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    const { data } = await supabase
        .from('wishlists')
        .select('product_id, products(*, categories(name))')
        .eq('user_id', user.id);

    // Extract products from the join
    const wishlistProducts = data?.map((item: any) => ({
        ...item.products,
        category: item.products.categories?.name || 'Digital Asset'
    })) || [];

    return <WishlistClient initialProducts={wishlistProducts} />;
}
