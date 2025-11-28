'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductSort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        router.push(`/products?${params.toString()}`);
    };

    return (
        <select
            value={currentSort}
            onChange={handleSortChange}
            className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-primary cursor-pointer"
        >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
        </select>
    );
}
