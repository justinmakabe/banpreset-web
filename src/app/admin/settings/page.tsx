'use client';

import Link from 'next/link';
import { Settings, User, Shield, Database, ExternalLink, Save, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
    const supabase = createClient();
    const [bankInfo, setBankInfo] = useState({
        accountNumber: '',
        bankName: '', // Bin
        accountName: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await supabase
                .from('settings')
                .select('*')
                .in('key', ['bank_account_number', 'bank_name', 'bank_account_name']);

            if (data) {
                const newInfo = { ...bankInfo };
                data.forEach(item => {
                    if (item.key === 'bank_account_number') newInfo.accountNumber = item.value;
                    if (item.key === 'bank_name') newInfo.bankName = item.value;
                    if (item.key === 'bank_account_name') newInfo.accountName = item.value;
                });
                setBankInfo(newInfo);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBankInfo = async () => {
        setSaving(true);
        try {
            const updates = [
                { key: 'bank_account_number', value: bankInfo.accountNumber },
                { key: 'bank_name', value: bankInfo.bankName },
                { key: 'bank_account_name', value: bankInfo.accountName }
            ];

            const { error } = await supabase
                .from('settings')
                .upsert(updates);

            if (error) throw error;
            alert('Bank information saved successfully!');
        } catch (error: any) {
            alert('Error saving settings: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Loading settings...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bank Information */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6 md:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <CreditCard size={20} className="text-primary" /> Bank Information (Sepay VietQR)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bank Name (Bin)</label>
                            <input
                                type="text"
                                value={bankInfo.bankName}
                                onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. MBBank"
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter Bank Bin or Name (e.g. MB, VCB)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Account Number</label>
                            <input
                                type="text"
                                value={bankInfo.accountNumber}
                                onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. 000011112222"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Account Name</label>
                            <input
                                type="text"
                                value={bankInfo.accountName}
                                onChange={(e) => setBankInfo({ ...bankInfo, accountName: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. NGUYEN VAN A"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveBankInfo}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Bank Info'}
                        </button>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Database size={20} className="text-primary" /> System Information
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400">App Version</span>
                            <span className="text-white font-medium">1.0.0</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400">Framework</span>
                            <span className="text-white font-medium">Next.js 15</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400">Database</span>
                            <span className="text-white font-medium">Supabase (PostgreSQL)</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400">Environment</span>
                            <span className="text-white font-medium">Production</span>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <User size={20} className="text-primary" /> Account
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Manage your admin profile, change your avatar, or update your name.
                    </p>
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                    >
                        Go to Profile Settings <ExternalLink size={16} />
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6 md:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-primary" /> Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link href="/admin/products/new" className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group">
                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">Add Product</h3>
                            <p className="text-sm text-gray-400 mt-1">Create a new digital asset</p>
                        </Link>
                        <Link href="/admin/categories" className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group">
                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">Manage Categories</h3>
                            <p className="text-sm text-gray-400 mt-1">Organize your products</p>
                        </Link>
                        <Link href="/admin/coupons" className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group">
                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">Create Coupon</h3>
                            <p className="text-sm text-gray-400 mt-1">Run a promotion</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
