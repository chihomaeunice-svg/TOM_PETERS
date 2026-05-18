import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { createOrder } from '../../services/firestore';
import { emailOrderConfirmation } from '../../services/email';
import { CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', zip: '', country: 'US' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const shipping = totalPrice >= 150 ? 0 : 15;
  const total = totalPrice + shipping;

  const updateAddr = (key: string, val: string) => setAddress(a => ({ ...a, [key]: val }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || items.length === 0) return;
    setError('');
    setLoading(true);
    try {
      const sellerId = items[0]?.sellerId || '';
      await createOrder({
        customerId: profile.uid,
        customerEmail: profile.email,
        customerName: profile.displayName,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          qty: i.qty,
          price: i.price,
          image: i.image,
        })),
        total,
        status: 'pending',
        shippingAddress: address,
        sellerId,
      });
      clearCart();
      setDone(true);
      emailOrderConfirmation({
        to: profile.email,
        customerName: profile.displayName,
        orderId: Date.now().toString(),
        items: items.map(i => ({ name: i.name, size: i.size, qty: i.qty, price: i.price })),
        total,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <CheckCircle2 size={56} className="mx-auto mb-6 text-tp-success" />
        <h1 className="font-display text-3xl text-tp-charcoal mb-4">Order Placed!</h1>
        <p className="text-tp-taupe leading-relaxed mb-8">
          Thank you for your order. You'll receive a confirmation email shortly.
        </p>
        <button onClick={() => navigate('/orders')} className="bg-tp-charcoal text-tp-cream px-8 py-3 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity">
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          <h2 className="font-display text-xl text-tp-charcoal">Shipping Address</h2>

          {error && <div className="bg-tp-error/10 border border-tp-error/20 rounded px-4 py-3 text-sm text-tp-error">{error}</div>}

          {[
            { label: 'Address Line 1', key: 'line1', placeholder: '123 Main St' },
            { label: 'Address Line 2 (optional)', key: 'line2', placeholder: 'Apt 4B', required: false },
            { label: 'City', key: 'city', placeholder: 'New York' },
            { label: 'State / Province', key: 'state', placeholder: 'NY' },
            { label: 'ZIP / Postal Code', key: 'zip', placeholder: '10001' },
            { label: 'Country', key: 'country', placeholder: 'US' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs tracking-widest uppercase text-tp-taupe mb-2">{f.label}</label>
              <input
                required={f.required !== false}
                value={(address as any)[f.key]}
                onChange={e => updateAddr(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full border border-tp-border rounded px-4 py-3 text-sm focus:outline-none focus:border-tp-gold bg-tp-cream"
              />
            </div>
          ))}

          <div className="bg-tp-silk border border-tp-border rounded p-4 text-sm text-tp-taupe">
            <p className="font-medium text-tp-charcoal mb-1">Payment</p>
            <p>This is a demo store. No real payment is processed.</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-tp-charcoal text-tp-cream py-4 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-60">
            {loading ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-tp-border rounded p-6 sticky top-24">
            <h2 className="font-display text-lg text-tp-charcoal mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                  <span className="text-tp-charcoal truncate mr-2">{item.name} × {item.qty} ({item.size})</span>
                  <span className="text-tp-taupe flex-shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-tp-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-tp-taupe"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between text-tp-taupe"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between font-medium text-tp-charcoal pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
