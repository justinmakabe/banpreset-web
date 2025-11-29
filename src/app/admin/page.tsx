import { createClient } from '@/utils/supabase/server';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // 1. Revenue & Orders
    const { data: orders } = await supabase.from('orders').select('total_amount');
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const totalOrders = orders?.length || 0;

    // 2. Products
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

    // 3. Users (Profiles)
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    const stats = {
        revenue: totalRevenue,
        orders: totalOrders,
        products: productsCount || 0,
        users: usersCount || 0
    };

    // 4. Recent Activity
    const { data: recent } = await supabase
        .from('orders')
        .select(`
            *,
            profiles (email),
            order_items (
                products (name)
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    const recentActivity = recent || [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue.toFixed(2)}`}
                    icon={<DollarSign size={24} className="text-green-400" />}
                    trend="+12.5%"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders.toString()}
                    icon={<ShoppingBag size={24} className="text-blue-400" />}
                    trend="+5.2%"
                />
                <StatCard
                    title="Active Products"
                    value={stats.products.toString()}
                    icon={<TrendingUp size={24} className="text-purple-400" />}
                    trend="+2"
                />
                <StatCard
                    title="Total Users"
                    value={stats.users.toString()}
                    icon={<Users size={24} className="text-orange-400" />}
                    trend="+8.1%"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                {recentActivity.length === 0 ? (
                    <p className="text-gray-400">No recent activity to show.</p>
                ) : (
                    <div className="space-y-4">
                        {recentActivity.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {order.profiles?.email?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">
                                            {order.profiles?.email || 'Unknown User'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Purchased {order.order_items?.length || 0} items
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold">${order.total_amount}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-surface border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl">
                    {icon}
                </div>
                <span className="text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded-lg">
                    {trend}
                </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    );
}
