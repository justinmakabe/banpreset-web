'use client';

import { useCart } from '@/context/CartContext';
import { Trash2, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { formatCurrency } from '@/utils/format';

export default function CartPage() {
    const supabase = createClient();
    const { cart, removeItem, total, discount, finalTotal, applyCoupon, couponCode } = useCart();
    const [inputCode, setInputCode] = useState('');
    const [checking, setChecking] = useState(false);

    const handleApplyCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputCode) return;
        setChecking(true);

        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', inputCode.toUpperCase())
                .single();

            if (error || !data) {
                alert('Invalid coupon code');
                return;
            }

            if (data.usage_limit > 0 && data.used_count >= data.usage_limit) {
                alert('This coupon has reached its usage limit');
                return;
            }

            applyCoupon(data.code, data.discount_percent);
            alert(`Coupon applied! ${data.discount_percent}% off.`);
        } catch (error) {
            alert('Error checking coupon');
        } finally {
            setChecking(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
                <p className="text-gray-400 mb-8">Looks like you haven't added any presets yet.</p>
                <Link href="/products" className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-surface border border-white/10 rounded-xl">
                                <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-white font-bold">{item.name}</h3>
                                        <p className="text-primary font-medium">{formatCurrency(item.price)}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="self-start text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({couponCode})</span>
                                        <span>-{discount}% (-{formatCurrency(total * discount / 100)})</span>
                                    </div>
                                )}
                                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>

                            {/* Coupon Input */}
                            <form onSubmit={handleApplyCoupon} className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputCode}
                                        onChange={(e) => setInputCode(e.target.value)}
                                        placeholder="Coupon Code"
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary uppercase"
                                    />
                                    <button
                                        type="submit"
                                        disabled={checking}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <Tag size={18} />
                                    </button>
                                </div>
                            </form>

                            <Link
                                href="/checkout"
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                Checkout <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
