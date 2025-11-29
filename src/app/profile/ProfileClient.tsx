'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Mail, Shield, Save } from 'lucide-react';

interface ProfileClientProps {
    user: any;
    initialProfile: {
        full_name: string;
        avatar_url: string;
    };
}

export default function ProfileClient({ user, initialProfile }: ProfileClientProps) {
    const supabase = createClient();
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState(initialProfile.full_name);
    const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error: any) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

                <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/50">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{user?.email}</h3>
                            <p className="text-gray-400 text-sm">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <div className="flex items-center gap-2">
                                    <User size={16} /> Full Name
                                </div>
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </div>
                            </label>
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-lg text-gray-400 cursor-not-allowed"
                            />
                            <p className="mt-2 text-xs text-gray-500">Email address cannot be changed.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} /> Avatar URL
                                </div>
                            </label>
                            <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
