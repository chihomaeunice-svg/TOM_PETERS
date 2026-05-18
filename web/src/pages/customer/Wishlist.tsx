import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Product } from '../../services/firestore';

export default function Wishlist() {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      wishlistIds.map(id =>
        getDoc(doc(db, 'products', id)).then(snap =>
          snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null
        )
      )
    ).then(results => {
      setProducts(results.filter(Boolean) as Product[]);
      setLoading(false);
    });
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-tp-charcoal tracking-wide mb-2">Saved Items</h1>
        <div className="w-12 h-px bg-tp-gold" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-tp-silk rounded mb-3" />
              <div className="h-4 bg-tp-silk rounded w-3/4 mb-2" />
              <div className="h-4 bg-tp-silk rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <Heart size={48} className="mx-auto mb-4 text-tp-beige" />
          <h2 className="font-display text-2xl text-tp-charcoal mb-3">No saved items yet</h2>
          <p className="text-tp-taupe mb-8">Items you save will appear here.</p>
          <Link
            to="/shop"
            className="bg-gold-gradient text-white px-8 py-3 text-sm tracking-widest uppercase inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ShoppingBag size={16} /> Browse Shop
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
                className="group relative"
              >
                <Link to={`/shop/${product.id}`} className="block">
                  <div className="aspect-[3/4] bg-tp-silk rounded overflow-hidden mb-3 relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-tp-taupe/30 font-display text-4xl">TP</div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-tp-charcoal group-hover:text-tp-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-tp-taupe mt-0.5">${product.price.toFixed(2)}</p>
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id!)}
                  title="Remove from saved"
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-tp-error hover:text-white transition-colors text-tp-error"
                >
                  <Heart size={15} fill="currentColor" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
