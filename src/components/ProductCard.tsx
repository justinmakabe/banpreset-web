'use client';

import { ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProductCardProps {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
}

export default function ProductCard({ id, title, category, price, image }: ProductCardProps) {
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkUserAndWishlist();
    }, [id]);

    const checkUserAndWishlist = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
            const { data } = await supabase
                .from('wishlists')
                .select('*')
                .eq('user_id', user.id)
                .eq('product_id', id)
                .single();

            if (data) setIsWishlisted(true);
        }
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in to add to wishlist');
            return;
        }

        if (isWishlisted) {
            await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', id);
            setIsWishlisted(false);
        } else {
            await supabase.from('wishlists').insert({ user_id: user.id, product_id: id });
            setIsWishlisted(true);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({ id, name: title, price, image_url: image });
        alert('Added to cart!');
    };

    return (
        <Link href={`/product/${id}`} className="group relative block">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface border border-white/10 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="p-3 bg-white text-black rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        onClick={toggleWishlist}
                        className={`p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-red-500 hover:text-white'
                            }`}
                    >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Category Tag */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                        {category}
                    </span>
                </div>
            </div>

            <div className="mt-4 space-y-1">
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                    {title}
                </h3>
                <p className="text-gray-400 font-medium">{formatCurrency(price)}</p>
            </div>
        </Link>
    );
}
