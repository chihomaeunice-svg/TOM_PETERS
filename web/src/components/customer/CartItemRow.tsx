import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, useCart } from '../../hooks/useCart';

export const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-tp-border last:border-b-0">
      <div className="h-24 w-20 rounded-lg overflow-hidden bg-tp-silk flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-tp-taupe font-display">TP</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-display text-tp-charcoal truncate">{item.name}</h4>
            <p className="label-caps text-tp-taupe mt-0.5">Size {item.size}</p>
          </div>
          <p className="font-medium text-tp-charcoal whitespace-nowrap">${(item.price * item.qty).toFixed(2)}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center bg-tp-silk rounded-full">
            <button
              onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
              className="p-2 hover:text-tp-gold-dark"
              aria-label="Decrease"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm tabular-nums">{item.qty}</span>
            <button
              onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
              className="p-2 hover:text-tp-gold-dark"
              aria-label="Increase"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.size)}
            className="inline-flex items-center gap-1 text-xs text-tp-taupe hover:text-tp-error"
          >
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
