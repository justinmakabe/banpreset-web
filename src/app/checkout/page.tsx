'use client';

import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, finalTotal, clearCart, couponCode } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentCode, setPaymentCode] = useState('');
    const [bankInfo, setBankInfo] = useState<any>(null);

    // Redirect if cart is empty and not success
    useEffect(() => {
        if (cart.length === 0 && !success) {
            router.push('/cart');
        }
    }, [cart, success, router]);

    // Fetch Bank Info
    useEffect(() => {
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
        fetchBankInfo();
    }, []);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Please login to checkout');
                router.push('/login');
                return;
            }

            // Generate Payment Code (e.g., DH + Timestamp + Random)
            const code = `DH${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
            setPaymentCode(code);

            // Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: finalTotal,
                    status: 'pending',
                    payment_code: code
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create Order Items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Increment Coupon Usage
            if (couponCode) {
                await supabase.rpc('increment_coupon_usage', { coupon_code: couponCode });
            }

            // Success
            setSuccess(true);
            clearCart();
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert('Checkout failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                    Thank you for your purchase. Please complete the payment below to access your downloads.
                </p>

                {/* QR Code Section */}
                {bankInfo && bankInfo.accountNumber && (
                    <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 max-w-sm w-full mx-auto">
                        <h3 className="text-black font-bold text-xl mb-4 flex items-center justify-center gap-2">
                            <QrCode size={24} /> Scan to Pay
                        </h3>
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <img
                                src={`https://qr.sepay.vn/img?acc=${bankInfo.accountNumber}&bank=${bankInfo.bankName}&amount=${Math.round(finalTotal)}&des=${paymentCode}`}
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
                                <span className="font-bold text-green-600">${finalTotal}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-yellow-50 px-2 rounded">
                                <span className="text-gray-500">Content:</span>
                                <span className="font-bold text-red-600">{paymentCode}</span>
                            </div>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-4">
                            System will automatically confirm payment in seconds.
                        </p>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <Link
                        href="/orders"
                        className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all"
                    >
                        View My Orders
                    </Link>
                    <Link
                        href="/"
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 bg-surface border border-white/10 p-4 rounded-xl">
                            <div className="w-20 h-20 bg-black/50 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">{item.name}</h3>
                                <p className="text-primary font-bold mt-1">${item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Section */}
                <div className="bg-surface border border-white/10 p-6 rounded-2xl h-fit space-y-6">
                    <h2 className="text-xl font-bold text-white">Order Total</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                        </div>
                        {/* Discount display could go here */}
                        <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-white/10">
                            <span>Total</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" /> Processing...
                            </>
                        ) : (
                            'Place Order'
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-500">
                        By placing this order, you agree to our Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
}
