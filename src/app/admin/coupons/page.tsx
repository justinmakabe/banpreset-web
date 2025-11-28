'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function CouponsPage() {
    const supabase = createClient();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCoupon, setNewCoupon] = useState({ code: '', discount_percent: 10, usage_limit: 0 });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const { data } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        setCoupons(data || []);
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            const { error } = await supabase
                .from('coupons')
                .insert([{ ...newCoupon, code: newCoupon.code.toUpperCase() }]);

            if (error) throw error;

            setNewCoupon({ code: '', discount_percent: 10, usage_limit: 0 });
            fetchCoupons();
            alert('Coupon created successfully!');
        } catch (error: any) {
            alert('Error creating coupon: ' + error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;

        try {
            const { error } = await supabase.from('coupons').delete().eq('id', id);
            if (error) throw error;
            fetchCoupons();
        } catch (error: any) {
            alert('Error deleting coupon: ' + error.message);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Coupons</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-primary" /> Add New Coupon
                    </h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                            <input
                                type="text"
                                required
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors uppercase"
                                placeholder="e.g. SALE50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Discount (%)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="100"
                                value={newCoupon.discount_percent}
                                onChange={(e) => setNewCoupon({ ...newCoupon, discount_percent: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Usage Limit (0 = Unlimited)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={newCoupon.usage_limit}
                                onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                        >
                            {creating ? 'Creating...' : 'Create Coupon'}
                        </button>
                    </form>
                </div>

                {/* Coupons List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="text-white">Loading...</div>
                    ) : coupons.length === 0 ? (
                        <div className="text-gray-400">No coupons found.</div>
                    ) : (
                        coupons.map((coupon) => (
                            <div key={coupon.id} className="bg-surface border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                                        <Tag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{coupon.code}</h3>
                                        <p className="text-sm text-gray-400">{coupon.discount_percent}% Off</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Used: {coupon.used_count} / {coupon.usage_limit === 0 ? '∞' : coupon.usage_limit}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
