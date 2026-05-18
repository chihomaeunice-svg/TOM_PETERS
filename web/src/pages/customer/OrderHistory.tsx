import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getCustomerOrders, Order } from '../../services/firestore';
import { ORDER_STATUS_BG } from '../../utils/orderStatus';

export default function OrderHistory() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    getCustomerOrders(profile.uid).then(setOrders).finally(() => setLoading(false));
  }, [profile]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-tp-silk rounded h-28" />
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <Package size={48} className="mx-auto mb-4 text-tp-beige" />
          <h2 className="font-display text-2xl text-tp-charcoal mb-3">No Orders Yet</h2>
          <p className="text-tp-taupe">Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-tp-border rounded p-6 shadow-luxe">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-tp-taupe mb-1">Order ID</p>
                  <p className="font-mono text-sm text-tp-charcoal">{order.id}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${ORDER_STATUS_BG[order.status] || 'bg-tp-silk text-tp-taupe'}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-tp-charcoal">{item.name} × {item.qty} ({item.size})</span>
                    <span className="text-tp-taupe">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-tp-border pt-3 flex justify-between">
                <span className="text-sm text-tp-taupe">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </span>
                <span className="font-medium text-tp-charcoal">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
