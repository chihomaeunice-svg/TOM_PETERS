import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getSellerProducts, updateProduct, deleteProduct, Product } from '../../services/firestore';

export default function SellerProducts() {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!profile) return;
    setLoading(true);
    getSellerProducts(profile.uid).then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, [profile]);

  const toggleActive = async (product: Product) => {
    await updateProduct(product.id!, { isActive: !product.isActive });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await deleteProduct(id);
    load();
  };

  const activeCount = products.filter(p => p.isActive).length;
  const hiddenCount = products.length - activeCount;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-3xl text-tp-charcoal">Products</h1>
        <Link to="/seller/products/new"
          className="flex items-center gap-2 bg-tp-charcoal text-tp-cream px-5 py-2.5 text-sm tracking-wider uppercase hover:opacity-80 transition-opacity">
          <Plus size={16} /> Add Product
        </Link>
      </div>
      {products.length > 0 && (
        <p className="text-sm text-tp-taupe mb-6">
          <span className="text-tp-success font-medium">{activeCount} active</span>
          {hiddenCount > 0 && <span className="ml-2 text-tp-taupe">{hiddenCount} hidden</span>}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-white rounded h-20" />)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-tp-border rounded">
          <p className="text-tp-taupe mb-4">You haven't listed any products yet.</p>
          <Link to="/seller/products/new" className="bg-tp-charcoal text-tp-cream px-6 py-2.5 text-sm tracking-wider uppercase inline-block hover:opacity-80 transition-opacity">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-tp-border rounded overflow-hidden shadow-luxe">
          <table className="w-full text-sm">
            <thead className="bg-tp-silk border-b border-tp-border">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-tp-taupe">Product</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-tp-taupe">Category</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-tp-taupe">Price</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-tp-taupe">Status</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-tp-taupe">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tp-border">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-tp-silk/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-tp-silk rounded overflow-hidden flex-shrink-0">
                        {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-tp-charcoal">{p.name}</p>
                        {p.isLimitedDrop && <span className="text-xs text-tp-gold">Limited Drop</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-tp-taupe capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-tp-charcoal">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-tp-success/10 text-tp-success' : 'bg-tp-taupe/10 text-tp-taupe'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleActive(p)} title={p.isActive ? 'Hide' : 'Show'}
                        className="p-1.5 text-tp-taupe hover:text-tp-gold transition-colors">
                        {p.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link to={`/seller/products/${p.id}/edit`}
                        className="p-1.5 text-tp-taupe hover:text-tp-gold transition-colors">
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(p.id!)}
                        className="p-1.5 text-tp-taupe hover:text-tp-error transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
