import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from './CategoryFilter';
import ProductSort from './ProductSort';
import { Search, SlidersHorizontal } from 'lucide-react';

// Revalidate immediately to show new products
export const revalidate = 0;

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; minPrice?: string; maxPrice?: string; sort?: string; q?: string }>;
}) {
    const { category: categorySlug, minPrice, maxPrice, sort, q: searchQuery } = await searchParams;

    // 1. Fetch Categories
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    // 2. Build Product Query
    let query = supabase
        .from('products')
        .select('*, categories(*)')
        .order('created_at', { ascending: false }); // Default sort

    // Apply Category Filter
    let selectedCategoryName = 'All Products';
    if (categorySlug) {
        const { data: category } = await supabase
            .from('categories')
            .select('id, name')
            .eq('slug', categorySlug)
            .single();

        if (category) {
            query = query.eq('category_id', category.id);
            selectedCategoryName = category.name;
        }
    }

    // Apply Search Filter
    if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
    }

    // Apply Price Filter
    if (minPrice) query = query.gte('price', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));

    // Apply Sorting
    if (sort === 'price_asc') {
        query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false });
    } else if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
    }

    const { data: products } = await query;

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Sidebar: Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        {/* Search Box */}
                        <div className="bg-surface border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Search size={20} className="text-primary" /> Search
                            </h3>
                            <form action="/products" method="GET">
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={searchQuery}
                                    placeholder="Search products..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                />
                                {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                            </form>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-surface border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <SlidersHorizontal size={20} className="text-primary" /> Price Range
                            </h3>
                            <form action="/products" method="GET" className="space-y-4">
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        defaultValue={minPrice}
                                        placeholder="Min"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        defaultValue={maxPrice}
                                        placeholder="Max"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                                {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
                                <button type="submit" className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                                    Apply Filter
                                </button>
                            </form>
                        </div>

                        {/* Categories */}
                        <div className="bg-surface border border-white/10 rounded-2xl p-6">
                            <CategoryFilter categories={categories || []} />
                        </div>
                    </aside>

                    {/* Right Content: Products Grid */}
                    <div className="flex-1">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{selectedCategoryName}</h1>
                                <p className="text-gray-400">
                                    Showing {products?.length || 0} results
                                </p>
                            </div>

                            {/* Sort Dropdown */}
                            <ProductSort />
                        </div>

                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        title={product.name}
                                        category={product.categories?.name || 'Digital Asset'}
                                        price={product.price}
                                        salePrice={product.sale_price}
                                        rating={product.rating}
                                        reviewCount={product.review_count}
                                        image={product.image_url || 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-surface border border-white/5 rounded-2xl">
                                <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
                                <a href="/products" className="text-primary hover:underline mt-2 inline-block">
                                    Clear all filters
                                </a>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
