import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';
import SocialLinks from './SocialLinks';
import { createClient } from '@/utils/supabase/server';

export default async function Footer() {
    const supabase = await createClient();

    // Fetch social media links from settings
    const { data: socialSettings } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['social_facebook', 'social_instagram', 'social_twitter', 'social_youtube']);

    const socialLinks = {
        facebook: socialSettings?.find(s => s.key === 'social_facebook')?.value || '',
        instagram: socialSettings?.find(s => s.key === 'social_instagram')?.value || '',
        twitter: socialSettings?.find(s => s.key === 'social_twitter')?.value || '',
        youtube: socialSettings?.find(s => s.key === 'social_youtube')?.value || ''
    };

    return (
        <footer className="bg-surface border-t border-white/5 pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-white mb-4 block">
                            BAN<span className="text-primary">PRESET</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-6">
                            The ultimate resource for video editors and motion designers. High-quality presets and plugins to elevate your work.
                        </p>

                        {/* Newsletter Signup */}
                        <div className="mt-6">
                            <h4 className="text-white font-bold mb-3">Subscribe to Newsletter</h4>
                            <NewsletterSignup />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Shop</h4>
                        <ul className="space-y-2">
                            <li><Link href="/products" className="text-gray-400 hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/products?category=presets" className="text-gray-400 hover:text-primary transition-colors">Presets</Link></li>
                            <li><Link href="/products?category=plugins" className="text-gray-400 hover:text-primary transition-colors">Plugins</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/license" className="text-gray-400 hover:text-primary transition-colors">License</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} BanPreset. All rights reserved.
                    </p>
                    <SocialLinks {...socialLinks} />
                </div>
            </div>
        </footer>
    );
}
