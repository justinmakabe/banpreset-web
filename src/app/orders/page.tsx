'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Package, Download, Clock, QrCode, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/format';

export default function OrdersPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [bankInfo, setBankInfo] = useState<any>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [canceling, setCanceling] = useState<string | null>(null);

    useEffect(() => {
        getOrders();
        fetchBankInfo();
    }, [router]);

    const fetchBankInfo = async () => {
        const { data } = await supabase
            .from('settings')
            .select('*')
            .in('key', ['bank_account_number', 'bank_name', 'bank_account_name']);

        if (data) {
            const info: any = {};
            data.forEach(item => {
                if (item.key === 'bank_account_number') info.accountNumber = item.value;
                if (item.key === 'bank_name') info.bankName = item.value;
                if (item.key === 'bank_account_name') info.accountName = item.value;
            });
            setBankInfo(info);
        }
    };

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
                            image_url,
                            download_url
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

    const handleViewPayment = (order: any) => {
        setSelectedOrder(order);
        setShowPaymentModal(true);
    };

    const handleCancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        setCanceling(orderId);
        try {
            const { data, error } = await supabase.rpc('cancel_order', {
                p_order_id: orderId
            });

            if (error) throw error;

            if (data && !data.success) {
                alert(data.error || 'Failed to cancel order');
                return;
            }

            alert('Order canceled successfully');
            // Refresh orders list
            await getOrders();
        } catch (error: any) {
            console.error('Error canceling order:', error);
            alert('Failed to cancel order: ' + error.message);
        } finally {
            setCanceling(null);
        }
    };

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
                                        <span className="text-gray-500 text-xs">#{order.order_code}</span>
                                    </div>
                                    <p className="text-white font-bold">Total: {formatCurrency(order.total_amount)}</p>
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
                                                <p className="text-gray-400 text-sm">{formatCurrency(item.price)}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="w-full md:w-auto flex flex-col gap-2">
                                                {order.status === 'completed' ? (
                                                    <>
                                                        {item.products?.download_url ? (
                                                            <a
                                                                href={item.products.download_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all w-full md:w-auto text-sm"
                                                            >
                                                                <Download size={16} /> Download
                                                            </a>
                                                        ) : (
                                                            <button disabled className="flex items-center justify-center gap-2 px-6 py-2 bg-white/5 text-gray-500 font-bold rounded-lg w-full md:w-auto text-sm cursor-not-allowed">
                                                                <Download size={16} /> No Link
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleViewPayment(order)}
                                                            className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all w-full md:w-auto text-sm"
                                                        >
                                                            <QrCode size={16} /> View QR
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            disabled={canceling === order.id}
                                                            className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all w-full md:w-auto text-sm disabled:opacity-50"
                                                        >
                                                            <Trash2 size={16} /> {canceling === order.id ? 'Canceling...' : 'Cancel Order'}
                                                        </button>
                                                    </>
                                                )}
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

            {/* Payment Modal */}
            {showPaymentModal && selectedOrder && bankInfo && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-6">
                            <h3 className="text-black font-bold text-xl mb-4 flex items-center justify-center gap-2">
                                <QrCode size={24} /> Scan to Pay
                            </h3>
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                                <img
                                    src={`https://qr.sepay.vn/img?acc=${bankInfo.accountNumber}&bank=${bankInfo.bankName}&amount=${Math.round(selectedOrder.total_amount)}&des=DH${selectedOrder.order_code}`}
                                    alt="VietQR"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="text-left space-y-2 text-sm text-gray-800">
                                <div className="flex justify-between border-b border-gray-200 py-2">
                                    <span className="text-gray-500">Bank:</span>
                                    <span className="font-bold">{bankInfo.bankName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 py-2">
                                    <span className="text-gray-500">Account No:</span>
                                    <span className="font-bold">{bankInfo.accountNumber}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 py-2">
                                    <span className="text-gray-500">Account Name:</span>
                                    <span className="font-bold">{bankInfo.accountName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 py-2">
                                    <span className="text-gray-500">Amount:</span>
                                    <span className="font-bold text-green-600">{formatCurrency(selectedOrder.total_amount)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-yellow-50 px-2 rounded">
                                    <span className="text-gray-500">Content:</span>
                                    <span className="font-bold text-red-600">DH{selectedOrder.order_code}</span>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-4">
                                System will automatically confirm payment in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
