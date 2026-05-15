import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Product } from '../../services/firestore';
import { useCart } from '../../hooks/useCart';
import { ShoppingBag, ChevronLeft } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'products', id)).then(snap => {
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-tp-silk rounded" />
        <div className="space-y-4">
          <div className="h-8 bg-tp-silk rounded w-2/3" />
          <div className="h-6 bg-tp-silk rounded w-1/4" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center text-tp-taupe">
      Product not found. <Link to="/shop" className="text-tp-gold underline">Browse Shop</Link>
    </div>
  );

  const sizes = Object.entries(product.sizes || {}).filter(([, stock]) => stock > 0);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id!,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      size: selectedSize,
      qty: 1,
      sellerId: product.sellerId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-tp-taupe hover:text-tp-gold transition-colors mb-8">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-tp-silk rounded overflow-hidden">
            {product.images?.[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display text-6xl text-tp-beige">TP</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-tp-gold' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs tracking-widest uppercase text-tp-taupe mb-3">{product.category}</p>
          <h1 className="font-display text-3xl text-tp-charcoal mb-3">{product.name}</h1>
          <p className="text-2xl text-tp-gold-dark mb-6">${product.price.toFixed(2)}</p>

          <p className="text-tp-taupe leading-relaxed mb-8">{product.description}</p>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-xs tracking-widest uppercase text-tp-taupe mb-3">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map(([size]) => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border text-sm transition-colors ${
                    selectedSize === size
                      ? 'border-tp-charcoal bg-tp-charcoal text-white'
                      : 'border-tp-border text-tp-charcoal hover:border-tp-gold'
                  }`}>
                  {size}
                </button>
              ))}
              {sizes.length === 0 && <p className="text-sm text-tp-error">Out of stock</p>}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || sizes.length === 0}
            className="w-full bg-tp-charcoal text-tp-cream py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            {added ? 'Added to Cart!' : 'Add to Cart'}
          </button>

          {product.isLimitedDrop && (
            <div className="mt-4 bg-tp-gold/10 border border-tp-gold/20 rounded px-4 py-3 text-sm text-tp-gold-dark">
              ⚡ Limited Drop — Stock is very limited. Order now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
