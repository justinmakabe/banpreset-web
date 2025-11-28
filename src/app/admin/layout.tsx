import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Tag } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black flex pt-16">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-white/10 fixed top-16 h-[calc(100vh-4rem)] hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/admin" className="text-2xl font-bold tracking-tighter text-white">
                        BAN<span className="text-primary">ADMIN</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <ShoppingBag size={20} />
                        Products
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Users size={20} />
                        Users
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Tag size={20} />
                        Categories
                    </Link>
                    <Link href="/admin/coupons" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Tag size={20} />
                        Coupons
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <Settings size={20} />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <LogOut size={20} />
                        Exit Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
