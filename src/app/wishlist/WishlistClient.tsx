'use client';

import ProductCard from '@/components/ProductCard';
import { Heart } from 'lucide-react';

interface WishlistClientProps {
    initialProducts: any[];
}

export default function WishlistClient({ initialProducts }: WishlistClientProps) {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Heart className="text-red-500" fill="currentColor" /> My Wishlist
                </h1>

                {initialProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {initialProducts.map((product) => (
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
