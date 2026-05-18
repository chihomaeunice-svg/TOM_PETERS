import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getSellerProducts, getSellerOrders } from '../../services/firestore';

export default function SellerDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    Promise.all([
      getSellerProducts(profile.uid),
      getSellerOrders(profile.uid),
    ]).then(([products, orders]) => {
      setStats({
        products: products.length,
        orders: orders.length,
        revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length,
      });
    }).finally(() => setLoading(false));
  }, [profile]);

  const statCards = [
    { label: 'Products Listed', value: stats.products, icon: Package, color: 'text-tp-gold' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-tp-sage' },
    { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-tp-success' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: TrendingUp, color: 'text-tp-warning' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-tp-charcoal">Dashboard</h1>
          <p className="text-tp-taupe mt-1">Welcome back, {profile?.displayName}</p>
        </div>
        <Link to="/seller/products/new"
          className="flex items-center gap-2 bg-tp-charcoal text-tp-cream px-5 py-2.5 text-sm tracking-wider uppercase hover:opacity-80 transition-opacity">
          <Plus size={16} /> New Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
          <h2 className="font-display text-lg text-tp-charcoal mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/seller/products/new" className="flex items-center gap-3 p-3 border border-tp-border rounded hover:border-tp-gold hover:bg-tp-silk transition-colors text-sm text-tp-charcoal">
              <Plus size={16} className="text-tp-gold" /> Add New Product
            </Link>
            <Link to="/seller/products" className="flex items-center gap-3 p-3 border border-tp-border rounded hover:border-tp-gold hover:bg-tp-silk transition-colors text-sm text-tp-charcoal">
              <Package size={16} className="text-tp-gold" /> Manage Products
            </Link>
            <Link to="/seller/orders" className="flex items-center gap-3 p-3 border border-tp-border rounded hover:border-tp-gold hover:bg-tp-silk transition-colors text-sm text-tp-charcoal">
              <ShoppingCart size={16} className="text-tp-gold" /> View Orders
            </Link>
          </div>
        </div>

        <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
          <h2 className="font-display text-lg text-tp-charcoal mb-4">Your Plan</h2>
          <div className="text-sm text-tp-taupe space-y-2">
            <p>Plan: <span className="text-tp-charcoal capitalize">{profile?.subscriptionPlan || 'Basic'}</span></p>
            <p>Status: <span className="text-tp-success capitalize">{profile?.subscriptionStatus || 'Active'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
