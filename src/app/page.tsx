import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

// Revalidate immediately
export const revalidate = 0;

async function getFeaturedProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(4)
    .order('created_at', { ascending: false });

  return products || [];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-20">
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white">Featured <span className="text-gradient">Products</span></h2>
          <a href="/all-products" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            View All &rarr;
          </a>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                category="Digital Asset" // You might want to add a category column to your DB
                price={product.price}
                image={product.image_url || 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No products found. Add some in the Admin Dashboard.</p>
          </div>
        )}
      </section>

      <section className="bg-surface/50 py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Why Choose BanPreset?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Download</h3>
              <p className="text-gray-400">Get access to your files immediately after purchase. No waiting.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-secondary">
                💎
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-400">Curated by professional editors for professional results.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4 text-accent">
                🔒
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure Payment</h3>
              <p className="text-gray-400">Your transactions are protected with industry-standard security.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
