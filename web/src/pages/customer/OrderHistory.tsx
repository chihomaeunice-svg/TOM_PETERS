import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { getCustomerOrders, Order } from '../../services/firestore';

const TIMELINE_STEPS: { status: Order['status']; label: string }[] = [
  { status: 'pending', label: 'Placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
];

const STATUS_ORDER: Record<Order['status'], number> = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

function OrderTimeline({ status }: { status: Order['status'] }) {
  const isCancelled = status === 'cancelled';
  const currentIndex = STATUS_ORDER[status];

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-4 mb-2">
        <div className="w-full h-1 bg-tp-error/20 rounded-full relative">
          <div className="absolute inset-0 w-full h-full bg-tp-error/30 rounded-full" />
        </div>
        <span className="text-xs text-tp-error whitespace-nowrap font-medium">Cancelled</span>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-2">
      <div className="relative flex items-start">
        {/* Connecting line */}
        <div className="absolute top-3 left-3 right-3 h-px bg-tp-border z-0" />
        <div
          className="absolute top-3 left-3 h-px bg-tp-gold z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (TIMELINE_STEPS.length - 1)) * (100 - 0)}%`, maxWidth: 'calc(100% - 24px)' }}
        />
        {TIMELINE_STEPS.map((step, i) => {
          const reached = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step.status} className="flex-1 flex flex-col items-center relative z-10">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isCurrent
                    ? 'border-tp-gold bg-tp-gold'
                    : reached
                    ? 'border-tp-gold bg-tp-gold/40'
                    : 'border-tp-border bg-white'
                }`}
              >
                {reached && (
                  <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-tp-gold'}`} />
                )}
              </div>
              <span
                className={`text-xs mt-2 tracking-wider text-center whitespace-nowrap ${
                  isCurrent ? 'text-tp-gold-dark font-medium' : reached ? 'text-tp-taupe' : 'text-tp-beige'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
        <div key={i} className="animate-pulse bg-tp-silk rounded h-36" />
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
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: 'easeOut' }}
              className="bg-white border border-tp-border rounded p-6 shadow-luxe"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-tp-taupe mb-1">Order ID</p>
                  <p className="font-mono text-sm text-tp-charcoal">{order.id}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                  order.status === 'cancelled'
                    ? 'bg-tp-error/10 text-tp-error'
                    : order.status === 'delivered'
                    ? 'bg-tp-success/10 text-tp-success'
                    : order.status === 'shipped'
                    ? 'bg-tp-sage/20 text-tp-sage'
                    : order.status === 'confirmed'
                    ? 'bg-tp-gold/15 text-tp-gold-dark'
                    : 'bg-tp-warning/10 text-tp-warning'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Timeline */}
              <OrderTimeline status={order.status} />

              <div className="space-y-2 mt-4 mb-4">
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
