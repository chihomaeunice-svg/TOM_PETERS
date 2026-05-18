import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, TrendingUp, Plus, Percent, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getSellerProducts, getSellerOrders, Product, Order } from '../../services/firestore';
import { ORDER_STATUS_BG } from '../../utils/orderStatus';

export default function SellerDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    activeProducts: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0,
    commissionOwed: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [bestSellers, setBestSellers] = useState<{ product: Product; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    Promise.all([
      getSellerProducts(profile.uid),
      getSellerOrders(profile.uid),
    ]).then(([products, orders]) => {
      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

      // Count orders per product
      const productOrderCount: Record<string, number> = {};
      orders.forEach(o => {
        o.items.forEach(item => {
          productOrderCount[item.productId] = (productOrderCount[item.productId] || 0) + item.qty;
        });
      });

      // Top 3 products
      const ranked = products
        .map(p => ({ product: p, count: productOrderCount[p.id!] || 0 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setStats({
        products: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        orders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        revenue,
        commissionOwed: revenue * 0.05,
      });
      setRecentOrders(orders.slice(0, 5));
      setBestSellers(ranked);
    }).finally(() => setLoading(false));
  }, [profile]);

  const statCards = [
    { label: 'Products Listed', value: stats.products, icon: Package, color: 'text-tp-gold' },
    { label: 'Active Products', value: stats.activeProducts, icon: Eye, color: 'text-blue-400' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-tp-sage' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: TrendingUp, color: 'text-tp-warning' },
    { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-tp-success' },
    { label: 'Commission Owed (5%)', value: `$${stats.commissionOwed.toFixed(2)}`, icon: Percent, color: 'text-tp-rose' },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-tp-charcoal">Recent Orders</h2>
            <Link to="/seller/orders" className="text-xs text-tp-gold hover:text-tp-gold-dark transition-colors tracking-wider uppercase">View All</Link>
          </div>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-tp-silk rounded h-10" />)}</div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-tp-taupe">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-tp-charcoal font-medium">{order.customerName}</p>
                    <p className="text-xs text-tp-taupe font-mono">#{order.id?.slice(-8)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${ORDER_STATUS_BG[order.status] || 'bg-tp-silk text-tp-taupe'}`}>
                      {order.status}
                    </span>
                    <span className="font-medium text-tp-charcoal">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Selling Products */}
        <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-tp-charcoal">Best Sellers</h2>
            <Link to="/seller/products" className="text-xs text-tp-gold hover:text-tp-gold-dark transition-colors tracking-wider uppercase">View All</Link>
          </div>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-tp-silk rounded h-12" />)}</div>
          ) : bestSellers.length === 0 ? (
            <p className="text-sm text-tp-taupe">No products listed yet.</p>
          ) : (
            <div className="space-y-3">
              {bestSellers.map(({ product, count }, i) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-tp-silk flex items-center justify-center text-xs font-display text-tp-taupe flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 bg-tp-silk rounded overflow-hidden flex-shrink-0">
                    {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-tp-charcoal font-medium truncate">{product.name}</p>
                    <p className="text-xs text-tp-taupe">${product.price.toFixed(2)}</p>
                  </div>
                  <span className="text-xs text-tp-taupe whitespace-nowrap">{count} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
            <p className="pt-2 text-xs text-tp-taupe border-t border-tp-border mt-2">
              Commission rate: <span className="text-tp-charcoal">5% of revenue</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
