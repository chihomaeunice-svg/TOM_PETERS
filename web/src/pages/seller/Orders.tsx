import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getSellerOrders, updateOrderStatus, Order } from '../../services/firestore';
import { ORDER_STATUS_BG } from '../../utils/orderStatus';
import { Package } from 'lucide-react';

const STATUS_TRANSITIONS: Record<Order['status'], Order['status'][]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export default function SellerOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    if (!profile) return;
    setLoading(true);
    getSellerOrders(profile.uid).then(setOrders).finally(() => setLoading(false));
  };

  useEffect(load, [profile]);

  const handleStatusChange = async (id: string, status: Order['status']) => {
    setUpdating(id);
    await updateOrderStatus(id, status);
    setUpdating(null);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Orders</h1>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-24" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-tp-border rounded">
          <Package size={48} className="mx-auto mb-4 text-tp-beige" />
          <p className="text-tp-taupe">No orders yet. They'll appear here when customers purchase your products.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const nextStatuses = STATUS_TRANSITIONS[order.status];
            return (
              <div key={order.id} className="bg-white border border-tp-border rounded p-6 shadow-luxe">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs text-tp-taupe mb-1">#{order.id?.slice(-8)}</p>
                    <p className="font-medium text-tp-charcoal">{order.customerName}</p>
                    <p className="text-xs text-tp-taupe">{order.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${ORDER_STATUS_BG[order.status] || 'bg-tp-silk text-tp-taupe'}`}>
                      {order.status}
                    </span>
                    <p className="font-display text-lg text-tp-charcoal mt-2">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-tp-border pt-3 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-tp-charcoal">{item.name} × {item.qty} ({item.size})</span>
                      <span className="text-tp-taupe">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-tp-taupe mr-auto">
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </span>
                  {nextStatuses.map(status => (
                    <button key={status}
                      disabled={updating === order.id}
                      onClick={() => handleStatusChange(order.id!, status)}
                      className="px-3 py-1.5 text-xs tracking-wider uppercase border border-tp-border rounded hover:bg-tp-charcoal hover:text-white hover:border-tp-charcoal transition-colors disabled:opacity-50 capitalize">
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
