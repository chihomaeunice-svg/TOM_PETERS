import { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, Clock, TrendingUp, Percent } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getPlatformStats, getAllOrders, Order } from '../../services/firestore';
import { COLLECTIONS } from '../../utils/collections';
import { ORDER_STATUS_BG } from '../../utils/orderStatus';

interface SellerStats {
  uid: string;
  displayName: string;
  businessName?: string;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalSellers: 0, totalProducts: 0,
    totalOrders: 0, totalRevenue: 0, pendingInquiries: 0,
  });
  const [topSellers, setTopSellers] = useState<SellerStats[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [platformStats, orders, sellersSnap] = await Promise.all([
        getPlatformStats(),
        getAllOrders(),
        getDocs(query(collection(db, COLLECTIONS.USERS), where('role', '==', 'seller'))),
      ]);

      setStats(platformStats);
      setRecentOrders(orders.slice(0, 10));

      // Compute per-seller revenue
      const sellerMap: Record<string, SellerStats> = {};
      sellersSnap.docs.forEach(d => {
        const s = d.data();
        sellerMap[s.uid] = { uid: s.uid, displayName: s.displayName, businessName: s.businessName, revenue: 0 };
      });
      orders.forEach(o => {
        if (sellerMap[o.sellerId]) {
          sellerMap[o.sellerId].revenue += o.total || 0;
        }
      });

      const sorted = Object.values(sellerMap)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      setTopSellers(sorted);
      setLoading(false);
    };
    load();
  }, []);

  const commission = stats.totalRevenue * 0.05;

  const statCards = [
    { label: 'Customers', value: stats.totalUsers, icon: Users, color: 'text-tp-gold' },
    { label: 'Sellers', value: stats.totalSellers, icon: TrendingUp, color: 'text-tp-sage' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-blue-400' },
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-tp-warning' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-tp-success' },
    { label: 'Commission (5%)', value: `$${commission.toFixed(0)}`, icon: Percent, color: 'text-tp-rose' },
    { label: 'Pending Applications', value: stats.pendingInquiries, icon: Clock, color: 'text-tp-taupe' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Admin Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 7 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-28" />)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Sellers */}
        <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
          <h2 className="font-display text-lg text-tp-charcoal mb-4">Top Sellers by Revenue</h2>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-tp-silk rounded h-10" />)}</div>
          ) : topSellers.length === 0 ? (
            <p className="text-sm text-tp-taupe">No seller data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-tp-border">
                  <th className="text-left py-2 text-xs tracking-widest uppercase text-tp-taupe">Seller</th>
                  <th className="text-right py-2 text-xs tracking-widest uppercase text-tp-taupe">Revenue</th>
                  <th className="text-right py-2 text-xs tracking-widest uppercase text-tp-taupe">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tp-border">
                {topSellers.map((s, i) => (
                  <tr key={s.uid}>
                    <td className="py-2.5">
                      <span className="text-xs text-tp-taupe mr-2">#{i + 1}</span>
                      <span className="text-tp-charcoal font-medium">{s.businessName || s.displayName}</span>
                    </td>
                    <td className="py-2.5 text-right text-tp-success font-medium">${s.revenue.toFixed(2)}</td>
                    <td className="py-2.5 text-right text-tp-taupe">${(s.revenue * 0.05).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Platform overview */}
        <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
          <h2 className="font-display text-lg text-tp-charcoal mb-4">Platform Overview</h2>
          <div className="space-y-4 text-sm text-tp-taupe">
            <div>
              <p className="font-medium text-tp-charcoal mb-1">Marketplace Health</p>
              <p>Platform is operating normally. All services active.</p>
            </div>
            <div>
              <p className="font-medium text-tp-charcoal mb-1">Seller Applications</p>
              <p>{stats.pendingInquiries} application{stats.pendingInquiries !== 1 ? 's' : ''} awaiting review.</p>
            </div>
            <div>
              <p className="font-medium text-tp-charcoal mb-1">Revenue & Commission</p>
              <p>Total revenue: <span className="text-tp-success font-medium">${stats.totalRevenue.toFixed(2)}</span></p>
              <p>Commission earned (5%): <span className="text-tp-gold-dark font-medium">${commission.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-tp-border rounded p-6 shadow-luxe">
        <h2 className="font-display text-lg text-tp-charcoal mb-4">Recent Orders</h2>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-tp-silk rounded h-12" />)}</div>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-tp-taupe">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-tp-border">
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left py-2 px-2 text-xs tracking-widest uppercase text-tp-taupe">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-tp-border">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-tp-silk/30 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-xs text-tp-taupe">{order.id?.slice(-8)}</td>
                  <td className="py-2.5 px-2 text-tp-charcoal">{order.customerName}</td>
                  <td className="py-2.5 px-2 font-medium text-tp-charcoal">${order.total.toFixed(2)}</td>
                  <td className="py-2.5 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${ORDER_STATUS_BG[order.status] || 'bg-tp-silk text-tp-taupe'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-tp-taupe text-xs">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
