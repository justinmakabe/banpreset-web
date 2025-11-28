'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Shield } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .order('updated_at', { ascending: false });

            setUsers(data || []);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Users</h1>
            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr className="text-gray-400 text-sm">
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-500">No users found.</td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {user.email?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.full_name || 'No Name'}</div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold flex items-center gap-1 w-fit ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                            {user.role === 'admin' && <Shield size={12} />}
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
