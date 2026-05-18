import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, Order } from '../../services/firestore';
import { ORDER_STATUS_BG } from '../../utils/orderStatus';
import { Package } from 'lucide-react';

const ALL_STATUSES: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getAllOrders().then(setOrders).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id: string, status: Order['status']) => {
    setUpdating(id);
    await updateOrderStatus(id, status);
    setUpdating(null);
    load();
  };

  const displayed = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">All Orders</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-1.5 text-xs tracking-widest uppercase rounded transition-colors ${filter === 'all' ? 'bg-tp-charcoal text-white' : 'border border-tp-border text-tp-taupe hover:border-tp-gold'}`}>
          All ({orders.length})
        </button>
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 text-xs tracking-widest uppercase rounded capitalize transition-colors ${filter === s ? 'bg-tp-charcoal text-white' : 'border border-tp-border text-tp-taupe hover:border-tp-gold'}`}>
            {s} ({orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-24" />)}</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-white border border-tp-border rounded text-tp-taupe">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="bg-white border border-tp-border rounded overflow-hidden shadow-luxe">
          <table className="w-full text-sm">
            <thead className="bg-tp-silk border-b border-tp-border">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Update'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widests uppercase text-tp-taupe">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-tp-border">
              {displayed.map(order => (
                <tr key={order.id} className="hover:bg-tp-silk/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-tp-taupe">#{order.id?.slice(-8)}</td>
                  <td className="px-4 py-3">
                    <p className="text-tp-charcoal">{order.customerName}</p>
                    <p className="text-xs text-tp-taupe">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-tp-taupe">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 text-tp-charcoal font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${ORDER_STATUS_BG[order.status] || 'bg-tp-silk text-tp-taupe'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={order.status} disabled={updating === order.id}
                      onChange={e => handleStatusChange(order.id!, e.target.value as Order['status'])}
                      className="border border-tp-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-tp-gold bg-tp-cream disabled:opacity-50 capitalize">
                      {ALL_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
