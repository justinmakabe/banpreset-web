'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
            const { data } = await supabase
                .from('wishlists')
                .select('product_id, products(*, categories(name))')
                .eq('user_id', user.id);

            // Extract products from the join
            const wishlistProducts = data?.map((item: any) => ({
                ...item.products,
                category: item.products.categories?.name || 'Digital Asset'
            })) || [];

            setProducts(wishlistProducts);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 px-4 flex justify-center">
                <p className="text-white">Loading wishlist...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-center">
                <Heart size={64} className="text-gray-600 mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">Your Wishlist is Empty</h1>
                <p className="text-gray-400 mb-8">Please log in to view your wishlist.</p>
                <a href="/login" className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors">
                    Log In
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Heart className="text-red-500" fill="currentColor" /> My Wishlist
                </h1>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.name}
                                category={product.category}
                                price={product.price}
                                image={product.image_url || 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80'}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface border border-white/5 rounded-2xl">
                        <p className="text-gray-400 text-lg">You haven't saved any items yet.</p>
                        <a href="/products" className="text-primary hover:underline mt-2 inline-block">
                            Browse Products
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
