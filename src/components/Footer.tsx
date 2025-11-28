import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-white/5 pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-white mb-4 block">
                            BAN<span className="text-primary">PRESET</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm">
                            The ultimate resource for video editors and motion designers. High-quality presets and plugins to elevate your work.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Shop</h4>
                        <ul className="space-y-2">
                            <li><Link href="/presets" className="text-gray-400 hover:text-primary transition-colors">Presets</Link></li>
                            <li><Link href="/ae-plugins" className="text-gray-400 hover:text-primary transition-colors">After Effects</Link></li>
                            <li><Link href="/premiere-plugins" className="text-gray-400 hover:text-primary transition-colors">Premiere Pro</Link></li>
                            <li><Link href="/bundles" className="text-gray-400 hover:text-primary transition-colors">Bundles</Link></li>
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
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">YouTube</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
