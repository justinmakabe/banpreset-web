import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import WishlistClient from './WishlistClient';

export default async function WishlistPage() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    const { data } = await supabase
        .from('wishlists')
        .select('product_id, products(*, categories(name))')
        .eq('user_id', user.id);

    // Extract products from the join
    interface WishlistItem {
        product_id: string;
        products: {
            id: string;
            name: string;
            price: number;
            image_url?: string | null;
            categories?: {
                name?: string;
            } | null;
        } | null;
    }

    const wishlistProducts = ((data as unknown as WishlistItem[]) || [])
        .filter((item): item is WishlistItem & { products: NonNullable<WishlistItem['products']> } =>
            item.products !== null
        )
        .map((item) => ({
            ...item.products,
            category: item.products.categories?.name || 'Digital Asset'
        }));

    return <WishlistClient initialProducts={wishlistProducts} />;
}
