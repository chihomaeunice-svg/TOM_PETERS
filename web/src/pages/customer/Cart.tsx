import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export default function Cart() {
  const { items, totalItems, totalPrice, removeItem, updateQty } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto mb-6 text-tp-beige" />
        <h1 className="font-display text-2xl text-tp-charcoal mb-4">Your cart is empty</h1>
        <p className="text-tp-taupe mb-8">Discover our curated collection of premium clothing.</p>
        <Link to="/shop" className="bg-tp-charcoal text-tp-cream px-8 py-3 text-sm tracking-widest uppercase inline-block hover:opacity-80 transition-opacity">
          Shop Now
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 150 ? 0 : 15;
  const total = totalPrice + shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl text-tp-charcoal mb-8">Shopping Cart ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={`${item.productId}-${item.size}`} className="flex gap-4 bg-white border border-tp-border rounded p-4">
              <div className="w-20 h-24 bg-tp-silk rounded overflow-hidden flex-shrink-0">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-tp-charcoal text-sm">{item.name}</h3>
                <p className="text-xs text-tp-taupe mt-0.5">Size: {item.size}</p>
                <p className="text-tp-gold-dark font-medium mt-1">${item.price.toFixed(2)}</p>

                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                    className="w-7 h-7 border border-tp-border rounded flex items-center justify-center hover:border-tp-gold transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                    className="w-7 h-7 border border-tp-border rounded flex items-center justify-center hover:border-tp-gold transition-colors">
                    <Plus size={12} />
                  </button>
                  <button onClick={() => removeItem(item.productId, item.size)}
                    className="ml-2 text-tp-taupe hover:text-tp-error transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-sm font-medium text-tp-charcoal">
                ${(item.price * item.qty).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-tp-border rounded p-6 sticky top-24">
            <h2 className="font-display text-lg text-tp-charcoal mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-tp-taupe">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-tp-taupe">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-tp-success">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-tp-taupe">Free shipping on orders over $150</p>
              )}
              <div className="border-t border-tp-border pt-3 flex justify-between font-medium text-tp-charcoal">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => profile ? navigate('/checkout') : navigate('/login')}
              className="w-full mt-6 bg-tp-charcoal text-tp-cream py-3 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              {profile ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
