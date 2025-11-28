import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                    Elevate Your <span className="text-gradient">Creative Workflow</span>
                </h1>
                <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                    Premium Presets, After Effects Plugins, and Premiere Pro tools designed to speed up your editing and enhance your visuals.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        href="/all-products"
                        className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center gap-2"
                    >
                        Browse Shop <ArrowRight size={20} />
                    </Link>
                    <Link
                        href="/bundles"
                        className="px-8 py-4 bg-surface border border-white/10 hover:border-white/30 text-white rounded-full font-bold transition-all"
                    >
                        View Bundles
                    </Link>
                </div>
            </div>
        </div>
    );
}
