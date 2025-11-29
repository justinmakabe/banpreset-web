'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminCategoriesClientProps {
    initialCategories: any[];
}

export default function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
    const supabase = createClient();
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>(initialCategories);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
    const [creating, setCreating] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            // Auto-generate slug if empty
            const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const { error } = await supabase
                .from('categories')
                .insert([{ ...newCategory, slug }]);

            if (error) throw error;

            setNewCategory({ name: '', slug: '', description: '' });
            alert('Category created successfully!');
            router.refresh(); // Refresh server data

            // Optimistic update (optional, but good for UX)
            // For now, we rely on router.refresh() but we can also re-fetch client side if needed
            // or just wait for the refresh to propagate.
            // To make it instant, we'd need to fetch or add to state manually.
            // Let's just re-fetch the list manually to be safe and consistent with previous behavior
            const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
            if (data) setCategories(data);

        } catch (error: any) {
            alert('Error creating category: ' + error.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) {
                if (error.code === '23503') {
                    alert('Cannot delete this category because it is assigned to one or more products.');
                } else {
                    throw error;
                }
                return;
            }

            // Refresh list
            const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
            if (data) setCategories(data);
            router.refresh();

        } catch (error: any) {
            console.error('Delete error:', error);
            alert('Error deleting category: ' + error.message);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Categories</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-surface border border-white/10 rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-primary" /> Add New Category
                    </h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                            <input
                                type="text"
                                required
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. Presets"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                            <input
                                type="text"
                                value={newCategory.slug}
                                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="e.g. presets (optional)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                            <textarea
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                                placeholder="Category description..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                        >
                            {creating ? 'Creating...' : 'Create Category'}
                        </button>
                    </form>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2 space-y-4">
                    {categories.length === 0 ? (
                        <div className="text-gray-400">No categories found.</div>
                    ) : (
                        categories.map((category) => (
                            <div key={category.id} className="bg-surface border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <Tag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                                        <p className="text-sm text-gray-400">/{category.slug}</p>
                                        {category.description && (
                                            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(category.id)}
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
