import { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { getPlatformStats } from '../../services/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalSellers: 0, totalProducts: 0,
    totalOrders: 0, totalRevenue: 0, pendingInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Customers', value: stats.totalUsers, icon: Users, color: 'text-tp-gold' },
    { label: 'Sellers', value: stats.totalSellers, icon: TrendingUp, color: 'text-tp-sage' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-blue-400' },
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-tp-warning' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-tp-success' },
    { label: 'Pending Applications', value: stats.pendingInquiries, icon: Clock, color: 'text-tp-rose' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Admin Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map(card => (
            <div key={card.label} className="bg-white border border-tp-border rounded p-5 shadow-luxe">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs tracking-widest uppercase text-tp-taupe">{card.label}</span>
                <card.icon size={18} className={card.color} />
              </div>
              <p className="text-2xl font-display text-tp-charcoal">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
        <h2 className="font-display text-lg text-tp-charcoal mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-tp-taupe">
          <div>
            <p className="font-medium text-tp-charcoal mb-1">Marketplace Health</p>
            <p>Platform is operating normally. All services active.</p>
          </div>
          <div>
            <p className="font-medium text-tp-charcoal mb-1">Seller Applications</p>
            <p>{stats.pendingInquiries} application{stats.pendingInquiries !== 1 ? 's' : ''} awaiting review.</p>
          </div>
          <div>
            <p className="font-medium text-tp-charcoal mb-1">Revenue</p>
            <p>Total platform revenue: <span className="text-tp-success font-medium">${stats.totalRevenue.toFixed(2)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
