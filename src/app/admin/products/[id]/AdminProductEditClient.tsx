'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface ProductDetail {
    id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string | null;
    download_url?: string | null;
    category_id?: string | null;
    attributes?: { name: string; value: string }[];
}

interface AdminProductEditClientProps {
    product: ProductDetail;
    initialCategories: Category[];
}

export default function AdminProductEditClient({ product, initialCategories }: AdminProductEditClientProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories] = useState<Category[]>(initialCategories);

    // Form State
    const [title, setTitle] = useState(product.name);
    const [description, setDescription] = useState(product.description || '');
    const [price, setPrice] = useState(product.price.toString());
    const [imageUrl, setImageUrl] = useState(product.image_url || '');
    const [downloadUrl, setDownloadUrl] = useState(product.download_url || '');
    const [selectedCategory, setSelectedCategory] = useState(product.category_id || '');
    const [attributes, setAttributes] = useState<{ name: string; value: string }[]>(product.attributes || []);

    const handleAddAttribute = () => {
        setAttributes([...attributes, { name: '', value: '' }]);
    };

    const handleRemoveAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const handleAttributeChange = (index: number, field: 'name' | 'value', value: string) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const handleSave = async () => {
        if (!title || !price) {
            alert('Please fill in at least Title and Price');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    name: title,
                    description,
                    price: parseFloat(price),
                    image_url: imageUrl,
                    download_url: downloadUrl || null,
                    category_id: selectedCategory || null,
                    attributes: attributes.filter(a => a.name && a.value)
                })
                .eq('id', product.id);

            if (error) throw error;

            alert('Product updated successfully!');
            router.push('/admin/products');
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            alert('Error updating product: ' + message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Edit Product</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Product Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors mb-6"
                            placeholder="e.g. Cinematic Luts Vol. 2"
                        />

                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            rows={10}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Product description..."
                        />
                    </div>

                    {/* Product Data */}
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Product Data</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Regular Price ($)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="29.99"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Attributes</h3>
                            <button
                                onClick={handleAddAttribute}
                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                            >
                                <Plus size={16} /> Add Attribute
                            </button>
                        </div>

                        {attributes.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">No attributes added yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {attributes.map((attr, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={attr.name}
                                            onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm"
                                            placeholder="Name (e.g. File Type)"
                                        />
                                        <input
                                            type="text"
                                            value={attr.value}
                                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-sm"
                                            placeholder="Value (e.g. .CUBE)"
                                        />
                                        <button
                                            onClick={() => handleRemoveAttribute(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Options */}
                <div className="space-y-6">
                    <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Publish</h3>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all mb-3 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Product'}
                        </button>
                    </div>

                    <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                        <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                            {categories.length === 0 ? (
                                <p className="text-gray-500 text-sm">No categories found.</p>
                            ) : (
                                categories.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat.id}
                                            checked={selectedCategory === cat.id}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-4 h-4 text-primary bg-black/50 border-white/20 focus:ring-primary"
                                        />
                                        <span className="text-gray-300 group-hover:text-white transition-colors text-sm">{cat.name}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Product Image URL</h3>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="https://..."
                        />
                        {imageUrl && (
                            <div className="mt-4 aspect-video relative rounded-lg overflow-hidden">
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="bg-surface border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Download Link</h3>
                        <p className="text-xs text-gray-400 mb-2">
                            External link where the user can download the product after purchase.
                        </p>
                        <input
                            type="text"
                            value={downloadUrl}
                            onChange={(e) => setDownloadUrl(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="https://drive.google.com/..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
