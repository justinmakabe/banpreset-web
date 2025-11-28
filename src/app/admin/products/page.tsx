'use client';

import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    categories (
                        name
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) {
                if (error.code === '23503') { // Foreign key violation
                    alert('Cannot delete this product because it has associated orders. Consider archiving it instead (feature coming soon).');
                } else {
                    throw error;
                }
                return;
            }

            fetchProducts(); // Refresh list
            alert('Product deleted successfully');
        } catch (error: any) {
            console.error('Delete error:', error);
            alert('Error deleting product: ' + error.message);
        }
    };

    if (loading) {
        return <div className="text-white">Loading products...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add New Product
                </Link>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5">
                        <tr className="text-gray-400 text-sm">
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            {product.image_url && (
                                                <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover bg-black/50" />
                                            )}
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs uppercase tracking-wider">
                                            {product.categories?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="p-4">${product.price}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
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
