import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';
import { getLimitedDrops, Product } from '../../services/firestore';

export default function LimitedDrops() {
  const [drops, setDrops] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLimitedDrops().then(setDrops).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap size={28} className="text-tp-gold" />
          <h1 className="font-display text-4xl text-tp-charcoal tracking-wide">Limited Drops</h1>
        </div>
        <p className="text-tp-taupe max-w-xl mx-auto leading-relaxed">
          Exclusive collections released in small quantities. Once they sell out, they're gone forever.
          Secure yours before it's too late.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6 text-xs tracking-widest uppercase text-tp-gold">
          <Clock size={14} />
          <span>These items sell fast — don't wait</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-tp-silk rounded mb-3" />
              <div className="h-4 bg-tp-silk rounded w-3/4 mb-2" />
              <div className="h-4 bg-tp-silk rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : drops.length === 0 ? (
        <div className="text-center py-24">
          <Zap size={48} className="mx-auto mb-4 text-tp-beige" />
          <h2 className="font-display text-2xl text-tp-charcoal mb-3">No Active Drops</h2>
          <p className="text-tp-taupe mb-6">New limited drops are added regularly. Check back soon or browse our full collection.</p>
          <Link to="/shop" className="bg-tp-charcoal text-tp-cream px-8 py-3 text-sm tracking-widest uppercase inline-block hover:opacity-80 transition-opacity">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {drops.map(product => (
            <Link key={product.id} to={`/shop/${product.id}`} className="group">
              <div className="aspect-[3/4] bg-tp-silk rounded overflow-hidden mb-3 relative">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-4xl text-tp-beige">TP</div>
                )}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-tp-charcoal/60 to-transparent px-3 pt-3">
                  <span className="flex items-center gap-1 text-tp-gold text-xs tracking-wider uppercase">
                    <Zap size={10} /> Limited
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-tp-charcoal group-hover:text-tp-gold transition-colors">{product.name}</h3>
              <p className="text-sm text-tp-taupe mt-0.5">${product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
