import { PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;

    // Normalize category for comparison (though URL should be lowercase already)
    const slug = category.toLowerCase();

    let products = [];
    let title = '';

    if (slug === 'all-products') {
        products = PRODUCTS;
        title = 'All Products';
    } else {
        // Check if any product exists in this category
        products = PRODUCTS.filter((p) => p.category === slug);

        if (products.length === 0) {
            // If no products found and it's not a known static page, 404
            // Note: This might catch other routes if not careful, but Next.js prioritizes static routes (like /contact) over dynamic ones.
            // However, we should be careful.
            // For this demo, let's assume valid categories are what we have.
            const validCategories = ['presets', 'ae-plugins', 'premiere-plugins'];
            if (!validCategories.includes(slug)) {
                notFound();
            }
        }

        // Format title: "ae-plugins" -> "Ae Plugins"
        title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        // Special case adjustments
        if (slug === 'ae-plugins') title = 'After Effects Plugins';
        if (slug === 'premiere-plugins') title = 'Premiere Pro Plugins';
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                        {title}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Explore our collection of high-quality tools designed to elevate your creative workflow.
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
