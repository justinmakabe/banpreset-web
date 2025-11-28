'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Package, Download, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login');
                    return;
                }

                const { data: ordersData, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            price,
                            products (
                                id,
                                name,
                                image_url
                            )
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(ordersData || []);
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">My Orders</h1>
                    <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium">
                        Continue Shopping
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Package size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                        <p className="text-gray-400 mb-6">You haven't purchased any products yet.</p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-white font-bold">Total: ${order.total_amount}</p>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.products?.id} className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-white/5 transition-colors">
                                            {/* Product Image */}
                                            <div className="w-full md:w-24 aspect-square rounded-lg overflow-hidden bg-black/50 relative flex-shrink-0">
                                                {item.products?.image_url ? (
                                                    <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 w-full text-center md:text-left">
                                                <h3 className="text-lg font-bold text-white mb-1">{item.products?.name || 'Unknown Product'}</h3>
                                                <p className="text-gray-400 text-sm">${item.price}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="w-full md:w-auto flex flex-col gap-2">
                                                <button className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all w-full md:w-auto text-sm">
                                                    <Download size={16} /> Download
                                                </button>
                                                <Link
                                                    href={`/product/${item.products?.id}`}
                                                    className="flex items-center justify-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all w-full md:w-auto text-sm"
                                                >
                                                    View Product
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
