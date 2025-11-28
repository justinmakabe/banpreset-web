import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Check, ShoppingCart, ShieldCheck, Zap } from 'lucide-react';
import ReviewSection from '@/components/ReviewSection';
import { formatCurrency } from '@/utils/format';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) {
        notFound();
    }

    // Mock features for now as it's not in the DB schema yet, or we could store it as JSONB
    const features = ['Instant Download', 'High Quality', '24/7 Support', 'Lifetime Access'];

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column: Image */}
                    <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <Image
                            src={product.image_url || 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent pointer-events-none" />
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase mb-4">
                                Digital Asset
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-bold text-white mb-6">
                                {formatCurrency(product.price)}
                            </p>
                            <p className="text-lg text-gray-400 leading-relaxed mb-8">
                                {product.description}
                            </p>
                        </div>

                        <div className="space-y-6 mb-10">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-gray-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button className="flex-1 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2">
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <button className="px-8 py-4 bg-surface border border-white/10 hover:bg-white/5 text-white rounded-xl font-bold text-lg transition-all">
                                Live Demo
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Zap size={20} className="text-yellow-500" />
                                <span className="text-sm">Instant Download</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <ShieldCheck size={20} className="text-green-500" />
                                <span className="text-sm">Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Section */}
                <ReviewSection productId={product.id} />
            </div>
        </div>
    );
}
