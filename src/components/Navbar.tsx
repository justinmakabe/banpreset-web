'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, LogOut, Settings, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const { cart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('[Navbar] Checking cookies:', document.cookie);
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[Navbar] getSession result:', { session, error });

        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setIsAdmin(profile?.role === 'admin');
        }
      } catch (err) {
        console.error('[Navbar] Session check failed:', err);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Navbar] Auth State Change:', event, session?.user?.id);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
              BAN<span className="text-primary">PRESET</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white hover:text-glow transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                All Products
              </Link>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <Link href="/cart" className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Auth Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1 rounded-full bg-surface border border-white/10 hover:border-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl py-1 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                      <p className="text-sm text-white font-medium truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="text-xs text-primary font-bold uppercase tracking-wider mt-1 block">Administrator</span>
                      )}
                    </div>

                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-primary/10 hover:bg-primary/20 border-b border-white/5 transition-colors relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all" />
                        <span className="relative flex items-center gap-2">
                          <Settings size={16} className="text-primary" /> Admin Dashboard
                        </span>
                      </Link>
                    )}

                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white mt-1">
                      <User size={16} /> Settings
                    </Link>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                      <Package size={16} /> My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Log In
                </Link>
                <Link href="/register" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-full transition-all">
                  Sign Up
                </Link>
              </div>
            )}

            <div className="md:hidden">
              <button className="p-2 text-gray-400 hover:text-white">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
