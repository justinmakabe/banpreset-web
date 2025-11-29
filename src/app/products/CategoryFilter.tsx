'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tag } from 'lucide-react';

interface Category { id: string; name: string; slug: string }
export default function CategoryFilter({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    const handleCategoryClick = (slug: string | null) => {
        if (slug) {
            router.push(`/products?category=${slug}`);
        } else {
            router.push('/products');
        }
    };

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Tag size={20} className="text-primary" /> Categories
            </h3>

            <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${!currentCategory
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
            >
                All Products
            </button>

            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm font-medium ${currentCategory === cat.slug
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
}
