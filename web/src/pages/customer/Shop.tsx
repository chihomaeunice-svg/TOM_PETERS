import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getProducts, Product } from '../../services/firestore';

const CATEGORIES = ['All', 'Outerwear', 'Knitwear', 'Shirts', 'Trousers', 'Accessories'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    getProducts(category === 'all' ? undefined : category)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category]);

  const filtered = products.filter(p =>
    search === '' ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-tp-charcoal tracking-wide mb-2">Shop</h1>
        <div className="w-12 h-px bg-tp-gold" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tp-taupe" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 border border-tp-border rounded text-sm focus:outline-none focus:border-tp-gold bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat.toLowerCase() })}
              className={`px-4 py-2 text-xs tracking-widest uppercase rounded transition-colors ${
                (cat === 'All' && category === 'all') || cat.toLowerCase() === category
                  ? 'bg-tp-charcoal text-white'
                  : 'border border-tp-border text-tp-taupe hover:border-tp-gold hover:text-tp-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-tp-silk rounded mb-3" />
              <div className="h-4 bg-tp-silk rounded w-3/4 mb-2" />
              <div className="h-4 bg-tp-silk rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-tp-taupe">
          <SlidersHorizontal size={40} className="mx-auto mb-4 opacity-30" />
          <p>No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <Link key={product.id} to={`/shop/${product.id}`} className="group">
              <div className="aspect-[3/4] bg-tp-silk rounded overflow-hidden mb-3 relative">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-tp-taupe/30 font-display text-4xl">TP</div>
                )}
                {product.isLimitedDrop && (
                  <span className="absolute top-2 left-2 bg-tp-charcoal text-tp-gold text-xs px-2 py-1 tracking-wider uppercase">Limited</span>
                )}
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
